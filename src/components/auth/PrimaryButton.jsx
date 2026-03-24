import React from 'react'
import { Loader2 } from 'lucide-react'

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
}) {
  const baseClasses = `
    px-6 py-3 rounded-xl font-medium
    transition-all duration-200
    flex items-center justify-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  const variantClasses = {
    primary: `
      bg-[#FF2D55] text-white
      hover:bg-[#FF6B8A] hover:shadow-lg hover:shadow-[#FF2D55]/25
      active:scale-[0.98]
      disabled:hover:bg-[#FF2D55] disabled:hover:shadow-none
    `,
    secondary: `
      bg-[#7B61FF] text-white
      hover:bg-[#9580FF] hover:shadow-lg hover:shadow-[#7B61FF]/25
      active:scale-[0.98]
      disabled:hover:bg-[#7B61FF] disabled:hover:shadow-none
    `,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading && <Loader2 className="animate-spin" size={20} />}
      {children}
    </button>
  )
}
