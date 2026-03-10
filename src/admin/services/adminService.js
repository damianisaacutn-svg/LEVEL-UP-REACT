import { supabase } from '../../config/supabaseClient'

/* =========================
   MÉTRICAS DEL DASHBOARD
========================= */

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

/* =========================
   CONTENIDO PENDIENTE
========================= */

export async function getPendingContent() {
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select(
        `
        id,
        titulo,
        estado,
        usuarios(nombre)
      `
      )
      .eq('estado', 'revision')
      .limit(10)

    if (error) throw error

    return data.map(course => ({
      id: course.id,
      titulo: course.titulo,
      instructor: course.usuarios?.nombre || 'Instructor',
      estado: course.estado,
    }))
  } catch (error) {
    console.error('Error obteniendo contenido pendiente:', error)
    return []
  }
}

/* =========================
   ACTIVIDAD RECIENTE
========================= */

export async function getRecentActivity() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id,nombre,updated_at')
      .order('updated_at', { ascending: false })
      .limit(5)

    if (error) throw error

    return data.map(user => ({
      id: user.id,
      action: `Usuario actualizado: ${user.nombre}`,
      date: new Date(user.updated_at).toLocaleString(),
    }))
  } catch (error) {
    console.error('Error obteniendo actividad reciente:', error)
    return []
  }
}

/* =========================
   USUARIOS
========================= */

/* Obtener todos los usuarios */

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('usuarios')
    .select(
      `
      id,
      nombre,
      rol_id,
      estado,
      created_at
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo usuarios:', error)
    throw error
  }

  return data
}

/* =========================
   VALIDACIÓN ADMIN
========================= */

async function validateNotAdmin(userId) {
  const { data, error } = await supabase.from('usuarios').select('rol_id').eq('id', userId).single()

  if (error) throw error

  if (data.rol_id === 1) {
    throw new Error('No se puede modificar un administrador')
  }

  return true
}

/* =========================
   CAMBIAR ROL
========================= */

export async function updateUserRole(userId, newRole) {
  await validateNotAdmin(userId)

  const { data, error } = await supabase
    .from('usuarios')
    .update({
      rol_id: newRole,
      updated_at: new Date(),
    })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error actualizando rol:', error)
    throw error
  }

  return data
}

/* =========================
   ACTIVAR / SUSPENDER
========================= */

export async function toggleUserStatus(userId, currentStatus) {
  await validateNotAdmin(userId)

  const newStatus = currentStatus === 'activo' ? 'suspendido' : 'activo'

  const { data, error } = await supabase
    .from('usuarios')
    .update({
      estado: newStatus,
      updated_at: new Date(),
    })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error cambiando estado usuario:', error)
    throw error
  }

  return data
}

/* =========================
   EDITAR NOMBRE
========================= */

export async function updateUserName(userId, name) {
  await validateNotAdmin(userId)

  const { data, error } = await supabase
    .from('usuarios')
    .update({
      nombre: name,
      updated_at: new Date(),
    })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error actualizando nombre:', error)
    throw error
  }

  return data
}
