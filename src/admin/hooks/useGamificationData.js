import { useEffect, useMemo, useState } from 'react'
import { Trophy, Award, Star, Zap, Crown, Medal } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export const xpLevels = [
  { level: 1, name: 'Principiante', minXP: 0, maxXP: 100, color: '#8A8A8A' },
  { level: 2, name: 'Aprendiz', minXP: 100, maxXP: 250, color: '#3A86FF' },
  { level: 3, name: 'Estudiante', minXP: 250, maxXP: 500, color: '#7B61FF' },
  { level: 4, name: 'Experto', minXP: 500, maxXP: 1000, color: '#F39C12' },
  { level: 5, name: 'Maestro', minXP: 1000, maxXP: 2000, color: '#FF2D55' },
  { level: 6, name: 'Leyenda', minXP: 2000, maxXP: 999999, color: '#FFD700' },
]

export const achievementDefinitions = [
  {
    id: 1,
    name: 'Primera Lección',
    description: 'Completa tu primera lección',
    icon: Star,
    xp: 50,
    color: '#3A86FF',
    key: 'first_lesson',
  },
  {
    id: 2,
    name: 'Racha de 7 días',
    description: 'Mantén una racha de estudio de 7 días consecutivos',
    icon: Zap,
    xp: 150,
    color: '#F39C12',
    key: 'streak_7',
  },
  {
    id: 3,
    name: 'Curso Completado',
    description: 'Finaliza tu primer curso completo',
    icon: Award,
    xp: 300,
    color: '#2ECC71',
    key: 'first_completed_course',
  },
  {
    id: 4,
    name: 'Quiz Perfecto',
    description: 'Obtén 100% en un quiz',
    icon: Trophy,
    xp: 200,
    color: '#FF6B8A',
    key: 'perfect_quiz',
  },
  {
    id: 5,
    name: 'Coleccionista',
    description: 'Desbloquea todos los logros base del sistema',
    icon: Medal,
    xp: 500,
    color: '#7B61FF',
    key: 'collector',
  },
  {
    id: 6,
    name: 'Máster',
    description: 'Alcanza el nivel 5',
    icon: Crown,
    xp: 1000,
    color: '#FFD700',
    key: 'reach_level_5',
  },
]

function getLevelByXP(totalXP) {
  return (
    xpLevels.find(level => totalXP >= level.minXP && totalXP < level.maxXP) ||
    xpLevels[xpLevels.length - 1]
  )
}

function getInitials(name = '', email = '') {
  if (name?.trim()) {
    const parts = name.trim().split(' ').filter(Boolean)
    return parts
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('')
  }

  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase()
  }

  return 'US'
}

function calculateCurrentStreakFromXPRows(xpRows) {
  if (!xpRows?.length) return 0

  const uniqueDays = [
    ...new Set(
      xpRows.filter(row => row?.fecha).map(row => new Date(row.fecha).toISOString().slice(0, 10))
    ),
  ].sort((a, b) => new Date(b) - new Date(a))

  if (!uniqueDays.length) return 0

  const today = new Date()
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayStr = normalizedToday.toISOString().slice(0, 10)

  const normalizedYesterday = new Date(normalizedToday)
  normalizedYesterday.setDate(normalizedToday.getDate() - 1)
  const yesterdayStr = normalizedYesterday.toISOString().slice(0, 10)

  if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yesterdayStr) {
    return 0
  }

  let streak = 1

  for (let i = 0; i < uniqueDays.length - 1; i += 1) {
    const current = new Date(uniqueDays[i])
    const next = new Date(uniqueDays[i + 1])
    const diffDays = Math.round((current - next) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak += 1
    } else {
      break
    }
  }

  return streak
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-MX').format(Number(value) || 0)
}

export function useGamificationData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [stats, setStats] = useState({
    totalXPGlobal: 0,
    totalAchievements: achievementDefinitions.length,
    averageXP: 0,
    maxLevel: xpLevels.length,
    activeUsersWithXP: 0,
  })

  const [leaderboard, setLeaderboard] = useState([])
  const [achievements, setAchievements] = useState(achievementDefinitions)

  useEffect(() => {
    let mounted = true

    async function loadGamificationData() {
      try {
        setLoading(true)
        setError('')

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!user) throw new Error('No hay un usuario autenticado.')

        const { data: allXPRows, error: allXPError } = await supabase
          .from('xp')
          .select('usuario_id, puntos, fecha')

        if (allXPError) throw allXPError

        const xpByUserMap = new Map()

        for (const row of allXPRows || []) {
          const currentXP = xpByUserMap.get(row.usuario_id) || 0
          xpByUserMap.set(row.usuario_id, currentXP + (Number(row.puntos) || 0))
        }

        const totalXPGlobal = [...xpByUserMap.values()].reduce((acc, value) => acc + value, 0)
        const activeUsersWithXP = xpByUserMap.size
        const averageXP = activeUsersWithXP > 0 ? Math.round(totalXPGlobal / activeUsersWithXP) : 0

        const { data: usersRows, error: usersError } = await supabase
          .from('usuario')
          .select('id_usuario, nombre, email')

        if (usersError) throw usersError

        const leaderboardData = (usersRows || [])
          .map(userRow => {
            const totalXP = xpByUserMap.get(userRow.id_usuario) || 0
            const levelInfo = getLevelByXP(totalXP)

            return {
              id: userRow.id_usuario,
              name: userRow.nombre || userRow.email || 'Usuario',
              xp: totalXP,
              level: levelInfo.name,
              avatar: getInitials(userRow.nombre, userRow.email),
            }
          })
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 5)
          .map((row, index) => ({
            ...row,
            rank: index + 1,
          }))

        const myXPRows = (allXPRows || []).filter(row => row.usuario_id === user.id)
        const myTotalXP = myXPRows.reduce((acc, row) => acc + (Number(row.puntos) || 0), 0)
        const myLevel = getLevelByXP(myTotalXP)
        const currentStreak = calculateCurrentStreakFromXPRows(myXPRows)

        const { data: myProgressRows, error: myProgressError } = await supabase
          .from('progreso')
          .select('curso_id, porcentaje_completado')
          .eq('usuario_id', user.id)

        if (myProgressError) throw myProgressError

        const completedCourses = (myProgressRows || []).filter(
          row => Number(row.porcentaje_completado) >= 100
        ).length

        const firstLessonUnlocked = (myProgressRows || []).some(
          row => Number(row.porcentaje_completado) > 0
        )

        const { data: myQuizAttempts, error: myQuizError } = await supabase
          .from('intento_quiz')
          .select('id_intento, puntaje, quiz_id')
          .eq('usuario_id', user.id)

        if (myQuizError) throw myQuizError

        const { data: quizQuestionRows, error: quizQuestionError } = await supabase
          .from('quiz_pregunta')
          .select('quiz_id, pregunta_id')

        if (quizQuestionError) throw quizQuestionError

        const questionCountByQuiz = new Map()

        for (const row of quizQuestionRows || []) {
          const currentCount = questionCountByQuiz.get(row.quiz_id) || 0
          questionCountByQuiz.set(row.quiz_id, currentCount + 1)
        }

        const perfectQuizUnlocked = (myQuizAttempts || []).some(attempt => {
          const totalQuestions = questionCountByQuiz.get(attempt.quiz_id) || 0
          if (totalQuestions <= 0) return false
          return Number(attempt.puntaje) >= totalQuestions
        })

        const baseUnlockedFlags = [
          firstLessonUnlocked,
          currentStreak >= 7,
          completedCourses >= 1,
          perfectQuizUnlocked,
          myLevel.level >= 5,
        ]

        const baseUnlockedCount = baseUnlockedFlags.filter(Boolean).length

        const resolvedAchievements = achievementDefinitions.map(achievement => {
          let unlocked = false

          switch (achievement.key) {
            case 'first_lesson':
              unlocked = firstLessonUnlocked
              break
            case 'streak_7':
              unlocked = currentStreak >= 7
              break
            case 'first_completed_course':
              unlocked = completedCourses >= 1
              break
            case 'perfect_quiz':
              unlocked = perfectQuizUnlocked
              break
            case 'collector':
              unlocked = baseUnlockedCount >= 5
              break
            case 'reach_level_5':
              unlocked = myLevel.level >= 5
              break
            default:
              unlocked = false
          }

          return {
            ...achievement,
            unlocked,
            unlockedText: unlocked ? 'Sí' : 'No',
          }
        })

        if (!mounted) return

        setStats({
          totalXPGlobal,
          totalAchievements: achievementDefinitions.length,
          averageXP,
          maxLevel: xpLevels.length,
          activeUsersWithXP,
        })

        setLeaderboard(leaderboardData)
        setAchievements(resolvedAchievements)
      } catch (err) {
        console.error('Error cargando gamificación:', err)

        if (mounted) {
          setError(err.message || 'Ocurrió un error al cargar la gamificación.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadGamificationData()

    return () => {
      mounted = false
    }
  }, [])

  const achievementUnlockedCount = useMemo(() => {
    return achievements.filter(item => item.unlocked).length
  }, [achievements])

  return {
    loading,
    error,
    stats,
    leaderboard,
    achievements,
    achievementUnlockedCount,
    xpLevels,
    formatNumber,
  }
}
