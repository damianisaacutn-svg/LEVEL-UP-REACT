import { supabase } from '../../lib/supabaseClient'
import { fetchCourseReviews, fetchVideoReviews } from './courseReviewService'
import { getComputedCourseReviewStatus } from '../utils/courseStatus'

export async function fetchInstructorsService() {
  const { data: instructorsData, error: instructorsError } = await supabase
    .from('instructor')
    .select(
      `
      id_instructor,
      usuario_id,
      verificado,
      created_at
    `
    )
    .order('created_at', { ascending: false })

  if (instructorsError) throw instructorsError

  const userIds = [...new Set((instructorsData || []).map(item => item.usuario_id).filter(Boolean))]

  let usersMap = {}

  if (userIds.length > 0) {
    const { data: usersData, error: usersError } = await supabase
      .from('usuario')
      .select(
        `
        id_usuario,
        nombre,
        email
      `
      )
      .in('id_usuario', userIds)

    if (usersError) throw usersError

    usersMap = Object.fromEntries(
      (usersData || []).map(user => [
        user.id_usuario,
        {
          id_usuario: user.id_usuario,
          nombre: user.nombre || 'Usuario sin nombre',
          email: user.email || '',
        },
      ])
    )
  }

  return (instructorsData || []).map(item => {
    const user = usersMap[item.usuario_id] || null

    return {
      id: item.id_instructor,
      verified: item.verificado ?? false,
      name: user?.nombre || 'Instructor sin nombre',
      email: user?.email || '',
      userId: item.usuario_id || null,
    }
  })
}

export async function fetchCoursesService() {
  const { data: coursesData, error: coursesError } = await supabase
    .from('curso')
    .select(
      `
      id_curso,
      instructor_id,
      titulo,
      descripcion,
      duracion,
      created_at,
      updated_at
    `
    )
    .order('updated_at', { ascending: false })

  if (coursesError) throw coursesError

  if (!coursesData?.length) return []

  const courseIds = coursesData.map(c => c.id_curso)
  const instructorIds = [...new Set(coursesData.map(c => c.instructor_id).filter(Boolean))]

  let instructorsMap = {}

  if (instructorIds.length > 0) {
    const { data: instructorsData, error: instructorsError } = await supabase
      .from('instructor')
      .select(
        `
        id_instructor,
        usuario_id,
        verificado
      `
      )
      .in('id_instructor', instructorIds)

    if (instructorsError) throw instructorsError

    const userIds = [
      ...new Set((instructorsData || []).map(item => item.usuario_id).filter(Boolean)),
    ]

    let usersMap = {}

    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('usuario')
        .select(
          `
          id_usuario,
          nombre,
          email
        `
        )
        .in('id_usuario', userIds)

      if (usersError) throw usersError

      usersMap = Object.fromEntries(
        (usersData || []).map(user => [
          user.id_usuario,
          {
            id_usuario: user.id_usuario,
            nombre: user.nombre || 'Usuario sin nombre',
            email: user.email || '',
          },
        ])
      )
    }

    instructorsMap = Object.fromEntries(
      (instructorsData || []).map(item => {
        const user = usersMap[item.usuario_id] || null

        return [
          item.id_instructor,
          {
            id: item.id_instructor,
            verified: item.verificado ?? false,
            name: user?.nombre || 'Instructor desconocido',
            email: user?.email || '',
            userId: item.usuario_id || null,
          },
        ]
      })
    )
  }

  let modulesByCourse = {}
  const { data: modulesData, error: modulesError } = await supabase
    .from('modulo')
    .select(
      `
      id_modulo,
      curso_id,
      titulo,
      descripcion,
      orden,
      created_at,
      updated_at
    `
    )
    .in('curso_id', courseIds)

  if (!modulesError && modulesData) {
    modulesByCourse = modulesData.reduce((acc, mod) => {
      if (!acc[mod.curso_id]) acc[mod.curso_id] = []
      acc[mod.curso_id].push({ ...mod, video: [], quiz: [] })
      return acc
    }, {})
  }

  const moduleIds = modulesData?.map(m => m.id_modulo) || []

  let allVideos = []

  if (moduleIds.length) {
    const { data: videosData, error: videosError } = await supabase
      .from('video')
      .select(
        `
        id_video,
        modulo_id,
        titulo,
        url,
        duracion,
        created_at,
        updated_at
      `
      )
      .in('modulo_id', moduleIds)

    if (!videosError && videosData) {
      allVideos = videosData

      const moduleMap = {}
      Object.values(modulesByCourse).forEach(mods => {
        mods.forEach(mod => {
          moduleMap[mod.id_modulo] = mod
        })
      })

      videosData.forEach(video => {
        if (moduleMap[video.modulo_id]) {
          moduleMap[video.modulo_id].video.push(video)
        }
      })
    }
  }

  if (moduleIds.length) {
    const { data: quizzesData, error: quizzesError } = await supabase
      .from('quiz')
      .select(
        `
        id_quiz,
        modulo_id,
        titulo,
        descripcion,
        created_at,
        updated_at
      `
      )
      .in('modulo_id', moduleIds)

    if (!quizzesError && quizzesData) {
      const moduleMap = {}
      Object.values(modulesByCourse).forEach(mods => {
        mods.forEach(mod => {
          moduleMap[mod.id_modulo] = mod
        })
      })

      quizzesData.forEach(quiz => {
        if (moduleMap[quiz.modulo_id]) {
          moduleMap[quiz.modulo_id].quiz.push(quiz)
        }
      })
    }
  }

  let enrollmentsByCourse = {}
  const { data: enrollmentsData, error: enrollmentsError } = await supabase
    .from('inscripcion')
    .select(
      `
      id_inscripcion,
      curso_id,
      usuario_id,
      estado,
      fecha_inscripcion
    `
    )
    .in('curso_id', courseIds)

  if (!enrollmentsError && enrollmentsData) {
    enrollmentsByCourse = enrollmentsData.reduce((acc, item) => {
      if (!acc[item.curso_id]) acc[item.curso_id] = []
      acc[item.curso_id].push(item)
      return acc
    }, {})
  }

  let progressByCourse = {}
  const { data: progressData, error: progressError } = await supabase
    .from('progreso')
    .select(
      `
      id_progreso,
      curso_id,
      usuario_id,
      porcentaje_completado
    `
    )
    .in('curso_id', courseIds)

  if (!progressError && progressData) {
    progressByCourse = progressData.reduce((acc, item) => {
      if (!acc[item.curso_id]) acc[item.curso_id] = []
      acc[item.curso_id].push(item)
      return acc
    }, {})
  }

  const reviewsMap = await fetchCourseReviews(courseIds)
  const videoIds = allVideos.map(v => v.id_video)
  const videoReviewsMap = await fetchVideoReviews(videoIds)

  const formatted = coursesData.map(course => {
    const modules = (modulesByCourse[course.id_curso] || [])
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      .map(module => ({
        ...module,
        video: (module.video || []).map(video => ({
          ...video,
          review: videoReviewsMap[video.id_video] || null,
        })),
      }))

    const videosCount = modules.reduce((acc, mod) => acc + (mod.video?.length || 0), 0)
    const quizzesCount = modules.reduce((acc, mod) => acc + (mod.quiz?.length || 0), 0)
    const enrollments = enrollmentsByCourse[course.id_curso] || []
    const progressList = progressByCourse[course.id_curso] || []
    const review = reviewsMap[course.id_curso] || null

    const averageProgress = progressList.length
      ? Number(
          (
            progressList.reduce((acc, item) => acc + Number(item.porcentaje_completado || 0), 0) /
            progressList.length
          ).toFixed(1)
        )
      : 0

    const videosReviewedCount = modules.reduce((acc, mod) => {
      return (
        acc +
        (mod.video || []).filter(video =>
          ['approved', 'observed', 'rejected'].includes(video.review?.estado)
        ).length
      )
    }, 0)

    const videosObservedCount = modules.reduce((acc, mod) => {
      return acc + (mod.video || []).filter(video => video.review?.estado === 'observed').length
    }, 0)

    const videosRejectedCount = modules.reduce((acc, mod) => {
      return acc + (mod.video || []).filter(video => video.review?.estado === 'rejected').length
    }, 0)

    const result = {
      id: course.id_curso,
      instructorId: course.instructor_id,
      title: course.titulo,
      description: course.descripcion || 'Sin descripción',
      duration: course.duracion || 0,
      createdAt: course.created_at,
      updatedAt: course.updated_at,
      instructor: instructorsMap[course.instructor_id] || {
        id: '',
        verified: false,
        name: 'Instructor desconocido',
        email: '',
        userId: null,
      },
      modules,
      modulesCount: modules.length,
      videosCount,
      quizzesCount,
      enrollmentsCount: enrollments.length,
      averageProgress,
      enrollments,
      progressList,
      review,
      videosReviewedCount,
      videosObservedCount,
      videosRejectedCount,
    }

    return {
      ...result,
      reviewStatus: getComputedCourseReviewStatus(result),
    }
  })

  return formatted
}

export async function updateCourseService(courseId, payload) {
  const { error } = await supabase.from('curso').update(payload).eq('id_curso', courseId)
  if (error) throw error
  return true
}

export async function deleteCourseService(courseId) {
  const { error } = await supabase.from('curso').delete().eq('id_curso', courseId)
  if (error) throw error
  return true
}
