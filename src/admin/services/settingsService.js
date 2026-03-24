import { supabase } from '../../lib/supabaseClient'

const SETTINGS_TABLE = 'configuracion_sistema'

function mapDatabaseToForm(row) {
  return {
    id: row.id_configuracion,
    platformName: row.nombre_plataforma ?? 'Level Up',
    platformDescription: row.descripcion_plataforma ?? 'Plataforma educativa interactiva',
    platformUrl: row.url_plataforma ?? 'https://levelup.platform',

    notifyNewUsers: row.notificar_nuevos_usuarios ?? true,
    notifySystemErrors: row.notificar_errores_sistema ?? true,
    notifyNewCourses: row.notificar_nuevos_cursos ?? false,
    notifyInstructorActivity: row.notificar_actividad_instructores ?? true,

    xpLesson: row.xp_leccion ?? 50,
    xpQuiz: row.xp_quiz ?? 100,
    xpCourse: row.xp_curso ?? 500,
    streakReward: row.recompensa_racha ?? 25,

    sessionDuration: row.duracion_sesion_minutos ?? 60,
    minimumPasswordLength: row.longitud_minima_password ?? 8,
    twoFactorRequired: row.requiere_doble_factor ?? false,
    maintenanceNotifications: row.notificaciones_mantenimiento ?? true,

    lastBackup: row.ultimo_backup,
    systemStatus: row.estado_sistema ?? 'operativo',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapFormToDatabase(form) {
  return {
    nombre_plataforma: form.platformName?.trim() || 'Level Up',
    descripcion_plataforma: form.platformDescription?.trim() || 'Plataforma educativa interactiva',
    url_plataforma: form.platformUrl?.trim() || 'https://levelup.platform',

    notificar_nuevos_usuarios: Boolean(form.notifyNewUsers),
    notificar_errores_sistema: Boolean(form.notifySystemErrors),
    notificar_nuevos_cursos: Boolean(form.notifyNewCourses),
    notificar_actividad_instructores: Boolean(form.notifyInstructorActivity),

    xp_leccion: Number(form.xpLesson) || 0,
    xp_quiz: Number(form.xpQuiz) || 0,
    xp_curso: Number(form.xpCourse) || 0,
    recompensa_racha: Number(form.streakReward) || 0,

    duracion_sesion_minutos: Number(form.sessionDuration) || 60,
    longitud_minima_password: Number(form.minimumPasswordLength) || 8,
    requiere_doble_factor: Boolean(form.twoFactorRequired),
    notificaciones_mantenimiento: Boolean(form.maintenanceNotifications),
  }
}

export async function getSystemSettings() {
  const { data, error } = await supabase.from(SETTINGS_TABLE).select('*').limit(1).single()

  if (error) {
    throw new Error(error.message || 'No se pudo obtener la configuración.')
  }

  return mapDatabaseToForm(data)
}

export async function updateSystemSettings(settings) {
  if (!settings?.id) {
    throw new Error('No se encontró el identificador de configuración.')
  }

  const payload = mapFormToDatabase(settings)

  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .update(payload)
    .eq('id_configuracion', settings.id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message || 'No se pudo actualizar la configuración.')
  }

  return mapDatabaseToForm(data)
}

export async function createBackupMark(settingsId) {
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .update({
      ultimo_backup: new Date().toISOString(),
    })
    .eq('id_configuracion', settingsId)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message || 'No se pudo actualizar el respaldo.')
  }

  return mapDatabaseToForm(data)
}

export async function resetSystemSettings(settingsId) {
  const defaultValues = {
    nombre_plataforma: 'Level Up',
    descripcion_plataforma: 'Plataforma educativa interactiva',
    url_plataforma: 'https://levelup.platform',

    notificar_nuevos_usuarios: true,
    notificar_errores_sistema: true,
    notificar_nuevos_cursos: false,
    notificar_actividad_instructores: true,

    xp_leccion: 50,
    xp_quiz: 100,
    xp_curso: 500,
    recompensa_racha: 25,

    duracion_sesion_minutos: 60,
    longitud_minima_password: 8,
    requiere_doble_factor: false,
    notificaciones_mantenimiento: true,
    estado_sistema: 'operativo',
  }

  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .update(defaultValues)
    .eq('id_configuracion', settingsId)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message || 'No se pudo restablecer la configuración.')
  }

  return mapDatabaseToForm(data)
}
