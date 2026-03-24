import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatCard({
  title,
  value,
  icon: Icon,
  growth,
  iconColor = '#FF2D55',
  iconBgColor = '#FFF5F7',
}) {
  const isPositive = growth !== undefined && growth >= 0

  return (
    <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex items-start justify-between">
        {/* Info */}
        <div className="flex-1">
          <p className="text-sm text-[#8A8A8A] mb-2">{title}</p>

          <h3 className="text-3xl font-bold text-[#1A1A1A] mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>

          {growth !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-[#2ECC71]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#E74C3C]" />
              )}

              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-[#2ECC71]' : 'text-[#E74C3C]'
                }`}
              >
                {isPositive ? '+' : ''}
                {growth}%
              </span>

              <span className="text-sm text-[#8A8A8A] ml-1">vs mes anterior</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="w-7 h-7" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  )
}
