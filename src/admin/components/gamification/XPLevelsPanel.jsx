export default function XPLevelsPanel({ xpLevels }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[20px] font-bold text-[#1A1A1A]">Niveles de XP</h3>
          <p className="text-[14px] text-[#8A8A8A] mt-1">
            Escala de progresión configurada para la plataforma
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {xpLevels.map(level => (
          <div
            key={level.level}
            className="p-4 border border-[#EAEAEA] rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: level.color }}
                >
                  {level.level}
                </div>

                <div>
                  <h4 className="text-[16px] font-bold text-[#1A1A1A]">{level.name}</h4>
                  <p className="text-[12px] text-[#8A8A8A]">Nivel {level.level}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[14px] font-bold" style={{ color: level.color }}>
                  {level.minXP} - {level.maxXP === 999999 ? '∞' : level.maxXP} XP
                </p>
              </div>
            </div>

            <div className="h-2 bg-[#EAEAEA] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: level.color,
                  width: `${(level.level / xpLevels.length) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
