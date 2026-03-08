import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabaseClient'
import { Navigate } from 'react-router-dom'

export default function RoleGuard({ children, allowedRole }) {
  const { user } = useAuth()
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRole = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('rol_id')
        .eq('auth_user_id', user.id)
        .single()

      if (data) {
        setRole(data.rol_id)
      }

      setLoading(false)
    }

    if (user) {
      getRole()
    }
  }, [user])

  if (loading) return <div>Cargando...</div>

  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}
