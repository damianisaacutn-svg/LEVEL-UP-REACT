import { useDashboardData } from '../hooks/useDashboardData'
import { Users, GraduationCap, BookOpen, Brain, Video, UserCheck, Trophy } from 'lucide-react'
import { StatCard } from '../components/StatCard'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'

// ==========================
// 🎨 COLORS
// ==========================
const COLORS = ['#FF2D55', '#7B61FF', '#3A86FF', '#FF6B8A']

export default function Dashboard() {
  const { stats, growth, charts, summary, loading } = useDashboardData()

  if (loading) {
    return <p className="text-center mt-10">Cargando dashboard...</p>
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-[32px] font-bold text-[#1A1A1A]">Panel de Administración</h1>
        <p className="text-[#8A8A8A]">Resumen general del sistema Level Up</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuarios"
          value={stats.totalUsers}
          growth={growth.users}
          icon={Users}
          iconColor="#FF2D55"
          iconBgColor="#FFF5F7"
        />
        <StatCard
          title="Instructores"
          value={stats.totalInstructors}
          icon={GraduationCap}
          iconColor="#7B61FF"
          iconBgColor="#F5F3FF"
        />
        <StatCard
          title="Cursos"
          value={stats.publishedCourses}
          growth={growth.courses}
          icon={BookOpen}
          iconColor="#3A86FF"
          iconBgColor="#EFF6FF"
        />
        <StatCard
          title="Quizzes"
          value={stats.totalQuizzes}
          growth={growth.quizzes}
          icon={Brain}
          iconColor="#FF6B8A"
          iconBgColor="#FFF5F8"
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Videos"
          value={stats.totalVideos}
          icon={Video}
          iconColor="#2ECC71"
          iconBgColor="#F0FFF4"
        />
        <StatCard
          title="Inscripciones"
          value={stats.activeEnrollments}
          icon={UserCheck}
          iconColor="#F39C12"
          iconBgColor="#FFF9E6"
        />
        <StatCard
          title="XP"
          value={stats.totalXP?.toLocaleString()}
          icon={Trophy}
          iconColor="#FF2D55"
          iconBgColor="#FFF5F7"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* USERS GROWTH */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Crecimiento de Usuarios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.usersGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="users" stroke="#FF2D55" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ENROLLMENTS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Inscripciones por Curso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.enrollments}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF2D55" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROLES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Distribución de Roles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.roles}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {charts.roles?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Actividad (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.activity}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line dataKey="activity" stroke="#7B61FF" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* QUICK SUMMARY */}
      <div className="bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A] p-8 rounded-2xl text-white">
        <h3 className="text-xl font-semibold mb-6">Resumen Rápido</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm opacity-80">Promedio de finalización</p>
            <h2 className="text-3xl font-bold">{summary.avgCompletion || 0}%</h2>
          </div>

          <div>
            <p className="text-sm opacity-80">Tiempo promedio de curso</p>
            <h2 className="text-3xl font-bold">{summary.avgDuration || 0}h</h2>
          </div>

          <div>
            <p className="text-sm opacity-80">Rating promedio</p>
            <h2 className="text-3xl font-bold">{summary.avgRating || 0}⭐</h2>
          </div>

          <div>
            <p className="text-sm opacity-80">Nuevos esta semana</p>
            <h2 className="text-3xl font-bold">{summary.newUsers || 0}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
