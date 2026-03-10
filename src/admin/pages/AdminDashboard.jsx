import AdminSidebar from '../components/AdminSidebar'
import NavbarAdmin from '../components/NavbarAdmin'
import StatCard from '../../components/ui/StatCard'

import PendingContentTable from '../components/PendingContentTable'
import RecentActivity from '../components/RecentActivity'

import useAdminDashboard from '../hooks/useAdminDashboard'

export default function AdminDashboard() {
  const { metrics, pending, activity, loading } = useAdminDashboard()

  return (
    <div className="flex bg-[#F7F7F7] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <NavbarAdmin />

        <main className="p-8">
          {/* HEADER */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="text-gray-500">Estadísticas generales de la plataforma</p>
          </div>

          {/* MÉTRICAS */}

          {loading ? (
            <p>Cargando estadísticas...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
              <StatCard title="Usuarios" value={metrics.users} />

              <StatCard title="Instructores" value={metrics.instructors} />

              <StatCard title="Cursos" value={metrics.courses} />

              <StatCard title="Videos" value={metrics.videos} />

              <StatCard title="Quizzes" value={metrics.quizzes} />
            </div>
          )}

          {/* CONTENIDO + ACTIVIDAD */}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CONTENIDO PENDIENTE */}

            <div className="lg:col-span-2">
              <PendingContentTable data={pending} />
            </div>

            {/* ACTIVIDAD RECIENTE */}

            <RecentActivity data={activity} />
          </section>
        </main>
      </div>
    </div>
  )
}
