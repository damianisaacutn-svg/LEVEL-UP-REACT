import { supabase } from '../../lib/supabaseClient'

function buildQuestionsWithAnswers({
  quizPreguntaData = [],
  preguntasData = [],
  preguntaRespuestaData = [],
  respuestasData = [],
  revisionesPregunta = [],
}) {
  const preguntasMap = Object.fromEntries(
    (preguntasData || []).map(p => [
      p.id_pregunta,
      {
        id: p.id_pregunta,
        text: p.texto || 'Pregunta sin texto',
        answers: [],
      },
    ])
  )

  const respuestasMap = Object.fromEntries(
    (respuestasData || []).map(r => [
      r.id_respuesta,
      {
        id: r.id_respuesta,
        text: r.texto || 'Respuesta sin texto',
      },
    ])
  )

  const relacionesPorPregunta = (preguntaRespuestaData || []).reduce((acc, item) => {
    if (!acc[item.pregunta_id]) acc[item.pregunta_id] = []
    acc[item.pregunta_id].push(item)
    return acc
  }, {})

  Object.keys(relacionesPorPregunta).forEach(preguntaId => {
    if (preguntasMap[preguntaId]) {
      preguntasMap[preguntaId].answers = relacionesPorPregunta[preguntaId].map(rel => ({
        id: respuestasMap[rel.respuesta_id]?.id || rel.respuesta_id,
        text: respuestasMap[rel.respuesta_id]?.text || 'Respuesta sin texto',
        isCorrect: !!rel.es_correcta,
      }))
    }
  })

  const revisionesPreguntaMap = Object.fromEntries(
    (revisionesPregunta || []).map(item => [
      item.pregunta_id,
      {
        idRevisionPregunta: item.id_revision_pregunta,
        estadoRevision: item.estado || 'pendiente',
        comentario: item.comentario || '',
        checklist: {
          redaccion_correcta: item.redaccion_correcta,
          respuestas_coherentes: item.respuestas_coherentes,
          respuesta_correcta_valida: item.respuesta_correcta_valida,
          relacionada_modulo: item.relacionada_modulo,
        },
      },
    ])
  )

  return (quizPreguntaData || [])
    .map(rel => {
      const question = preguntasMap[rel.pregunta_id]
      if (!question) return null

      return {
        ...question,
        review: revisionesPreguntaMap[rel.pregunta_id] || {
          idRevisionPregunta: null,
          estadoRevision: 'pendiente',
          comentario: '',
          checklist: {
            redaccion_correcta: null,
            respuestas_coherentes: null,
            respuesta_correcta_valida: null,
            relacionada_modulo: null,
          },
        },
      }
    })
    .filter(Boolean)
}

export async function getAdminIdByAuthUser(authUserId) {
  if (!authUserId) return null

  const { data, error } = await supabase
    .from('administrador')
    .select('id_admin')
    .eq('usuario_id', authUserId)
    .maybeSingle()

  if (error) throw error
  return data?.id_admin || null
}

export async function fetchModulesForAdmin() {
  const { data, error } = await supabase
    .from('modulo')
    .select(
      `
      id_modulo,
      titulo,
      orden,
      curso:curso_id (
        id_curso,
        titulo
      )
    `
    )
    .order('orden', { ascending: true })

  if (error) throw error

  return (data || []).map(mod => ({
    id: mod.id_modulo,
    title: mod.titulo || 'Módulo sin título',
    order: mod.orden || 0,
    courseId: mod.curso?.id_curso || '',
    courseTitle: mod.curso?.titulo || 'Sin curso',
  }))
}

export async function fetchQuizzesForAdmin() {
  const { data: quizzesData, error: quizzesError } = await supabase
    .from('quiz')
    .select(
      `
      id_quiz,
      titulo,
      descripcion,
      modulo_id,
      created_at,
      updated_at
    `
    )
    .order('created_at', { ascending: false })

  if (quizzesError) throw quizzesError

  if (!quizzesData?.length) return []

  const quizIds = quizzesData.map(q => q.id_quiz)
  const moduloIds = [...new Set(quizzesData.map(q => q.modulo_id).filter(Boolean))]

  const { data: modulesData, error: modulesError } = await supabase
    .from('modulo')
    .select(
      `
      id_modulo,
      curso_id,
      titulo,
      orden
    `
    )
    .in('id_modulo', moduloIds)

  if (modulesError) throw modulesError

  const modulesMap = Object.fromEntries(
    (modulesData || []).map(mod => [
      mod.id_modulo,
      {
        id: mod.id_modulo,
        courseId: mod.curso_id,
        title: mod.titulo || 'Sin módulo',
        order: mod.orden || 0,
      },
    ])
  )

  const courseIds = [...new Set((modulesData || []).map(m => m.curso_id).filter(Boolean))]

  const { data: coursesData, error: coursesError } = await supabase
    .from('curso')
    .select(
      `
      id_curso,
      instructor_id,
      titulo
    `
    )
    .in('id_curso', courseIds)

  if (coursesError) throw coursesError

  const coursesMap = Object.fromEntries(
    (coursesData || []).map(course => [
      course.id_curso,
      {
        id: course.id_curso,
        title: course.titulo || 'Sin curso',
        instructorId: course.instructor_id,
      },
    ])
  )

  const instructorIds = [...new Set((coursesData || []).map(c => c.instructor_id).filter(Boolean))]

  const { data: instructorsData, error: instructorsError } = await supabase
    .from('instructor')
    .select(
      `
      id_instructor,
      usuario_id
    `
    )
    .in('id_instructor', instructorIds)

  if (instructorsError) throw instructorsError

  const instructorUserIds = [
    ...new Set((instructorsData || []).map(inst => inst.usuario_id).filter(Boolean)),
  ]

  const { data: usuariosData, error: usuariosError } = await supabase
    .from('usuario')
    .select(
      `
      id_usuario,
      nombre,
      email
    `
    )
    .in('id_usuario', instructorUserIds)

  if (usuariosError) throw usuariosError

  const usuariosMap = Object.fromEntries(
    (usuariosData || []).map(user => [
      user.id_usuario,
      {
        nombre: user.nombre || 'Instructor desconocido',
        email: user.email || '',
      },
    ])
  )

  const instructorsMap = Object.fromEntries(
    (instructorsData || []).map(inst => [
      inst.id_instructor,
      {
        name: usuariosMap[inst.usuario_id]?.nombre || 'Instructor desconocido',
        email: usuariosMap[inst.usuario_id]?.email || '',
      },
    ])
  )

  const { data: quizPreguntaData, error: quizPreguntaError } = await supabase
    .from('quiz_pregunta')
    .select('quiz_id, pregunta_id')
    .in('quiz_id', quizIds)

  if (quizPreguntaError) throw quizPreguntaError

  const preguntaIds = [...new Set((quizPreguntaData || []).map(x => x.pregunta_id).filter(Boolean))]

  let preguntasData = []
  let preguntaRespuestaData = []
  let respuestasData = []

  if (preguntaIds.length > 0) {
    const { data: preguntasResp, error: preguntasError } = await supabase
      .from('pregunta')
      .select('id_pregunta, texto')
      .in('id_pregunta', preguntaIds)

    if (preguntasError) throw preguntasError
    preguntasData = preguntasResp || []

    const { data: preguntaRespuestaResp, error: preguntaRespuestaError } = await supabase
      .from('pregunta_respuesta')
      .select('pregunta_id, respuesta_id, es_correcta')
      .in('pregunta_id', preguntaIds)

    if (preguntaRespuestaError) throw preguntaRespuestaError
    preguntaRespuestaData = preguntaRespuestaResp || []

    const respuestaIds = [
      ...new Set((preguntaRespuestaResp || []).map(x => x.respuesta_id).filter(Boolean)),
    ]

    if (respuestaIds.length > 0) {
      const { data: respuestasResp, error: respuestasError } = await supabase
        .from('respuesta')
        .select('id_respuesta, texto')
        .in('id_respuesta', respuestaIds)

      if (respuestasError) throw respuestasError
      respuestasData = respuestasResp || []
    }
  }

  const { data: attemptsData, error: attemptsError } = await supabase
    .from('intento_quiz')
    .select(
      `
      id_intento,
      quiz_id,
      usuario_id,
      puntaje,
      fecha_intento
    `
    )
    .in('quiz_id', quizIds)

  if (attemptsError) throw attemptsError

  const attemptsByQuiz = (attemptsData || []).reduce((acc, item) => {
    if (!acc[item.quiz_id]) acc[item.quiz_id] = []
    acc[item.quiz_id].push(item)
    return acc
  }, {})

  let revisionesQuizData = []
  let revisionesPreguntaData = []

  const revisionQuizResponse = await supabase
    .from('revision_quiz')
    .select(
      `
      id_revision,
      quiz_id,
      admin_id,
      estado,
      comentario_general,
      es_apto,
      publicar,
      fecha_revision,
      updated_at
    `
    )
    .in('quiz_id', quizIds)

  if (!revisionQuizResponse.error) {
    revisionesQuizData = revisionQuizResponse.data || []
  }

  const revisionPreguntaResponse = await supabase
    .from('revision_pregunta')
    .select(
      `
      id_revision_pregunta,
      quiz_id,
      pregunta_id,
      estado,
      comentario,
      redaccion_correcta,
      respuestas_coherentes,
      respuesta_correcta_valida,
      relacionada_modulo
    `
    )
    .in('quiz_id', quizIds)

  if (!revisionPreguntaResponse.error) {
    revisionesPreguntaData = revisionPreguntaResponse.data || []
  }

  const revisionesQuizMap = Object.fromEntries(
    (revisionesQuizData || []).map(r => [
      r.quiz_id,
      {
        idRevision: r.id_revision,
        adminId: r.admin_id,
        estado: r.estado || 'pendiente',
        comentarioGeneral: r.comentario_general || '',
        esApto: r.es_apto,
        publicar: !!r.publicar,
        fechaRevision: r.fecha_revision,
        updatedAt: r.updated_at,
      },
    ])
  )

  const quizPreguntaMap = (quizPreguntaData || []).reduce((acc, item) => {
    if (!acc[item.quiz_id]) acc[item.quiz_id] = []
    acc[item.quiz_id].push(item)
    return acc
  }, {})

  return quizzesData.map(q => {
    const module = modulesMap[q.modulo_id]
    const course = module ? coursesMap[module.courseId] : null
    const instructor = course ? instructorsMap[course.instructorId] : null

    const questions = buildQuestionsWithAnswers({
      quizPreguntaData: quizPreguntaMap[q.id_quiz] || [],
      preguntasData,
      preguntaRespuestaData,
      respuestasData,
      revisionesPregunta: (revisionesPreguntaData || []).filter(r => r.quiz_id === q.id_quiz),
    })

    const attemptsDataQuiz = attemptsByQuiz[q.id_quiz] || []
    const attempts = attemptsDataQuiz.length
    const avgScore =
      attempts > 0
        ? Math.round(
            attemptsDataQuiz.reduce((acc, i) => acc + Number(i.puntaje || 0), 0) / attempts
          )
        : 0

    const review = revisionesQuizMap[q.id_quiz] || {
      idRevision: null,
      adminId: null,
      estado: 'pendiente',
      comentarioGeneral: '',
      esApto: null,
      publicar: false,
      fechaRevision: null,
      updatedAt: null,
    }

    return {
      id: q.id_quiz,
      title: q.titulo || 'Quiz sin título',
      description: q.descripcion || 'Sin descripción',
      moduleId: q.modulo_id,
      moduleTitle: module?.title || 'Sin módulo',
      moduleOrder: module?.order || 0,
      courseId: course?.id || '',
      courseTitle: course?.title || 'Sin curso',
      instructorName: instructor?.name || 'Instructor desconocido',
      instructorEmail: instructor?.email || '',
      questions,
      questionsCount: questions.length,
      attempts,
      avgScore,
      attemptsData: attemptsDataQuiz,
      createdAt: q.created_at,
      updatedAt: q.updated_at,
      review,
    }
  })
}

export async function updateQuizBasicInfo(quizId, payload) {
  const { error } = await supabase.from('quiz').update(payload).eq('id_quiz', quizId)
  if (error) throw error
}

export async function deleteQuizById(quizId) {
  const { error } = await supabase.from('quiz').delete().eq('id_quiz', quizId)
  if (error) throw error
}

export async function upsertQuizReview({
  quizId,
  adminId,
  estado,
  comentarioGeneral,
  esApto,
  publicar,
}) {
  const payload = {
    quiz_id: quizId,
    admin_id: adminId || null,
    estado,
    comentario_general: comentarioGeneral || '',
    es_apto: esApto,
    publicar: !!publicar,
    fecha_revision: new Date().toISOString(),
  }

  const { error } = await supabase.from('revision_quiz').upsert(payload, {
    onConflict: 'quiz_id',
  })

  if (error) throw error
}

export async function upsertQuestionReview({ quizId, preguntaId, estado, comentario, checklist }) {
  const payload = {
    quiz_id: quizId,
    pregunta_id: preguntaId,
    estado,
    comentario: comentario || '',
    redaccion_correcta: checklist?.redaccion_correcta ?? null,
    respuestas_coherentes: checklist?.respuestas_coherentes ?? null,
    respuesta_correcta_valida: checklist?.respuesta_correcta_valida ?? null,
    relacionada_modulo: checklist?.relacionada_modulo ?? null,
  }

  const { error } = await supabase.from('revision_pregunta').upsert(payload, {
    onConflict: 'quiz_id,pregunta_id',
  })

  if (error) throw error
}

export async function createActivityLog({ usuarioId, accion, tablaAfectada, descripcion }) {
  const { error } = await supabase.from('activity_log').insert({
    usuario_id: usuarioId || null,
    accion,
    tabla_afectada: tablaAfectada,
    descripcion,
  })

  if (error) throw error
}
