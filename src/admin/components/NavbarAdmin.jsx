import { useEffect, useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function NavbarAdmin() {
  const [admin, setAdmin] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAdmin()
  }, [])

  const fetchAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('usuarios')
      .select('nombre, rol_id')
      .eq('auth_user_id', user.id)
      .single()

    setAdmin(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()

    navigate('/login')
  }

  return (
    <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Panel Administrador</h2>

      <div className="flex items-center gap-4">
        {admin && (
          <div className="text-right">
            <p className="font-medium">{admin.nombre}</p>
            <span className="text-sm text-gray-500">Admin</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#f06292] text-white rounded-lg hover:opacity-90"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
