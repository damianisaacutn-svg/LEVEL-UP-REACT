import { useEffect, useState } from 'react'
import { CheckCircle2, CircleAlert, Save, XCircle } from 'lucide-react'

const checklistLabels = {
  redaccion_correcta: 'Redacción correcta',
  respuestas_coherentes: 'Respuestas coherentes',
  respuesta_correcta_valida: 'Respuesta correcta válida',
  relacionada_modulo: 'Relacionada con el módulo',
}

function QuestionStatusBadge({ status }) {
  const map = {
    pendiente: 'bg-[#F5F5F5] text-[#4A4A4A] border-[#E5E7EB]',
    correcta: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
    con_observaciones: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
    incorrecta: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
  }

  const labels = {
    pendiente: 'Pendiente',
    correcta: 'Correcta',
    con_observaciones: 'Con observaciones',
    incorrecta: 'Incorrecta',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${map[status]}`}
    >
      {labels[status]}
    </span>
  )
}

export default function QuestionReviewCard({ question, index, onSave, saving }) {
  const [estado, setEstado] = useState(question.review?.estadoRevision || 'pendiente')
  const [comentario, setComentario] = useState(question.review?.comentario || '')
  const [checklist, setChecklist] = useState(
    question.review?.checklist || {
      redaccion_correcta: null,
      respuestas_coherentes: null,
      respuesta_correcta_valida: null,
      relacionada_modulo: null,
    }
  )

  useEffect(() => {
    setEstado(question.review?.estadoRevision || 'pendiente')
    setComentario(question.review?.comentario || '')
    setChecklist(
      question.review?.checklist || {
        redaccion_correcta: null,
        respuestas_coherentes: null,
        respuesta_correcta_valida: null,
        relacionada_modulo: null,
      }
    )
  }, [question])

  const updateCheck = (key, value) => {
    setChecklist(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    onSave({
      preguntaId: question.id,
      estado,
      comentario,
      checklist,
    })
  }

  return (
    <div className="border border-[#EAEAEA] rounded-2xl p-5 bg-[#FCFCFC] space-y-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <p className="text-sm text-[#8A8A8A] mb-1">Pregunta {index + 1}</p>
          <h4 className="text-base font-semibold text-[#1A1A1A]">{question.text}</h4>
        </div>

        <QuestionStatusBadge status={estado} />
      </div>

      <div className="space-y-3">
        {question.answers.map((answer, answerIndex) => (
          <div
            key={answer.id}
            className={`rounded-xl border px-4 py-3 text-sm ${
              answer.isCorrect
                ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                : 'border-[#EAEAEA] bg-white text-[#4A4A4A]'
            }`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + answerIndex)}.</span>
            {answer.text}
            {answer.isCorrect ? ' • Correcta' : ''}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(checklistLabels).map(key => (
          <div key={key} className="border border-[#EAEAEA] rounded-xl p-4 bg-white">
            <p className="text-sm font-medium text-[#1A1A1A] mb-3">{checklistLabels[key]}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateCheck(key, true)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  checklist[key] === true
                    ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                    : 'bg-white border-[#EAEAEA] text-[#4A4A4A]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Sí
              </button>

              <button
                type="button"
                onClick={() => updateCheck(key, false)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  checklist[key] === false
                    ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
                    : 'bg-white border-[#EAEAEA] text-[#4A4A4A]'
                }`}
              >
                <XCircle className="w-4 h-4" />
                No
              </button>

              <button
                type="button"
                onClick={() => updateCheck(key, null)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  checklist[key] === null
                    ? 'bg-[#F8F9FA] border-[#D1D5DB] text-[#4A4A4A]'
                    : 'bg-white border-[#EAEAEA] text-[#4A4A4A]'
                }`}
              >
                <CircleAlert className="w-4 h-4" />
                N/A
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Estado de revisión
          </label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          >
            <option value="pendiente">Pendiente</option>
            <option value="correcta">Correcta</option>
            <option value="con_observaciones">Con observaciones</option>
            <option value="incorrecta">Incorrecta</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Comentario para el instructor
          </label>
          <textarea
            rows={3}
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Ej. La respuesta correcta no coincide con el contenido del módulo..."
            className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#FF2D55] text-white hover:bg-[#E02849] transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          Guardar revisión de pregunta
        </button>
      </div>
    </div>
  )
}
