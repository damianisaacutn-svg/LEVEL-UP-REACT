import { supabase } from '../../lib/supabaseClient'

export async function fetchCourseReviews(courseIds = []) {
  if (!courseIds.length) return {}

  const { data, error } = await supabase
    .from('revision_curso')
    .select(
      `
      id_revision,
      curso_id,
      admin_id,
      estado_revision,
      apto_publicacion,
      observaciones_generales,
      fecha_revision,
      updated_at
    `
    )
    .in('curso_id', courseIds)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error cargando revisiones de curso:', error)
    return {}
  }

  const map = {}
  for (const item of data || []) {
    if (!map[item.curso_id]) {
      map[item.curso_id] = item
    }
  }

  return map
}

export async function fetchVideoReviews(videoIds = []) {
  if (!videoIds.length) return {}

  const { data, error } = await supabase
    .from('revision_video')
    .select(
      `
      id_revision_video,
      video_id,
      admin_id,
      estado,
      observacion,
      fecha_revision,
      updated_at
    `
    )
    .in('video_id', videoIds)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error cargando revisiones de video:', error)
    return {}
  }

  const map = {}
  for (const item of data || []) {
    if (!map[item.video_id]) {
      map[item.video_id] = item
    }
  }

  return map
}

export async function saveCourseReview({
  courseId,
  adminId = null,
  estadoRevision,
  aptoPublicacion,
  observacionesGenerales,
}) {
  const { data: existing, error: existingError } = await supabase
    .from('revision_curso')
    .select('id_revision')
    .eq('curso_id', courseId)
    .maybeSingle()

  if (existingError) throw existingError

  const payload = {
    curso_id: courseId,
    admin_id: adminId,
    estado_revision: estadoRevision,
    apto_publicacion: aptoPublicacion,
    observaciones_generales: observacionesGenerales?.trim() || null,
    fecha_revision: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (existing?.id_revision) {
    const { error } = await supabase
      .from('revision_curso')
      .update(payload)
      .eq('id_revision', existing.id_revision)

    if (error) throw error
    return true
  }

  const { error } = await supabase.from('revision_curso').insert(payload)
  if (error) throw error
  return true
}

export async function saveVideoReview({ videoId, adminId = null, estado, observacion }) {
  const { data: existing, error: existingError } = await supabase
    .from('revision_video')
    .select('id_revision_video')
    .eq('video_id', videoId)
    .maybeSingle()

  if (existingError) throw existingError

  const payload = {
    video_id: videoId,
    admin_id: adminId,
    estado,
    observacion: observacion?.trim() || null,
    fecha_revision: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (existing?.id_revision_video) {
    const { error } = await supabase
      .from('revision_video')
      .update(payload)
      .eq('id_revision_video', existing.id_revision_video)

    if (error) throw error
    return true
  }

  const { error } = await supabase.from('revision_video').insert(payload)
  if (error) throw error
  return true
}
