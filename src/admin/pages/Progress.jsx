import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import ProgressStats from '../components/progress/ProgressStats'
import StudentProgressCard from '../components/progress/StudentProgressCard'
import ProgressInsights from '../components/progress/ProgressInsights'
import UserProgressModal from '../components/progress/UserProgressModal'

export default function ProgressPage() {
  const [usersSummary, setUsersSummary] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const { data: progressRows, error: progressError } = await supabase.from('progreso').select(`
          usuario_id,
          curso_id,
          porcentaje_completado,
          updated_at,
          usuario:usuario_id (
            id_usuario,
            nombre,
            email
          ),
          curso:curso_id (
            id_curso,
            titulo
          )
        `)

      if (progressError) throw progressError

      const { data: xpRows, error: xpError } = await supabase.from('xp').select(`
          usuario_id,
          puntos,
          fecha,
          descripcion
        `)

      if (xpError) throw xpError

      const { data: attemptsRows, error: attemptsError } = await supabase.from('intento_quiz')
        .select(`
          usuario_id,
          puntaje,
          fecha_intento,
          quiz:quiz_id (
            titulo
          )
        `)

      if (attemptsError) throw attemptsError

      const xpMap = {}
      ;(xpRows || []).forEach(item => {
        if (!xpMap[item.usuario_id]) {
          xpMap[item.usuario_id] = {
            totalXP: 0,
            movements: [],
          }
        }

        xpMap[item.usuario_id].totalXP += Number(item.puntos || 0)
        xpMap[item.usuario_id].movements.push({
          puntos: Number(item.puntos || 0),
          fecha: item.fecha,
          descripcion: item.descripcion || 'Actividad completada',
        })
      })

      const attemptsMap = {}
      ;(attemptsRows || []).forEach(item => {
        if (!attemptsMap[item.usuario_id]) {
          attemptsMap[item.usuario_id] = []
        }

        attemptsMap[item.usuario_id].push({
          puntaje: Number(item.puntaje || 0),
          fecha: item.fecha_intento,
          quizTitle: item.quiz?.titulo || 'Quiz sin título',
        })
      })

      const groupedUsers = {}

      ;(progressRows || []).forEach(row => {
        const userId = row.usuario_id
        const currentXP = xpMap[userId]?.totalXP || 0

        if (!groupedUsers[userId]) {
          groupedUsers[userId] = {
            usuarioId: userId,
            studentName: row.usuario?.nombre || 'Sin nombre',
            email: row.usuario?.email || 'Sin correo',
            totalXP: currentXP,
            lastActivityRaw: row.updated_at,
            courses: [],
            quizAttempts: attemptsMap[userId] || [],
            xpMovements: xpMap[userId]?.movements || [],
          }
        }

        groupedUsers[userId].courses.push({
          id: `${row.usuario_id}-${row.curso_id}`,
          course: row.curso?.titulo || 'Curso sin título',
          progress: Math.round(Number(row.porcentaje_completado || 0)),
          lastActivity: row.updated_at
            ? new Date(row.updated_at).toLocaleDateString()
            : 'Sin actividad',
          lastActivityRaw: row.updated_at,
        })

        if (
          row.updated_at &&
          (!groupedUsers[userId].lastActivityRaw ||
            new Date(row.updated_at) > new Date(groupedUsers[userId].lastActivityRaw))
        ) {
          groupedUsers[userId].lastActivityRaw = row.updated_at
        }
      })

      const usersArray = Object.values(groupedUsers).map(user => {
        const averageProgress =
          user.courses.length > 0
            ? Math.round(
                user.courses.reduce((acc, course) => acc + Number(course.progress || 0), 0) /
                  user.courses.length
              )
            : 0

        const completedCourses = user.courses.filter(
          course => Number(course.progress) === 100
        ).length

        const averageQuizScore =
          user.quizAttempts.length > 0
            ? Math.round(
                user.quizAttempts.reduce((acc, attempt) => acc + Number(attempt.puntaje || 0), 0) /
                  user.quizAttempts.length
              )
            : 0

        let status = 'Iniciando'
        if (averageProgress === 100) {
          status = 'Completado'
        } else if (averageProgress >= 70) {
          status = 'Avanzado'
        } else if (averageProgress >= 30) {
          status = 'En progreso'
        }

        return {
          ...user,
          averageProgress,
          completedCourses,
          averageQuizScore,
          status,
          lastActivity: user.lastActivityRaw
            ? new Date(user.lastActivityRaw).toLocaleDateString()
            : 'Sin actividad',
        }
      })

      setUsersSummary(usersArray)
    } catch (error) {
      console.error('Error al cargar el progreso de estudiantes:', error)
      setUsersSummary([])
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const averageProgress =
      usersSummary.length > 0
        ? Math.round(
            usersSummary.reduce((acc, user) => acc + Number(user.averageProgress || 0), 0) /
              usersSummary.length
          )
        : 0

    const totalXP = usersSummary.reduce((acc, user) => acc + Number(user.totalXP || 0), 0)

    const completedCourses = usersSummary.reduce(
      (acc, user) => acc + Number(user.completedCourses || 0),
      0
    )

    return {
      averageProgress,
      totalXP,
      completedCourses,
    }
  }, [usersSummary])

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-8">
        <p className="text-center text-[#8A8A8A]">Cargando progreso de estudiantes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-[#1A1A1A]">Progreso de Estudiantes</h1>
        <p className="mt-2 text-[16px] text-[#8A8A8A]">
          Monitorea el avance general y revisa el perfil individual de cada usuario.
        </p>
      </div>

      <ProgressStats stats={stats} />

      <section className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white">
        <div className="border-b border-[#EAEAEA] px-6 py-5">
          <h2 className="text-[18px] font-semibold text-[#1A1A1A]">Seguimiento individual</h2>
          <p className="mt-1 text-sm text-[#8A8A8A]">
            El administrador puede consultar el detalle específico de cada estudiante.
          </p>
        </div>

        <div className="space-y-4 p-6">
          {usersSummary.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#EAEAEA] p-10 text-center text-[#8A8A8A]">
              No hay registros de progreso disponibles.
            </div>
          ) : (
            usersSummary.map(user => (
              <StudentProgressCard
                key={user.usuarioId}
                user={user}
                onViewProfile={() => setSelectedUser(user)}
              />
            ))
          )}
        </div>
      </section>

      <ProgressInsights users={usersSummary} />

      <UserProgressModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}
