import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/home.css'
import logo from '../../assets/logo.png'

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Level Up Logo" />
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
            <Link to="/login" className="btn-main">
              Iniciar Sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
