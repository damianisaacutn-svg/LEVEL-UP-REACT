import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 1. Obtener sesión inicial correctamente
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error obteniendo sesión:', error.message)
      }

      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 🔥 2. Escuchar cambios de sesión (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔥 3. Logout robusto
  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error al cerrar sesión:', error.message)
    }

    // Limpieza manual (extra seguridad)
    setSession(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAuthenticated: !!session,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
