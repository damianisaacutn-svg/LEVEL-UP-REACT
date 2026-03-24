import { supabase } from '../../lib/supabaseClient'
import { getMonthRange, getPreviousMonthRange } from './dashboardUtils'

// ==========================
// 📌 STATS PRINCIPALES (CARDS)
// ==========================
export const getDashboardStats = async () => {
  const [
    { count: users },
    { count: instructors },
    { count: courses },
    { count: quizzes },
    { count: videos },
    { count: enrollments },
    { data: xpData },
  ] = await Promise.all([
    supabase
      .from('usuario')
      .select('*', { count: 'exact', head: true })
      .neq('tipo_usuario', 'admin'),
    supabase.from('instructor').select('*', { count: 'exact', head: true }),
    supabase.from('curso').select('*', { count: 'exact', head: true }),
    supabase.from('quiz').select('*', { count: 'exact', head: true }),
    supabase.from('video').select('*', { count: 'exact', head: true }),
    supabase.from('inscripcion').select('*', { count: 'exact', head: true }).eq('estado', 'activa'),
    supabase.from('xp').select('puntos'),
  ])

  const totalXP = xpData?.reduce((acc, item) => acc + (item.puntos || 0), 0) || 0

  return {
    totalUsers: users || 0,
    totalInstructors: instructors || 0,
    publishedCourses: courses || 0,
    totalQuizzes: quizzes || 0,
    totalVideos: videos || 0,
    activeEnrollments: enrollments || 0,
    totalXP,
  }
}

// ==========================
// 📌 USERS GROWTH (POR MES)
// ==========================
export const getUsersGrowth = async () => {
  const { data, error } = await supabase.from('usuario').select('created_at')

  if (error) throw error

  const grouped = {}

  data?.forEach(u => {
    const month = new Date(u.created_at).toLocaleString('default', { month: 'short' })

    if (!grouped[month]) grouped[month] = 0
    grouped[month]++
  })

  return Object.entries(grouped)
    .map(([month, users]) => ({ month, users }))
    .sort((a, b) => new Date(`1 ${a.month} 2024`) - new Date(`1 ${b.month} 2024`))
}

// ==========================
// 📌 INSCRIPCIONES POR CURSO
// ==========================
export const getEnrollmentsByCourse = async () => {
  const { data, error } = await supabase.from('inscripcion').select(`
    curso_id,
    curso:curso_id (titulo)
  `)

  if (error) throw error

  const grouped = {}

  data?.forEach(e => {
    const title = e.curso?.titulo || 'Sin nombre'

    if (!grouped[title]) grouped[title] = 0
    grouped[title]++
  })

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }))
}

// ==========================
// 📌 ROLES DISTRIBUCIÓN
// ==========================
export const getRolesDistribution = async () => {
  const { data, error } = await supabase.from('usuario').select('tipo_usuario')

  if (error) throw error

  const grouped = {}

  const normalizeRole = role => {
    if (!role) return 'Estudiantes'

    const r = role.toLowerCase()

    if (r === 'student' || r === 'estudiante') return 'Estudiantes'
    if (r === 'instructor') return 'Instructores'
    if (r === 'admin') return 'Admins'

    return 'Estudiantes'
  }

  data?.forEach(u => {
    const role = normalizeRole(u.tipo_usuario)

    if (!grouped[role]) grouped[role] = 0
    grouped[role]++
  })

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }))
}

// ==========================
// 📌 ACTIVIDAD 24H
// ==========================
export const getActivityLast24h = async () => {
  const since = new Date()
  since.setHours(since.getHours() - 24)

  const { data, error } = await supabase.from('activity_log').select('fecha')

  if (error) throw error

  const grouped = {}

  data
    ?.filter(a => new Date(a.fecha) >= since)
    .forEach(a => {
      const hour = new Date(a.fecha).getHours()

      if (!grouped[hour]) grouped[hour] = 0
      grouped[hour]++
    })

  return Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i}:00`,
    activity: grouped[i] || 0,
  }))
}

// ==========================
// 📌 GROWTH GENERICO
// ==========================
export const getMonthlyCount = async table => {
  const current = getMonthRange()
  const previous = getPreviousMonthRange()

  const [{ count: currentCount }, { count: previousCount }] = await Promise.all([
    supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', current.start)
      .lte('created_at', current.end),

    supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', previous.start)
      .lte('created_at', previous.end),
  ])

  return {
    current: currentCount || 0,
    previous: previousCount || 0,
  }
}

export const getQuickSummary = async () => {
  const now = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(now.getDate() - 7)

  const [
    { data: progressData },
    { data: coursesData },
    { data: usersData },
    { data: quizAttempts },
  ] = await Promise.all([
    // 📊 PROGRESO
    supabase.from('progreso').select('porcentaje_completado'),

    // ⏱ DURACIÓN CURSOS
    supabase.from('curso').select('duracion'),

    // 👤 NUEVOS USUARIOS
    supabase.from('usuario').select('created_at').gte('created_at', weekAgo.toISOString()),

    // ⭐ RATING (simulado con puntaje)
    supabase.from('intento_quiz').select('puntaje'),
  ])

  // ==========================
  // 📊 PROMEDIO FINALIZACIÓN
  // ==========================
  const avgCompletion =
    progressData?.reduce((acc, p) => acc + (p.porcentaje_completado || 0), 0) /
      (progressData?.length || 1) || 0

  // ==========================
  // ⏱ TIEMPO PROMEDIO
  // ==========================
  const avgDuration =
    coursesData?.reduce((acc, c) => acc + (c.duracion || 0), 0) / (coursesData?.length || 1) || 0

  // ==========================
  // ⭐ RATING (SIMULADO 1-5)
  // ==========================
  const avgRating =
    quizAttempts?.reduce((acc, q) => acc + (q.puntaje || 0), 0) / (quizAttempts?.length || 1) || 0

  const ratingNormalized = Math.min(5, (avgRating / 100) * 5)

  return {
    avgCompletion: Math.round(avgCompletion),
    avgDuration: Math.round(avgDuration),
    avgRating: ratingNormalized.toFixed(1),
    newUsers: usersData?.length || 0,
  }
}
