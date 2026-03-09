import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import DashboardEstudiante from './estudiante/pages/DashboardEstudiante'
import DashboardInstructor from './instructor/pages/DashboardInstructor'

/* ADMIN */
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminUsuarios from './admin/pages/AdminUsuarios'
import AdminCategorias from './admin/pages/AdminCategorias'
import AdminSolicitudesInstructor from './admin/pages/AdminSolicitudesInstructor'
import AdminModeracionContenido from './admin/pages/AdminModeracionContenido'
import AdminEstadisticas from './admin/pages/AdminEstadisticas'

import ProtectedRoute from './components/ProtectedRoute'
import RoleGuard from './components/RoleGuard'

import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ESTUDIANTE */}
        <Route
          path="/estudiante/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={3}>
                <DashboardEstudiante />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* INSTRUCTOR */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={2}>
                <DashboardInstructor />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================== */}

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={1}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={1}>
                <AdminUsuarios />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN CATEGORIES */}
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={1}>
                <AdminCategorias />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN INSTRUCTOR REQUESTS */}
        <Route
          path="/admin/instructor-requests"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={1}>
                <AdminSolicitudesInstructor />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN CONTENT MODERATION */}
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={1}>
                <AdminModeracionContenido />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN STATS */}
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole={1}>
                <AdminEstadisticas />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
