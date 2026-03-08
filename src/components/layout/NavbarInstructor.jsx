import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NavbarInstructor() {
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
          <Link to="/dashboard-instructor">Dashboard</Link>

          <Link to="/mis-cursos">Mis Cursos</Link>

          <Link to="/crear-curso">Crear Curso</Link>

          <Link to="/estudiantes">Estudiantes</Link>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>
    </header>
  )
}
