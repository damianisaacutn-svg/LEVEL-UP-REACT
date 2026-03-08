import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NavbarEstudiante() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Level Up Logo" />
          <span>Level Up</span>
        </div>

        <div className="nav-links">
          <Link to="/dashboard-estudiante">Dashboard</Link>

          <Link to="/cursos">Cursos</Link>

          <Link to="/mi-progreso">Mi Progreso</Link>

          <Link to="/perfil">Perfil</Link>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>
    </header>
  )
}
