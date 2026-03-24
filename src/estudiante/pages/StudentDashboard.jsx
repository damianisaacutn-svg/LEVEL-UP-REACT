import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Play } from 'lucide-react'

import { supabase } from '../../lib/supabaseClient'
import { Sidebar } from '../components/SidebarStudent'
import { Header } from '../components/HeaderStudent'

export function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [coursesInProgress, setCoursesInProgress] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [totalXP, setTotalXP] = useState(0)
  const [completedCourses, setCompletedCourses] = useState(0)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) throw new Error('No hay usuario autenticado')

      const { data: profile, error: profileError } = await supabase
        .from('usuario')
        .select('id_usuario, nombre, email')
        .eq('id_usuario', user.id)
        .single()

      if (profileError) throw profileError

      const { data: xpRows, error: xpError } = await supabase
        .from('xp')
        .select('puntos')
        .eq('usuario_id', user.id)

      if (xpError) throw xpError

      const xpTotal = (xpRows || []).reduce((acc, row) => acc + (row.puntos || 0), 0)

      const { data: enrolledCourses, error: enrolledError } = await supabase
        .from('inscripcion')
        .select(
          `
          id_inscripcion,
          estado,
          fecha_inscripcion,
          curso:curso_id (
            id_curso,
            titulo,
            descripcion,
            duracion
          )
        `
        )
        .eq('usuario_id', user.id)

      if (enrolledError) throw enrolledError

      const { data: progressRows, error: progressError } = await supabase
        .from('progreso')
        .select('curso_id, porcentaje_completado')
        .eq('usuario_id', user.id)

      if (progressError) throw progressError

      const progressMap = new Map(
        (progressRows || []).map(item => [item.curso_id, Number(item.porcentaje_completado || 0)])
      )

      const activeCourses = (enrolledCourses || [])
        .map(item => {
          const course = item.curso
          const progress = progressMap.get(course?.id_curso) || 0

          return {
            id: course?.id_curso,
            title: course?.titulo || 'Curso sin título',
            description: course?.descripcion || 'Sin descripción',
            duration: course?.duracion || 0,
            status:
              progress > 0 && progress < 100
                ? 'in-progress'
                : progress >= 100
                  ? 'completed'
                  : 'not-started',
            progress,
          }
        })
        .filter(course => course.id)

      const inProgress = activeCourses.filter(course => course.status === 'in-progress')
      const doneCourses = activeCourses.filter(course => course.status === 'completed')

      const enrolledIds = activeCourses.map(course => course.id)

      let coursesQuery = supabase
        .from('curso')
        .select('id_curso, titulo, descripcion, duracion')
        .limit(3)

      if (enrolledIds.length > 0) {
        coursesQuery = coursesQuery.not('id_curso', 'in', `(${enrolledIds.join(',')})`)
      }

      const { data: recommended, error: recommendedError } = await coursesQuery

      if (recommendedError) throw recommendedError

      const { data: activityRows, error: activityError } = await supabase
        .from('activity_log')
        .select('id_log, accion, descripcion, fecha')
        .eq('usuario_id', user.id)
        .order('fecha', { ascending: false })
        .limit(5)

      if (activityError) throw activityError

      setStudent({
        id: profile.id_usuario,
        name: profile.nombre || 'Estudiante',
        email: profile.email || '',
      })

      setTotalXP(xpTotal)
      setCoursesInProgress(inProgress)
      setCompletedCourses(doneCourses.length)
      setRecommendedCourses(
        (recommended || []).map(course => ({
          id: course.id_curso,
          title: course.titulo || 'Curso sin título',
          description: course.descripcion || 'Sin descripción',
          duration: course.duracion || 0,
        }))
      )
      setRecentActivities(activityRows || [])
    } catch (error) {
      console.error('Error al cargar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const level = useMemo(() => Math.floor(totalXP / 100) + 1, [totalXP])
  const xpToNextLevel = useMemo(() => level * 100, [level])
  const currentLevelBase = useMemo(() => (level - 1) * 100, [level])

  const xpProgress = useMemo(() => {
    const currentLevelXP = totalXP - currentLevelBase
    return Math.min((currentLevelXP / 100) * 100, 100)
  }, [totalXP, currentLevelBase])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Sidebar />
        <Header />
        <main className="ml-64 pt-24 p-8">
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <p className="text-[#4A4A4A]">Cargando dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-family-secondary)' }}
          >
            ¡Hola, {student?.name?.split(' ')[0] || 'Estudiante'}! 👋
          </h1>
          <p className="text-[#8A8A8A]">Continúa donde te quedaste y sigue avanzando.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5">
            <p className="text-sm text-[#8A8A8A]">XP Total</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mt-2">{totalXP}</h3>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5">
            <p className="text-sm text-[#8A8A8A]">Cursos Activos</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mt-2">{coursesInProgress.length}</h3>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5">
            <p className="text-sm text-[#8A8A8A]">Cursos Completados</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mt-2">{completedCourses}</h3>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-5">
            <p className="text-sm text-[#8A8A8A]">Nivel</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mt-2">{level}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#7B61FF] to-[#3A86FF] rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-family-secondary)' }}
              >
                Nivel {level}
              </h3>
              <p className="text-white/80 text-sm">
                {totalXP} / {xpToNextLevel} XP
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-2 bg-white/20 rounded-lg text-sm font-medium">
                XP: {totalXP}
              </span>
              <span className="px-3 py-2 bg-white/20 rounded-lg text-sm font-medium">
                Progreso: {Math.round(xpProgress)}%
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>

          <p className="text-white/90 text-sm mt-3">
            Estás a un paso de subir de nivel. ¡Sigue así!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold text-[#1A1A1A]"
                style={{ fontFamily: 'var(--font-family-secondary)' }}
              >
                Cursos en Progreso
              </h2>
              <Link
                to="/student/courses"
                className="text-[#FF2D55] text-sm font-medium hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="space-y-4 mb-8">
              {coursesInProgress.length > 0 ? (
                coursesInProgress.map(course => (
                  <Link
                    key={course.id}
                    to={`/student/courses/${course.id}`}
                    className="block bg-white rounded-xl border border-[#EAEAEA] p-5 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3
                          className="text-lg font-semibold text-[#1A1A1A] mb-2"
                          style={{ fontFamily: 'var(--font-family-secondary)' }}
                        >
                          {course.title}
                        </h3>

                        <div className="mb-2">
                          <div className="w-full h-2 bg-[#EAEAEA] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FF2D55] rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
                          <span>Progreso: {Math.round(course.progress)}%</span>
                          <span>Duración: {course.duration} min</span>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#FF2D55] text-white rounded-lg">
                        <Play className="w-4 h-4" />
                        <span className="text-sm font-medium">Continuar</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-[#EAEAEA] p-6">
                  <p className="text-[#8A8A8A]">Aún no tienes cursos en progreso.</p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2
                className="text-xl font-bold text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'var(--font-family-secondary)' }}
              >
                Cursos Recomendados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map(course => (
                    <Link
                      key={course.id}
                      to={`/student/courses/${course.id}`}
                      className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-md transition-all duration-300 p-4"
                    >
                      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">{course.title}</h3>
                      <p className="text-xs text-[#8A8A8A] line-clamp-3 mb-3">
                        {course.description}
                      </p>
                      <span className="text-xs text-[#4A4A4A]">
                        Duración: {course.duration} min
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="md:col-span-3 bg-white rounded-xl border border-[#EAEAEA] p-6">
                    <p className="text-[#8A8A8A]">No hay cursos recomendados por el momento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-bold text-[#1A1A1A]"
                  style={{ fontFamily: 'var(--font-family-secondary)' }}
                >
                  Actividad Reciente
                </h2>
              </div>

              <div className="space-y-2">
                {recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <div
                      key={activity.id_log}
                      className="bg-white rounded-lg border border-[#EAEAEA] p-3"
                    >
                      <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#FF2D55] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#1A1A1A] truncate">
                            {activity.accion}
                          </p>
                          <p className="text-xs text-[#8A8A8A] truncate">
                            {activity.descripcion || 'Sin descripción'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg border border-[#EAEAEA] p-4">
                    <p className="text-sm text-[#8A8A8A]">No hay actividad reciente.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF6B8A] to-[#FF2D55] rounded-xl p-6 text-white">
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: 'var(--font-family-secondary)' }}
              >
                ¡Tu progreso va excelente! 🎯
              </h3>
              <p className="text-white/90 text-sm">
                Sigue así, cada módulo te acerca más a tu meta.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
