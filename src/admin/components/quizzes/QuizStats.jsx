function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#EAEAEA]">
      <p className="text-sm text-[#8A8A8A]">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}

export default function QuizStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5">
      <StatCard label="Total quizzes" value={stats.totalQuizzes} color="#1A1A1A" />
      <StatCard label="Pendientes" value={stats.pending} color="#F39C12" />
      <StatCard label="En revisión" value={stats.reviewing} color="#3A86FF" />
      <StatCard label="Aprobados" value={stats.approved} color="#2ECC71" />
      <StatCard label="Requiere cambios" value={stats.changes} color="#FF2D55" />
      <StatCard label="Rechazados" value={stats.rejected} color="#E74C3C" />
    </div>
  )
}
