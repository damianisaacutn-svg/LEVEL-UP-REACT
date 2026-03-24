export default function SettingsSectionCard({
  icon: Icon,
  iconBg = 'bg-[#FFF5F7]',
  iconColor = 'text-[#FF2D55]',
  title,
  description,
  children,
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#EAEAEA] shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {Icon ? <Icon className={`w-6 h-6 ${iconColor}`} /> : null}
        </div>

        <div>
          <h3 className="text-[20px] font-bold text-[#1A1A1A] leading-tight">{title}</h3>
          <p className="text-[14px] text-[#8A8A8A] mt-1">{description}</p>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  )
}
