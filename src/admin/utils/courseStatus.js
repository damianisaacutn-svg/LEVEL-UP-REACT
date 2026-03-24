export const COURSE_REVIEW_STATUS = {
  draft: {
    label: 'Borrador',
    className: 'bg-[#F5F5F5] text-[#6B7280] border-[#E5E7EB]',
  },
  in_review: {
    label: 'En revisión',
    className: 'bg-[#FFF7ED] text-[#F39C12] border-[#FDE7C3]',
  },
  approved: {
    label: 'Aprobado',
    className: 'bg-[#ECFDF3] text-[#2ECC71] border-[#CDEFD9]',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-[#FEF2F2] text-[#E74C3C] border-[#FECACA]',
  },
}

export const VIDEO_REVIEW_STATUS = {
  pending: {
    label: 'Pendiente',
    className: 'bg-[#F5F5F5] text-[#6B7280] border-[#E5E7EB]',
  },
  approved: {
    label: 'Aprobado',
    className: 'bg-[#ECFDF3] text-[#2ECC71] border-[#CDEFD9]',
  },
  observed: {
    label: 'Con observaciones',
    className: 'bg-[#FFF7ED] text-[#F39C12] border-[#FDE7C3]',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-[#FEF2F2] text-[#E74C3C] border-[#FECACA]',
  },
}

export function getCourseStructureStatus(course) {
  const hasDescription =
    !!course?.description && String(course.description).trim() !== 'Sin descripción'
  const hasModules = Number(course?.modulesCount || 0) > 0
  const hasVideos = Number(course?.videosCount || 0) > 0
  const hasQuizzes = Number(course?.quizzesCount || 0) > 0
  const verifiedInstructor = !!course?.instructor?.verified

  const checklist = {
    hasDescription,
    hasModules,
    hasVideos,
    hasQuizzes,
    verifiedInstructor,
  }

  const readyForReview = hasDescription && hasModules && hasVideos
  const readyToPublish = hasDescription && hasModules && hasVideos && hasQuizzes

  return {
    checklist,
    readyForReview,
    readyToPublish,
  }
}

export function getComputedCourseReviewStatus(course) {
  const review = course?.review

  if (review?.estado_revision) {
    return review.estado_revision
  }

  const { readyForReview } = getCourseStructureStatus(course)
  return readyForReview ? 'in_review' : 'draft'
}

export function getPublicationLabel(course) {
  if (course?.review?.apto_publicacion) return 'Apto para publicar'
  return 'No apto'
}
