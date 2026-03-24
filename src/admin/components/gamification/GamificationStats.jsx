import { Trophy, Award, Star, Crown } from 'lucide-react'

export default function GamificationStats({ stats, achievementUnlockedCount, formatNumber }) {
  const items = [
    {
      id: 'xp-total',
      title: 'XP Total',
      value: formatNumber(stats.totalXPGlobal),
      icon: Trophy,
      iconColor: 'text-[#FF2D55]',
      iconBg: 'bg-[#FFF5F7]',
    },
    {
      id: 'logros',
      title: 'Logros',
      value: `${achievementUnlockedCount}/${stats.totalAchievements}`,
      icon: Award,
      iconColor: 'text-[#7B61FF]',
      iconBg: 'bg-[#F5F3FF]',
    },
    {
      id: 'xp-promedio',
      title: 'XP Promedio',
      value: formatNumber(stats.averageXP),
      icon: Star,
      iconColor: 'text-[#F39C12]',
      iconBg: 'bg-[#FFF9E6]',
    },
    {
      id: 'nivel-maximo',
      title: 'Nivel Máximo',
      value: stats.maxLevel,
      icon: Crown,
      iconColor: 'text-[#3A86FF]',
      iconBg: 'bg-[#EFF6FF]',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map(item => {
        const Icon = item.icon

        return (
          <div key={item.id} className="bg-white rounded-xl p-6 border border-[#EAEAEA] shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.iconBg}`}
              >
                <Icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>

              <div>
                <p className="text-[14px] text-[#8A8A8A] mb-1">{item.title}</p>
                <p className="text-[24px] font-bold text-[#1A1A1A]">{item.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
