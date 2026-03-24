import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ClipboardList, Layers3, Save, Target, Users, X } from 'lucide-react'
import QuestionReviewCard from './QuestionReviewCard'
import QuizStatusBadge from './QuizStatusBadge'
import ReviewSummaryCard from './ReviewSummaryCard'

function MiniCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#EAEAEA] bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#8A8A8A]" />
        <span className="text-sm text-[#8A8A8A]">{label}</span>
      </div>
      <p className="text-lg font-bold text-[#1A1A1A] break-words">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="border border-[#EAEAEA] rounded-lg px-4 py-3 bg-white">
      <p className="text-xs uppercase tracking-wide text-[#8A8A8A] mb-1">{label}</p>
      <p className="text-sm text-[#1A1A1A] break-words">{value}</p>
    </div>
  )
}

function formatDate(date) {
  if (!date) return 'N/A'

  try {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'N/A'
  }
}

export default function QuizReviewDrawer({
  open,
  quiz,
  onClose,
  onSaveQuizReview,
  onSaveQuestionReview,
  saving,
  errorMsg,
}) {
  const [estado, setEstado] = useState('pendiente')
  const [comentarioGeneral, setComentarioGeneral] = useState('')
  const [esApto, setEsApto] = useState(null)
  const [publicar, setPublicar] = useState(false)

  useEffect(() => {
    if (!quiz) return

    setEstado(quiz.review?.estado || 'pendiente')
    setComentarioGeneral(quiz.review?.comentarioGeneral || '')
    setEsApto(quiz.review?.esApto ?? null)
    setPublicar(!!quiz.review?.publicar)
  }, [quiz])

  const questionsSummary = useMemo(() => {
    if (!quiz?.questions?.length) {
      return {
        correctas: 0,
        observaciones: 0,
        incorrectas: 0,
        pendientes: 0,
      }
    }

    return quiz.questions.reduce(
      (acc, q) => {
        const status = q.review?.estadoRevision || 'pendiente'
        if (status === 'correcta') acc.correctas += 1
        else if (status === 'con_observaciones') acc.observaciones += 1
        else if (status === 'incorrecta') acc.incorrectas += 1
        else acc.pendientes += 1
        return acc
      },
      {
        correctas: 0,
        observaciones: 0,
        incorrectas: 0,
        pendientes: 0,
      }
    )
  }, [quiz])

  if (!open || !quiz) return null

  const handleSaveGeneral = () => {
    onSaveQuizReview({
      estado,
      comentarioGeneral,
      esApto,
      publicar,
    })
  }

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 md:p-6"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-start justify-between gap-4 bg-white">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
                Revisión administrativa del quiz
              </h2>
              <QuizStatusBadge status={estado} />
            </div>
            <p className="text-sm text-[#8A8A8A]">
              Valida estructura, preguntas, respuestas correctas y decisión de publicación
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5 text-[#4A4A4A]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FCFCFC]">
          {errorMsg ? (
            <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
              {errorMsg}
            </div>
          ) : null}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 bg-white border border-[#EAEAEA] rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">{quiz.title}</h3>
                <p className="text-sm text-[#8A8A8A] mt-2">{quiz.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <MiniCard icon={ClipboardList} label="Preguntas" value={quiz.questionsCount} />
                <MiniCard icon={Users} label="Intentos" value={quiz.attempts} />
                <MiniCard icon={Target} label="Promedio" value={`${quiz.avgScore}%`} />
                <MiniCard icon={BookOpen} label="Curso" value={quiz.courseTitle} />
                <MiniCard icon={Layers3} label="Módulo" value={quiz.moduleOrder} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <InfoRow label="Curso" value={quiz.courseTitle} />
                <InfoRow label="Módulo" value={`${quiz.moduleOrder}. ${quiz.moduleTitle}`} />
                <InfoRow label="Instructor" value={quiz.instructorName} />
                <InfoRow label="Correo del instructor" value={quiz.instructorEmail || 'N/A'} />
                <InfoRow label="Fecha de creación" value={formatDate(quiz.createdAt)} />
                <InfoRow label="Última actualización" value={formatDate(quiz.updatedAt)} />
              </div>
            </div>

            <ReviewSummaryCard quiz={quiz} />
          </div>

          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Decisión administrativa</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Estado del quiz
                </label>
                <select
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_revision">En revisión</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="requiere_cambios">Requiere cambios</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  ¿Es apto para el curso?
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEsApto(true)}
                    className={`px-4 py-3 rounded-lg border text-sm ${
                      esApto === true
                        ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                        : 'bg-white border-[#EAEAEA] text-[#4A4A4A]'
                    }`}
                  >
                    Sí, es apto
                  </button>

                  <button
                    type="button"
                    onClick={() => setEsApto(false)}
                    className={`px-4 py-3 rounded-lg border text-sm ${
                      esApto === false
                        ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
                        : 'bg-white border-[#EAEAEA] text-[#4A4A4A]'
                    }`}
                  >
                    No es apto
                  </button>

                  <button
                    type="button"
                    onClick={() => setEsApto(null)}
                    className={`px-4 py-3 rounded-lg border text-sm ${
                      esApto === null
                        ? 'bg-[#F8F9FA] border-[#D1D5DB] text-[#4A4A4A]'
                        : 'bg-white border-[#EAEAEA] text-[#4A4A4A]'
                    }`}
                  >
                    Sin definir
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              <div className="border border-[#EAEAEA] rounded-xl p-4 bg-[#FAFAFA]">
                <p className="text-sm text-[#8A8A8A]">Correctas</p>
                <p className="text-2xl font-bold text-[#2ECC71]">{questionsSummary.correctas}</p>
              </div>

              <div className="border border-[#EAEAEA] rounded-xl p-4 bg-[#FAFAFA]">
                <p className="text-sm text-[#8A8A8A]">Observaciones</p>
                <p className="text-2xl font-bold text-[#F39C12]">
                  {questionsSummary.observaciones}
                </p>
              </div>

              <div className="border border-[#EAEAEA] rounded-xl p-4 bg-[#FAFAFA]">
                <p className="text-sm text-[#8A8A8A]">Incorrectas</p>
                <p className="text-2xl font-bold text-[#E74C3C]">{questionsSummary.incorrectas}</p>
              </div>

              <div className="border border-[#EAEAEA] rounded-xl p-4 bg-[#FAFAFA]">
                <p className="text-sm text-[#8A8A8A]">Pendientes</p>
                <p className="text-2xl font-bold text-[#7B61FF]">{questionsSummary.pendientes}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Comentario general para el instructor
              </label>
              <textarea
                rows={4}
                value={comentarioGeneral}
                onChange={e => setComentarioGeneral(e.target.value)}
                placeholder="Escribe observaciones generales sobre el quiz, su relación con el curso, nivel de calidad y cambios sugeridos..."
                className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={publicar}
                  onChange={e => setPublicar(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D1D5DB]"
                />
                <span className="text-sm text-[#1A1A1A]">Marcar como listo para publicarse</span>
              </label>

              <button
                type="button"
                onClick={handleSaveGeneral}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#FF2D55] text-white hover:bg-[#E02849] transition-colors disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                Guardar decisión administrativa
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">Revisión de preguntas</h3>
              <p className="text-sm text-[#8A8A8A] mt-1">
                Valida texto, opciones, respuesta correcta y coherencia con el módulo
              </p>
            </div>

            {quiz.questions.length > 0 ? (
              quiz.questions.map((question, index) => (
                <QuestionReviewCard
                  key={question.id}
                  question={question}
                  index={index}
                  onSave={onSaveQuestionReview}
                  saving={saving}
                />
              ))
            ) : (
              <div className="border border-[#EAEAEA] rounded-xl p-6 bg-white">
                <p className="text-sm text-[#8A8A8A]">Este quiz no tiene preguntas asociadas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
