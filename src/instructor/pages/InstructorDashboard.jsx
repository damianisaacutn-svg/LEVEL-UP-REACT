import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Video, FileQuestion, MessageSquare, Star } from 'lucide-react'
import { Sidebar } from '../components/SidebarInstructor'
import { Header } from '../components/HeaderInstructor'
import { supabase } from '../../lib/supabaseClient'

const quickActions = [
  {
    label: 'Crear Nuevo Curso',
    icon: Plus,
    href: '/instructor/create-course',
    color: 'bg-[#FF2D55]',
  },
  {
    label: 'Subir Video',
    icon: Video,
    href: '/instructor/videos',
    color: 'bg-[#7B61FF]',
  },
  {
    label: 'Crear Cuestionario',
    icon: FileQuestion,
    href: '/instructor/quizzes',
    color: 'bg-[#3A86FF]',
  },
  {
    label: 'Revisar Comentarios',
    icon: MessageSquare,
    href: '/instructor/comments',
    color: 'bg-[#FF6B8A]',
  },
]

const DashboardInstructor = () => {
  const [recentCourses, setRecentCourses] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // 1. Obtener usuario autenticado
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!user) throw new Error('No hay usuario autenticado')

        // 2. Buscar el instructor vinculado a ese usuario
        const { data: instructorData, error: instructorError } = await supabase
          .from('instructor')
          .select('id_instructor, verificado')
          .eq('usuario_id', user.id)
          .single()

        if (instructorError) throw instructorError

        // 3. Obtener cursos del instructor
        const { data: coursesData, error: coursesError } = await supabase
          .from('curso')
          .select(
            `
            id_curso,
            titulo,
            descripcion,
            created_at,
            updated_at
          `
          )
          .eq('instructor_id', instructorData.id_instructor)
          .order('updated_at', { ascending: false })

        if (coursesError) throw coursesError

        // 4. Obtener módulos por curso
        const courseIds = coursesData?.map(course => course.id_curso) || []

        let modulesData = []
        if (courseIds.length > 0) {
          const { data, error } = await supabase
            .from('modulo')
            .select('id_modulo, curso_id')
            .in('curso_id', courseIds)

          if (error) throw error
          modulesData = data || []
        }

        // 5. Obtener inscripciones por curso
        let enrollmentsData = []
        if (courseIds.length > 0) {
          const { data, error } = await supabase
            .from('inscripcion')
            .select('curso_id')
            .in('curso_id', courseIds)

          if (error) throw error
          enrollmentsData = data || []
        }

        // 6. Formatear cursos recientes
        const formattedCourses = (coursesData || []).map(course => {
          const totalModules = modulesData.filter(
            module => module.curso_id === course.id_curso
          ).length

          const totalStudents = enrollmentsData.filter(
            enrollment => enrollment.curso_id === course.id_curso
          ).length

          return {
            id: course.id_curso,
            title: course.titulo,
            status: 'Publicado',
            students: totalStudents,
            modules: totalModules,
            rating: '★ Nuevo',
            lastUpdate: new Date(course.updated_at).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          }
        })

        setRecentCourses(formattedCourses)

        // 7. Actividad reciente simple desde cursos
        const activity = (coursesData || []).slice(0, 5).map(course => ({
          text: `Actualizaste el curso "${course.titulo}"`,
          time: new Date(course.updated_at).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }))

        setRecentActivity(activity)

        // 8. Alertas del dashboard
        const dashboardAlerts = []

        if (!instructorData.verificado) {
          dashboardAlerts.push({
            type: 'warning',
            message: 'Tu cuenta de instructor aún no está verificada.',
            action: 'Completar verificación',
          })
        }

        if ((coursesData || []).length === 0) {
          dashboardAlerts.push({
            type: 'info',
            message: 'Aún no has creado ningún curso.',
            action: 'Crear curso',
          })
        }

        setAlerts(dashboardAlerts)
      } catch (error) {
        console.error('Error al cargar dashboard del instructor:', error)

        setAlerts([
          {
            type: 'warning',
            message: 'No se pudo cargar la información del dashboard.',
            action: 'Reintentar',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#1A1A1A' }}
            >
              Panel del Instructor
            </h1>
            <p className="text-[#8A8A8A]">
              Gestiona tus cursos, contenido y actividad desde un solo lugar.
            </p>
          </div>

          {alerts.length > 0 && (
            <div className="mb-8 space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`rounded-xl border-l-4 p-4 flex items-center justify-between shadow-sm border border-[#EAEAEA] ${
                    alert.type === 'warning'
                      ? 'border-l-[#F39C12] bg-[#FFF9F0]'
                      : 'border-l-[#3498DB] bg-[#F0F8FF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#1A1A1A]">{alert.message}</span>
                  </div>
                  <button className="text-sm font-medium text-[#FF2D55] hover:opacity-80 transition">
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#1A1A1A' }}
            >
              Acciones Rápidas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(action => {
                const Icon = action.icon

                return (
                  <Link key={action.label} to={action.href}>
                    <div className="bg-white border border-[#EAEAEA] rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                      <div className="p-6 text-center">
                        <div
                          className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <p className="font-medium text-[#1A1A1A]">{action.label}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
                <div className="flex flex-row items-center justify-between p-6 border-b border-[#EAEAEA]">
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Cursos Recientes</h2>

                  <Link to="/instructor/courses">
                    <button className="text-sm font-medium text-[#FF2D55] hover:opacity-80 transition">
                      Ver todos
                    </button>
                  </Link>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="p-6 text-center text-[#8A8A8A]">Cargando cursos...</div>
                  ) : recentCourses.length > 0 ? (
                    <div className="space-y-4">
                      {recentCourses.map(course => (
                        <Link key={course.id} to={`/instructor/courses/${course.id}`}>
                          <div className="p-4 rounded-xl border border-gray-200 hover:border-[#FF2D55] hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-[#1A1A1A] flex-1">
                                {course.title}
                              </h3>

                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                                  course.status === 'Publicado' ? 'bg-[#2ECC71]' : 'bg-[#F39C12]'
                                }`}
                              >
                                {course.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-[#8A8A8A] flex-wrap">
                              <span>{course.students} estudiantes</span>
                              <span>{course.modules} módulos</span>
                              <span className="flex items-center gap-1">
                                <Star size={14} />
                                {course.rating}
                              </span>
                            </div>

                            <div className="mt-3 text-xs text-[#8A8A8A]">
                              Actualizado {course.lastUpdate}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-[#8A8A8A]">
                      Aún no hay cursos para mostrar.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
                <div className="p-6 border-b border-[#EAEAEA]">
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Actividad Reciente</h2>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="text-sm text-[#8A8A8A]">Cargando actividad...</div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#FF2D55] mt-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#1A1A1A]">{activity.text}</p>
                            <p className="text-xs text-[#8A8A8A] mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-[#8A8A8A]">
                      No hay actividad reciente por mostrar.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardInstructor
