import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Video,
  FileQuestion,
  BarChart3,
  MessageSquare,
  BadgeCheck,
  User,
  Cat,
} from 'lucide-react'

const navItems = [
  { path: '/instructor', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/instructor/courses', icon: BookOpen, label: 'Mis Cursos' },
  { path: '/instructor/create-course', icon: Plus, label: 'Crear Curso' },
  { path: '/instructor/videos', icon: Video, label: 'Videos' },
  { path: '/instructor/quizzes', icon: FileQuestion, label: 'Cuestionarios' },
  { path: '/instructor/analytics', icon: BarChart3, label: 'Analíticas' },
  { path: '/instructor/comments', icon: MessageSquare, label: 'Comentarios' },
  { path: '/instructor/verification', icon: BadgeCheck, label: 'Verificación' },
  { path: '/instructor/profile', icon: User, label: 'Perfil' },
]

export function Sidebar() {
  const location = useLocation()

  const isActiveRoute = path => {
    if (path === '/instructor') {
      return location.pathname === '/instructor'
    }

    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-white border-r border-[#EAEAEA] h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#EAEAEA]">
        <Link to="/instructor" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF2D55] rounded-xl flex items-center justify-center">
            <Cat className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A]">Level Up</h1>
            <p className="text-sm text-[#8A8A8A]">Instructor Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map(item => {
            const isActive = isActiveRoute(item.path)
            const Icon = item.icon

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#FFF5F7] text-[#FF2D55] border-l-4 border-[#FF2D55] pl-3 font-semibold'
                        : 'text-[#4A4A4A] hover:bg-[#F5F5F5]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF2D55]' : 'text-[#8A8A8A]'}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#EAEAEA]">
        <p className="text-xs text-[#8A8A8A] text-center">Level Up Platform v1.0</p>
      </div>
    </aside>
  )
}
