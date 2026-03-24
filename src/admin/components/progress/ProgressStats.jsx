import { Award, Target, TrendingUp } from 'lucide-react'

export default function ProgressStats({ stats }) {
  const items = [
    {
      label: 'Progreso promedio',
      value: `${stats.averageProgress}%`,
      icon: Target,
      iconBg: 'bg-blue-50',
      iconColor: 'text-[#3A86FF]',
    },
    {
      label: 'XP total acumulado',
      value: Number(stats.totalXP || 0).toLocaleString(),
      icon: Award,
      iconBg: 'bg-rose-50',
      iconColor: 'text-[#FF2D55]',
    },
    {
      label: 'Cursos completados',
      value: stats.completedCourses,
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-[#2ECC71]',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map(item => {
        const Icon = item.icon

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon className={`h-7 w-7 ${item.iconColor}`} />
              </div>

              <div>
                <p className="text-sm text-[#8A8A8A]">{item.label}</p>
                <p className="mt-1 text-[20px] font-bold text-[#1A1A1A]">{item.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
