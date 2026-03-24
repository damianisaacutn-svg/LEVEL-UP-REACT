import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

/* 🔐 AUTH */
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

/* ================= PUBLIC ================= */
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

/* ================= ADMIN ================= */
import { Layout as AdminLayout } from './admin/components/Layout'
import Dashboard from './admin/pages/Dashboard'
import Users from './admin/pages/Users'
import Courses from './admin/pages/Courses'
import Activity from './admin/pages/Activity'
import Quizzes from './admin/pages/Quizzes'
import Progress from './admin/pages/Progress'
import Instructors from './admin/pages/Instructors'
import Settings from './admin/pages/Settings'
import Gamification from './admin/pages/Gamification'

/* ================= STUDENT ================= */
import { StudentDashboard } from './estudiante/pages/StudentDashboard'
import { StudentCourses } from './estudiante/pages/CoursesStudent'
import StudentProgress from './estudiante/pages/ProgressStudent'

/* ================= INSTRUCTOR ================= */
import InstructorDashboard from './instructor/pages/InstructorDashboard'
import { MyCourses } from './instructor/pages/MyCourses'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= REDIRECTS (UX PRO) ================= */}
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/courses" element={<Navigate to="/admin/courses" replace />} />
          <Route path="/activity" element={<Navigate to="/admin/activity" replace />} />

          {/* ================= ADMIN (PROTEGIDO) ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="courses" element={<Courses />} />
            <Route path="activity" element={<Activity />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="progress" element={<Progress />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="settings" element={<Settings />} />
            <Route path="gamification" element={<Gamification />} />
          </Route>

          {/* ================= STUDENT (PROTEGIDO) ================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/courses"
            element={
              <ProtectedRoute>
                <StudentCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/progress"
            element={
              <ProtectedRoute>
                <StudentProgress />
              </ProtectedRoute>
            }
          />

          {/* ================= INSTRUCTOR (PROTEGIDO) ================= */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/create-course"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/videos"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/quizzes"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/analytics"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/comments"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/verification"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/profile"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
