import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function InputField({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) {
  const [showPassword, setShowPassword] = React.useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="w-full">
      <label htmlFor={name} className="block mb-2 text-[#1A1A1A]">
        {label}
        {required && <span className="text-[#FF2D55] ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
            error
              ? 'border-[#FF2D55] bg-red-50 focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20'
              : 'border-[#EAEAEA] bg-white hover:border-[#8A8A8A] focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20'
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#4A4A4A] transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-[#FF2D55] flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-[#FF2D55]"></span>
          {error}
        </p>
      )}
    </div>
  )
}
