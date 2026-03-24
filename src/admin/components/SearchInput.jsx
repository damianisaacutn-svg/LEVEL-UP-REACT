import { Search } from 'lucide-react'

export function SearchInput({ value, onChange }) {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar por nombre o correo..."
        className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-lg text-sm focus:ring-2 focus:ring-[#FF2D55]"
      />
    </div>
  )
}
