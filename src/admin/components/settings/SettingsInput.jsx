export default function SettingsInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  textarea = false,
  rows = 3,
  min,
  max,
  helperText,
}) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-[#1A1A1A] mb-2">{label}</label>

      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-lg text-[14px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF2D55] focus:border-transparent resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          onChange={e => onChange?.(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-lg text-[14px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF2D55] focus:border-transparent"
        />
      )}

      {helperText ? <p className="text-[12px] text-[#8A8A8A] mt-2">{helperText}</p> : null}
    </div>
  )
}
