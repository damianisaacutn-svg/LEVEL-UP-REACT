export function UserCell({ name }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55] to-[#FF6B8A] rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {name
            .split(' ')
            .map(n => n[0])
            .join('')}
        </span>
      </div>
      <span className="text-sm font-medium text-[#1A1A1A]">{name}</span>
    </div>
  )
}
