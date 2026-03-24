export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'

  const variants = {
    default: '',
    secondary: 'bg-gray-200 text-gray-800',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-300 text-gray-700',
  }

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
}
