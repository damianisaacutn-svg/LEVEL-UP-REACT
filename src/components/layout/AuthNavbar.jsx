import { Link } from 'react-router-dom'

export default function AuthNavbar() {
  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Level Up Logo" />
          <span>Level Up</span>
        </Link>
      </nav>
    </header>
  )
}
