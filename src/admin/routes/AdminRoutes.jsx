import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import AdminUsuarios from '../pages/AdminUsuarios'
import AdminCategorias from '../pages/AdminCategorias'
import AdminEstadisticas from '../pages/AdminEstadisticas'
import AdminSolicitudesInstructor from '../pages/AdminSolicitudesInstructor'
import AdminModeracionContenido from '../pages/AdminModeracionContenido'

import ProtectedRoute from '../../components/ui/ProtectedRoute'
import RoleGuard from '../../components/ui/RoleGuard'

export default function AdminRoutes() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin']}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsuarios />} />
          <Route path="/categories" element={<AdminCategorias />} />
          <Route path="/stats" element={<AdminEstadisticas />} />
          <Route path="/instructor-requests" element={<AdminSolicitudesInstructor />} />
          <Route path="/moderation" element={<AdminModeracionContenido />} />
        </Routes>
      </RoleGuard>
    </ProtectedRoute>
  )
}
