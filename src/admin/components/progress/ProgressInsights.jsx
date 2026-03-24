export default function ProgressInsights({ users }) {
  if (!users?.length) return null

  const bestPerformance = [...users]
    .sort((a, b) => Number(b.averageProgress || 0) - Number(a.averageProgress || 0))
    .slice(0, 3)

  const topXP = [...users]
    .sort((a, b) => Number(b.totalXP || 0) - Number(a.totalXP || 0))
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <RankingCard
        title="Mejor desempeño"
        subtitle="Usuarios con mayor progreso promedio"
        list={bestPerformance}
        field="averageProgress"
        suffix="%"
        gradient="from-[#FF416C] to-[#FF4B6E]"
      />

      <RankingCard
        title="Mayor XP ganado"
        subtitle="Usuarios con mayor acumulado de experiencia"
        list={topXP}
        field="totalXP"
        suffix=" XP"
        gradient="from-[#7B61FF] to-[#3A86FF]"
      />
    </div>
  )
}

function RankingCard({ title, subtitle, list, field, suffix, gradient }) {
  return (
    <section className={`rounded-3xl bg-gradient-to-br ${gradient} p-8 text-white shadow-sm`}>
      <h3 className="text-[20px] font-bold">{title}</h3>
      <p className="mt-1 text-sm text-white/80">{subtitle}</p>

      <div className="mt-6 space-y-4">
        {list.map((user, index) => (
          <div
            key={user.usuarioId}
            className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white/70">#{index + 1}</span>
              <div>
                <p className="font-semibold">{user.studentName}</p>
                <p className="text-sm text-white/75">{user.status}</p>
              </div>
            </div>

            <span className="text-lg font-bold">
              {user[field]}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
