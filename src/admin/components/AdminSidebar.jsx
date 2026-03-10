import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardCheck, ShieldCheck, Tag, BarChart3 } from 'lucide-react'

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition
    ${isActive ? 'bg-[#f06292] text-white' : 'text-gray-600 hover:bg-gray-100'}`

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-[#f06292]">LEVEL UP</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
        {/* IMPORTANTE: end */}
        <NavLink to="/admin" end className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} />
          Usuarios
        </NavLink>

        <NavLink to="/admin/instructor-requests" className={linkClass}>
          <ClipboardCheck size={18} />
          Solicitudes Instructor
        </NavLink>

        <NavLink to="/admin/moderation" className={linkClass}>
          <ShieldCheck size={18} />
          Moderación
        </NavLink>

        <NavLink to="/admin/categories" className={linkClass}>
          <Tag size={18} />
          Categorías
        </NavLink>

        <NavLink to="/admin/stats" className={linkClass}>
          <BarChart3 size={18} />
          Estadísticas
        </NavLink>
      </nav>
    </aside>
  )
}
