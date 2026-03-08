import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import DashboardEstudiante from './estudiante/pages/DashboardEstudiante'
import DashboardInstructor from './instructor/pages/DashboardInstructor'

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

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
