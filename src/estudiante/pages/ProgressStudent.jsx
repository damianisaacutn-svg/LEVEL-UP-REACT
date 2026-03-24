import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, CheckCircle, Clock } from 'lucide-react'
import { Sidebar } from '../components/SidebarStudent'
import { Header } from '../components/HeaderStudent'
import { supabase } from '../../lib/supabaseClient'

export default function Progress() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [activities, setActivities] = useState([])
  const [totalXp, setTotalXp] = useState(0)

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setLoading(true)
        setError('')

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!user) throw new Error('No hay un usuario autenticado.')

        const { data: profile, error: profileError } = await supabase
          .from('usuario')
          .select('id_usuario, nombre, email')
          .eq('id_usuario', user.id)
          .single()

        if (profileError) throw profileError

        setStudent(profile)

        const { data: enrollments, error: enrollmentsError } = await supabase
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
              duracion,
              instructor_id
            )
          `
          )
          .eq('usuario_id', user.id)
          .order('fecha_inscripcion', { ascending: false })

        if (enrollmentsError) throw enrollmentsError

        const courseIds = enrollments?.map(item => item.curso?.id_curso).filter(Boolean) || []

        let progressRows = []
        if (courseIds.length > 0) {
          const { data: progressData, error: progressError } = await supabase
            .from('progreso')
            .select('curso_id, porcentaje_completado')
            .eq('usuario_id', user.id)
            .in('curso_id', courseIds)

          if (progressError) throw progressError
          progressRows = progressData || []
        }

        const progressMap = new Map(
          progressRows.map(row => [row.curso_id, Number(row.porcentaje_completado || 0)])
        )

        const { data: modulesData, error: modulesError } = await supabase
          .from('modulo')
          .select('id_modulo, curso_id')

        if (modulesError) throw modulesError

        const moduleCountMap = new Map()
        for (const modulo of modulesData || []) {
          const current = moduleCountMap.get(modulo.curso_id) || 0
          moduleCountMap.set(modulo.curso_id, current + 1)
        }

        const mappedCourses = (enrollments || []).map(item => {
          const curso = item.curso
          const progress = progressMap.get(curso.id_curso) || 0
          const totalModules = moduleCountMap.get(curso.id_curso) || 0
          const completedModules =
            totalModules > 0 ? Math.round((progress / 100) * totalModules) : 0

          let status = 'not-started'
          if (item.estado === 'completada' || progress >= 100) {
            status = 'completed'
          } else if (progress > 0) {
            status = 'in-progress'
          }

          return {
            id: curso.id_curso,
            title: curso.titulo,
            description: curso.descripcion,
            image: 'https://placehold.co/200x200?text=Curso',
            duration: curso.duracion,
            progress,
            totalModules,
            completedModules,
            status,
          }
        })

        setCourses(mappedCourses)

        const { data: xpRows, error: xpError } = await supabase
          .from('xp')
          .select('id_xp, puntos, descripcion, fecha')
          .eq('usuario_id', user.id)
          .order('fecha', { ascending: false })
          .limit(8)

        if (xpError) throw xpError

        const totalXpValue = (xpRows || []).reduce((acc, row) => acc + Number(row.puntos || 0), 0)
        setTotalXp(totalXpValue)

        const { data: quizAttempts, error: attemptsError } = await supabase
          .from('intento_quiz')
          .select(
            `
            id_intento,
            puntaje,
            fecha_intento,
            quiz:quiz_id (
              id_quiz,
              titulo
            )
          `
          )
          .eq('usuario_id', user.id)
          .order('fecha_intento', { ascending: false })
          .limit(8)

        if (attemptsError) throw attemptsError

        const xpActivities = (xpRows || []).map(row => ({
          id: row.id_xp,
          type: 'achievement',
          title: 'XP ganada',
          description: row.descripcion || 'Has ganado puntos de experiencia.',
          timestamp: formatDate(row.fecha),
          xpEarned: row.puntos,
          rawDate: row.fecha,
        }))

        const quizActivities = (quizAttempts || []).map(row => ({
          id: row.id_intento,
          type: 'quiz',
          title: row.quiz?.titulo || 'Quiz completado',
          description: `Obtuviste ${row.puntaje} puntos en tu intento.`,
          timestamp: formatDate(row.fecha_intento),
          xpEarned: null,
          rawDate: row.fecha_intento,
        }))

        const mergedActivities = [...xpActivities, ...quizActivities]
          .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
          .slice(0, 8)

        setActivities(mergedActivities)
      } catch (err) {
        console.error(err)
        setError(err.message || 'No se pudo cargar el progreso.')
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [])

  const coursesInProgress = useMemo(
    () => courses.filter(c => c.status === 'in-progress'),
    [courses]
  )

  const coursesCompleted = useMemo(() => courses.filter(c => c.status === 'completed'), [courses])

  const coursesPending = useMemo(() => courses.filter(c => c.status === 'not-started'), [courses])

  const overallProgress = useMemo(() => {
    if (!courses.length) return 0
    return Math.round(
      courses.reduce((acc, course) => acc + Number(course.progress || 0), 0) / courses.length
    )
  }, [courses])

  const stats = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Progreso General',
      value: `${overallProgress}%`,
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: 'Cursos Completados',
      value: coursesCompleted.length,
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Cursos en Progreso',
      value: coursesInProgress.length,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Cursos Pendientes',
      value: coursesPending.length,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Sidebar />
        <Header />
        <div className="ml-80 pt-24">
          <main className="p-8">
            <p className="text-[#8A8A8A]">Cargando progreso...</p>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Sidebar />
        <Header />
        <div className="ml-80 pt-24">
          <main className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Sidebar />
      <Header />

      <div className="ml-60 pt-24">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Mi Progreso</h1>
            <p className="text-[#8A8A8A]">
              Revisa tu avance y rendimiento general{student?.nombre ? `, ${student.nombre}` : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[#FF2D55]">{stat.icon}</div>
                  <span className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</span>
                </div>
                <p className="text-sm text-[#8A8A8A]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#7B61FF] to-[#3A86FF] rounded-2xl p-8 text-white min-h-[220px]">
              <h2 className="text-2xl font-bold mb-4">Progreso General</h2>

              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium">Total de cursos inscritos</span>
                  <span className="text-2xl font-bold">{courses.length}</span>
                </div>

                <div className="w-full bg-white/30 rounded-full h-4 mb-2 overflow-hidden">
                  <div
                    className="bg-white rounded-full h-4 transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>

                <p className="text-white/90 text-sm">
                  {overallProgress}% completado de todos tus cursos
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 min-h-[220px]">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">XP acumulada</h2>
              <p className="text-5xl font-bold text-[#FF2D55] mb-2">{totalXp}</p>
              <p className="text-[#8A8A8A]">Puntos de experiencia obtenidos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
                Cursos en Progreso ({coursesInProgress.length})
              </h2>

              <div className="space-y-4">
                {coursesInProgress.map(course => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border border-[#EAEAEA] p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1A1A1A] mb-1 truncate">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[#8A8A8A]">
                          {course.completedModules} de {course.totalModules} módulos completados
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-[#EAEAEA] rounded-full h-3 mb-2 overflow-hidden">
                      <div
                        className="bg-[#FF2D55] rounded-full h-3 transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <p className="text-sm text-[#8A8A8A] mb-3">{course.progress}% completado</p>

                    <Link
                      to={`/courses/${course.id}`}
                      className="text-sm text-[#FF2D55] font-medium hover:underline"
                    >
                      Continuar curso →
                    </Link>
                  </div>
                ))}

                {coursesInProgress.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#EAEAEA]">
                    <BookOpen className="w-12 h-12 text-[#8A8A8A] mx-auto mb-3" />
                    <p className="text-[#8A8A8A]">No tienes cursos en progreso</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
                Cursos Completados ({coursesCompleted.length})
              </h2>

              <div className="space-y-4">
                {coursesCompleted.map(course => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border-2 border-[#2ECC71] p-5"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-5 h-5 text-[#2ECC71] shrink-0" />
                          <h3 className="font-semibold text-[#1A1A1A] truncate">{course.title}</h3>
                        </div>
                        <p className="text-xs text-[#8A8A8A]">
                          {course.totalModules} módulos completados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#2ECC71] font-medium">✓ Completado</span>
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-sm text-[#FF2D55] font-medium hover:underline"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                ))}

                {coursesCompleted.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#EAEAEA]">
                    <CheckCircle className="w-12 h-12 text-[#8A8A8A] mx-auto mb-3" />
                    <p className="text-[#8A8A8A]">Aún no has completado ningún curso</p>
                    <p className="text-xs text-[#8A8A8A] mt-2">
                      ¡Sigue aprendiendo para obtener tu primer certificado!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Actividad de Aprendizaje</h2>

            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 pb-4 ${
                      index !== activities.length - 1 ? 'border-b border-[#EAEAEA]' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2D55] to-[#FF6B8A] flex items-center justify-center text-white flex-shrink-0">
                      {activity.type === 'video' && <BookOpen className="w-5 h-5" />}
                      {activity.type === 'quiz' && <CheckCircle className="w-5 h-5" />}
                      {activity.type === 'achievement' && <TrendingUp className="w-5 h-5" />}
                      {activity.type === 'course-started' && <Clock className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#1A1A1A] mb-1">{activity.title}</h4>
                      <p className="text-sm text-[#8A8A8A] mb-1">{activity.description}</p>
                      <p className="text-xs text-[#8A8A8A]">{activity.timestamp}</p>
                    </div>

                    {activity.xpEarned && (
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-[#2ECC71]">
                          +{activity.xpEarned} XP
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {activities.length === 0 && (
                  <p className="text-[#8A8A8A]">Aún no hay actividad registrada.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}
