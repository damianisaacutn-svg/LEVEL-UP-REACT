import { Edit, Eye, FileQuestion, Trash2 } from 'lucide-react'
import QuizStatusBadge from './QuizStatusBadge'

function Th({ children, center }) {
  return (
    <th className={`px-6 py-4 text-sm font-semibold ${center ? 'text-center' : 'text-left'}`}>
      {children}
    </th>
  )
}

function Td({ children, center }) {
  return (
    <td className={`px-6 py-4 text-sm text-[#4A4A4A] ${center ? 'text-center' : ''}`}>
      {children}
    </td>
  )
}

function IconBox() {
  return (
    <div className="w-10 h-10 bg-[#FFF5F7] rounded-lg flex items-center justify-center shrink-0">
      <FileQuestion className="w-5 h-5 text-[#FF2D55]" />
    </div>
  )
}

function Bar({ value }) {
  return (
    <div className="w-20 h-2 bg-[#EAEAEA] rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A]"
        style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
      />
    </div>
  )
}

function ActionButton({ icon: Icon, onClick, danger = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
        danger
          ? 'bg-[#FEF2F2] text-[#E74C3C] hover:bg-[#FEE2E2]'
          : 'bg-[#F5F5F5] text-[#4A4A4A] hover:bg-[#EAEAEA]'
      } disabled:opacity-60`}
    >
      <Icon className="w-4 h-4" />
    </button>
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

export default function QuizTable({ quizzes, deletingId, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
        <span className="text-sm text-[#4A4A4A]">
          {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} encontrados
        </span>
      </div>

      {quizzes.length === 0 ? (
        <div className="p-10 text-center">
          <FileQuestion className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No hay quizzes para mostrar</h3>
          <p className="text-sm text-[#8A8A8A]">
            Cambia los filtros para revisar otras evaluaciones.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1600px]">
            <thead className="bg-[#F8F9FA] border-b border-[#EAEAEA]">
              <tr>
                <Th>Quiz</Th>
                <Th>Curso</Th>
                <Th>Módulo</Th>
                <Th>Instructor</Th>
                <Th center>Estado</Th>
                <Th center>Preguntas</Th>
                <Th center>Intentos</Th>
                <Th center>Promedio</Th>
                <Th center>Publicar</Th>
                <Th>Fecha</Th>
                <Th center>Acciones</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAEAEA]">
              {quizzes.map(q => (
                <tr key={q.id} className="hover:bg-[#F8F9FA]">
                  <Td>
                    <div className="flex items-center gap-3">
                      <IconBox />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{q.title}</p>
                        <p className="text-xs text-[#8A8A8A] line-clamp-1">{q.description}</p>
                      </div>
                    </div>
                  </Td>

                  <Td>{q.courseTitle}</Td>
                  <Td>
                    {q.moduleOrder}. {q.moduleTitle}
                  </Td>
                  <Td>{q.instructorName}</Td>
                  <Td center>
                    <QuizStatusBadge status={q.review.estado} />
                  </Td>
                  <Td center>{q.questionsCount}</Td>
                  <Td center>{q.attempts}</Td>
                  <Td center>
                    <div className="flex items-center gap-2 justify-center">
                      <Bar value={q.avgScore} />
                      <span>{q.avgScore}%</span>
                    </div>
                  </Td>
                  <Td center>{q.review.publicar ? 'Sí' : 'No'}</Td>
                  <Td>{formatDate(q.createdAt)}</Td>
                  <Td center>
                    <div className="flex justify-center gap-2">
                      <ActionButton icon={Eye} onClick={() => onView(q)} />
                      <ActionButton icon={Edit} onClick={() => onEdit(q)} />
                      <ActionButton
                        icon={Trash2}
                        danger
                        disabled={deletingId === q.id}
                        onClick={() => onDelete(q)}
                      />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
