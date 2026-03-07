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
            <a href="#">Cursos</a>
          </li>
          <li>
            <a href="#">Expertos</a>
          </li>
          <li>
            <a href="#">Comunidad</a>
          </li>
          <li>
            <a className="btn-main">Iniciar Sesión</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
