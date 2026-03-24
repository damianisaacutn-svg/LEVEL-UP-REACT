import { Trophy } from 'lucide-react'

export default function AchievementsPanel({ achievements }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] shadow-sm">
      <div className="mb-6">
        <h3 className="text-[20px] font-bold text-[#1A1A1A]">Logros Disponibles</h3>
        <p className="text-[14px] text-[#8A8A8A] mt-1">
          Estado actual de los logros calculados dentro del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {achievements.map(achievement => {
          const Icon = achievement.icon

          return (
            <div
              key={achievement.id}
              className={`p-6 border-2 rounded-xl transition-all duration-300 group hover:shadow-lg ${
                achievement.unlocked
                  ? 'border-[#FF2D55] bg-[#FFF5F7]'
                  : 'border-[#EAEAEA] hover:border-[#FF2D55]'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0"
                  style={{ backgroundColor: `${achievement.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: achievement.color }} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-[16px] font-bold text-[#1A1A1A] mb-1">{achievement.name}</h4>
                  <p className="text-[12px] text-[#8A8A8A] leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA] gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FF2D55]" />
                  <span className="text-[14px] font-bold text-[#FF2D55]">+{achievement.xp} XP</span>
                </div>

                <div className="text-right">
                  <p className="text-[12px] text-[#8A8A8A]">Desbloqueado</p>
                  <p className="text-[14px] font-bold text-[#1A1A1A]">{achievement.unlockedText}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
