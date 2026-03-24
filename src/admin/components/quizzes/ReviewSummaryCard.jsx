import QuizStatusBadge from './QuizStatusBadge'

function Item({ label, value }) {
  return (
    <div className="border border-[#EAEAEA] rounded-lg px-4 py-3 bg-white">
      <p className="text-xs uppercase tracking-wide text-[#8A8A8A] mb-1">{label}</p>
      <p className="text-sm text-[#1A1A1A] break-words">{value}</p>
    </div>
  )
}

export default function ReviewSummaryCard({ quiz }) {
  const reviewedQuestions = quiz.questions.filter(
    q => q.review?.estadoRevision !== 'pendiente'
  ).length
  const invalidQuestions = quiz.questions.filter(
    q => q.review?.estadoRevision === 'incorrecta'
  ).length

  return (
    <div className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A1A]">Resumen de revisión</h3>
          <p className="text-sm text-[#8A8A8A] mt-1">
            Estado general del quiz y avance de validación
          </p>
        </div>

        <QuizStatusBadge status={quiz.review.estado} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Item label="Preguntas revisadas" value={`${reviewedQuestions} / ${quiz.questionsCount}`} />
        <Item label="Preguntas con error" value={invalidQuestions} />
        <Item label="Promedio histórico" value={`${quiz.avgScore}%`} />
        <Item label="Intentos realizados" value={quiz.attempts} />
      </div>
    </div>
  )
}
