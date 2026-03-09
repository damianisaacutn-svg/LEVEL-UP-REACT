import { supabase } from '../../config/supabaseClient'

export async function getAdminStats() {
  try {
    const [usersRes, instructorsRes, coursesRes, videosRes, quizzesRes] = await Promise.all([
      supabase.from('usuarios').select('*', { count: 'exact', head: true }),

      supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('rol_id', 2),

      supabase.from('cursos').select('*', { count: 'exact', head: true }),

      supabase.from('videos').select('*', { count: 'exact', head: true }),

      supabase.from('quizzes').select('*', { count: 'exact', head: true }),
    ])

    return {
      users: usersRes.count || 0,
      instructors: instructorsRes.count || 0,
      courses: coursesRes.count || 0,
      videos: videosRes.count || 0,
      quizzes: quizzesRes.count || 0,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas admin:', error)

    return {
      users: 0,
      instructors: 0,
      courses: 0,
      videos: 0,
      quizzes: 0,
    }
  }
}
