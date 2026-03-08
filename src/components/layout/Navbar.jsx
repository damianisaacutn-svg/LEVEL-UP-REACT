import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Level Up Logo" />
          <span>Level Up</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/cursos">Cursos</Link>
          </li>

          <li>
            <Link to="/expertos">Expertos</Link>
          </li>

          <li>
            <Link to="/comunidad">Comunidad</Link>
          </li>

          <li>
            <Link to="/login" className="btn-main">
              Iniciar Sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
