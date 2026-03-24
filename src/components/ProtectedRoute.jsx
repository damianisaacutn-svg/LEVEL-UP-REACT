import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  // ⏳ Mientras valida sesión
  if (loading) {
    return <p>Cargando sesión...</p>
  }

  // 🔐 NO autenticado → mandar a login y guardar ruta
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // 🔥 clave
      />
    )
  }

  // 🛡️ CONTROL POR ROL (opcional)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
