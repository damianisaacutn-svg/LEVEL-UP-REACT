export default function LeaderboardPanel({ leaderboard, formatNumber }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[20px] font-bold text-[#1A1A1A]">Tabla de Líderes</h3>
          <p className="text-[14px] text-[#8A8A8A] mt-1">
            Top 5 usuarios con mayor acumulación de XP
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="p-4 border border-[#EAEAEA] rounded-lg text-[#8A8A8A]">
            No hay datos suficientes para mostrar el ranking.
          </div>
        ) : (
          leaderboard.map(user => (
            <div
              key={user.id}
              className={`p-4 rounded-lg transition-all duration-200 ${
                user.rank === 1
                  ? 'bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-2 border-[#FFD700]'
                  : user.rank === 2
                    ? 'bg-gradient-to-r from-[#C0C0C0]/10 to-[#808080]/10 border border-[#C0C0C0]'
                    : user.rank === 3
                      ? 'bg-gradient-to-r from-[#CD7F32]/10 to-[#8B4513]/10 border border-[#CD7F32]'
                      : 'border border-[#EAEAEA] hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${
                      user.rank === 1
                        ? 'bg-[#FFD700] text-white'
                        : user.rank === 2
                          ? 'bg-[#C0C0C0] text-white'
                          : user.rank === 3
                            ? 'bg-[#CD7F32] text-white'
                            : 'bg-[#EAEAEA] text-[#4A4A4A]'
                    }`}
                  >
                    {user.rank}
                  </div>

                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55] to-[#FF6B8A] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-[12px] font-medium">{user.avatar}</span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-[#1A1A1A] truncate">{user.name}</h4>
                    <p className="text-[12px] text-[#8A8A8A]">{user.level}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[16px] font-bold text-[#FF2D55]">{formatNumber(user.xp)} XP</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
