import { Search, Bell, ChevronDown, LogOut, User, PlusCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const [notificationCount] = useState(3)
  const [userName, setUserName] = useState('...')
  const [userRole, setUserRole] = useState('Instructor')
  const [initials, setInitials] = useState('I')
  const [openMenu, setOpenMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error obteniendo usuario autenticado:', userError)
          setLoading(false)
          return
        }

        if (!user) {
          setLoading(false)
          return
        }

        const userId = user.id

        const { data: profile, error: profileError } = await supabase
          .from('usuario')
          .select('nombre, email')
          .eq('id_usuario', userId)
          .maybeSingle()

        if (profileError) {
          console.error('Error obteniendo perfil:', profileError)
        }

        const name =
          profile?.nombre?.trim() || user.user_metadata?.nombre || user.email || 'Instructor'

        setUserName(name)

        const generatedInitials = name
          .split(' ')
          .filter(Boolean)
          .map(word => word[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()

        setInitials(generatedInitials || 'I')

        const { data: instructorData, error: instructorError } = await supabase
          .from('instructor')
          .select('id_instructor')
          .eq('usuario_id', userId)
          .maybeSingle()

        if (instructorError && instructorError.code !== 'PGRST116') {
          console.error('Error obteniendo rol instructor:', instructorError)
        }

        if (instructorData) {
          setUserRole('Instructor')
        } else {
          setUserRole('Usuario')
        }
      } catch (error) {
        console.error('Error general en HeaderInstructor:', error)
      } finally {
        setLoading(false)
      }
    }

    getUserData()
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Error cerrando sesión:', error)
        return
      }

      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  const handleGoProfile = () => {
    setOpenMenu(false)
    navigate('/instructor/profile')
  }

  const handleCreateCourse = () => {
    navigate('/instructor/courses/create')
  }

  const handleSearch = e => {
    setSearch(e.target.value)
  }

  return (
    <header className="h-16 bg-white border-b border-[#EAEAEA] fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1 max-w-3xl">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Buscar cursos, módulos o cuestionarios..."
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-lg text-sm text-[#1A1A1A] outline-none border border-transparent focus:ring-2 focus:ring-[#FF2D55] focus:border-[#FF2D55] transition"
            />
          </div>
        </div>

        <button
          onClick={handleCreateCourse}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#FF2D55] hover:bg-[#e6264d] text-white text-sm font-medium rounded-lg transition shadow-sm"
        >
          <PlusCircle size={18} />
          Crear curso
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 hover:bg-[#F5F5F5] rounded-lg transition"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5 text-[#4A4A4A]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#FF2D55] text-white text-[10px] rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div
          ref={menuRef}
          className="relative flex items-center gap-3 pl-4 border-l border-[#EAEAEA]"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF2D55] to-[#FF6B8A] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-semibold">{loading ? '...' : initials}</span>
          </div>

          <div className="hidden md:block leading-tight">
            <p className="text-sm font-medium text-[#1A1A1A]">
              {loading ? 'Cargando...' : userName}
            </p>
            <p className="text-xs text-[#8A8A8A]">{loading ? '...' : userRole}</p>
          </div>

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-1 rounded-md hover:bg-[#F5F5F5] transition"
            aria-label="Abrir menú de usuario"
          >
            <ChevronDown
              className={`w-4 h-4 text-[#8A8A8A] transition-transform ${
                openMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-[#EAEAEA] rounded-xl shadow-lg p-2">
              <div className="px-3 py-2 border-b border-[#F1F1F1]">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                  {loading ? 'Cargando...' : userName}
                </p>
                <p className="text-xs text-[#8A8A8A]">{loading ? '...' : userRole}</p>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  onClick={handleGoProfile}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition"
                >
                  <User size={16} />
                  Mi perfil
                </button>

                <button
                  onClick={handleCreateCourse}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition"
                >
                  <PlusCircle size={16} />
                  Crear curso
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
