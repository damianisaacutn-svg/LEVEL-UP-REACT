export default function SettingsToggle({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-[#F8F9FA] rounded-lg border border-transparent hover:border-[#EAEAEA] transition-colors">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-[#1A1A1A]">{title}</p>
        <p className="text-[12px] text-[#8A8A8A] mt-1">{description}</p>
      </div>

      <label
        className={`relative inline-flex items-center ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#D9D9D9] rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF2D55] peer-checked:bg-[#FF2D55] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-[#D0D0D0] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
      </label>
    </div>
  )
}
