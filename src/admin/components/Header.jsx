import { Search, Bell, ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()

  const [notificationCount] = useState(3)
  const [userName, setUserName] = useState('...')
  const [userRole, setUserRole] = useState('...')
  const [initials, setInitials] = useState('U')
  const [openMenu, setOpenMenu] = useState(false)

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const userId = user.id

      const { data: profile } = await supabase
        .from('usuario')
        .select('nombre')
        .eq('id_usuario', userId)
        .maybeSingle()

      const name = profile?.nombre || user.email || 'Usuario'
      setUserName(name)

      const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()

      setInitials(initials)

      // 🔥 Rol
      const { data: adminData } = await supabase
        .from('administrador')
        .select('id_admin')
        .eq('usuario_id', userId)
        .maybeSingle()

      if (adminData) {
        setUserRole('Administrador')
        return
      }

      const { data: instructorData } = await supabase
        .from('instructor')
        .select('id_instructor')
        .eq('usuario_id', userId)
        .maybeSingle()

      if (instructorData) {
        setUserRole('Instructor')
        return
      }

      setUserRole('Estudiante')
    }

    getUserData()
  }, [])

  // 🔥 LOGOUT REAL
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-16 bg-white border-b border-[#EAEAEA] fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
          <input
            type="text"
            placeholder="Buscar usuarios, cursos, instructores..."
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-lg text-sm focus:ring-2 focus:ring-[#FF2D55]"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#F5F5F5] rounded-lg">
          <Bell className="w-5 h-5 text-[#4A4A4A]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF2D55] text-white text-[10px] rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-[#EAEAEA]">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF2D55] to-[#FF6B8A] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{initials}</span>
          </div>

          {/* Info */}
          <div className="hidden md:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-[#8A8A8A]">{userRole}</p>
          </div>

          {/* Toggle */}
          <button onClick={() => setOpenMenu(!openMenu)}>
            <ChevronDown className="w-4 h-4 text-[#8A8A8A]" />
          </button>

          {/* 🔥 DROPDOWN */}
          {openMenu && (
            <div className="absolute right-0 top-12 w-40 bg-white border border-[#EAEAEA] rounded-lg shadow-lg p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F5F5F5] rounded"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
