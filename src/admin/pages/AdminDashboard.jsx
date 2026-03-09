import AdminSidebar from '../components/AdminSidebar'
import NavbarAdmin from '../components/NavbarAdmin'
import StatCard from '../../components/ui/StatCard'
import useAdminStats from '../hooks/useAdminStats'

export default function AdminDashboard() {
  const { stats, loading } = useAdminStats()

  return (
    <div className="flex bg-[#F7F7F7] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <NavbarAdmin />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="text-gray-500">Estadísticas generales de la plataforma</p>
          </div>

          {loading ? (
            <p>Cargando estadísticas...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard title="Usuarios" value={stats.users} />

              <StatCard title="Instructores" value={stats.instructors} />

              <StatCard title="Cursos" value={stats.courses} />

              <StatCard title="Videos" value={stats.videos} />

              <StatCard title="Quizzes" value={stats.quizzes} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
