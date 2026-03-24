import GamificationStats from '../components/gamification/GamificationStats'
import XPLevelsPanel from '../components/gamification/XPLevelsPanel'
import LeaderboardPanel from '../components/gamification/LeaderboardPanel'
import AchievementsPanel from '../components/gamification/AchievementsPanel'
import { useGamificationData } from '../hooks/useGamificationData'

export default function Gamification() {
  const {
    loading,
    error,
    stats,
    leaderboard,
    achievements,
    achievementUnlockedCount,
    xpLevels,
    formatNumber,
  } = useGamificationData()

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">XP y Gamificación</h1>
          <p className="text-[16px] text-[#8A8A8A]">Cargando datos...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-[#EAEAEA] animate-pulse h-[104px]"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] animate-pulse h-[420px]" />
          <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] animate-pulse h-[420px]" />
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] animate-pulse h-[420px]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">XP y Gamificación</h1>
          <p className="text-[16px] text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">XP y Gamificación</h1>
        <p className="text-[16px] text-[#8A8A8A]">
          Supervisa niveles, ranking y logros del sistema de recompensas
        </p>
      </div>

      <GamificationStats
        stats={stats}
        achievementUnlockedCount={achievementUnlockedCount}
        formatNumber={formatNumber}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <XPLevelsPanel xpLevels={xpLevels} />
        <LeaderboardPanel leaderboard={leaderboard} formatNumber={formatNumber} />
      </div>

      <AchievementsPanel achievements={achievements} />
    </div>
  )
}
