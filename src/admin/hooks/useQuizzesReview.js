import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  createActivityLog,
  deleteQuizById,
  fetchModulesForAdmin,
  fetchQuizzesForAdmin,
  getAdminIdByAuthUser,
  updateQuizBasicInfo,
  upsertQuestionReview,
  upsertQuizReview,
} from '../services/quizzesAdminService'

const initialForm = {
  titulo: '',
  descripcion: '',
  modulo_id: '',
}

export function useQuizzesReview() {
  const [quizzes, setQuizzes] = useState([])
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_desc')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errorMsg, setErrorMsg] = useState('')
  const [adminProfileId, setAdminProfileId] = useState(null)
  const [authUserId, setAuthUserId] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      const { data: authData } = await supabase.auth.getUser()
      const currentAuthUserId = authData?.user?.id || null
      setAuthUserId(currentAuthUserId)

      const [quizzesData, modulesData, adminId] = await Promise.all([
        fetchQuizzesForAdmin(),
        fetchModulesForAdmin(),
        currentAuthUserId ? getAdminIdByAuthUser(currentAuthUserId) : Promise.resolve(null),
      ])

      setQuizzes(quizzesData)
      setModules(modulesData)
      setAdminProfileId(adminId)
    } catch (error) {
      console.error(error)
      setErrorMsg(error.message || 'No se pudieron cargar los quizzes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const courseOptions = useMemo(() => {
    const map = new Map()
    quizzes.forEach(q => {
      if (q.courseId && !map.has(q.courseId)) {
        map.set(q.courseId, q.courseTitle)
      }
    })

    return Array.from(map, ([id, title]) => ({ id, title })).sort((a, b) =>
      a.title.localeCompare(b.title)
    )
  }, [quizzes])

  const filteredModules = useMemo(() => {
    if (courseFilter === 'all') return modules
    return modules.filter(mod => mod.courseId === courseFilter)
  }, [modules, courseFilter])

  const filteredQuizzes = useMemo(() => {
    let result = [...quizzes]

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(q => {
        return (
          q.title.toLowerCase().includes(term) ||
          q.description.toLowerCase().includes(term) ||
          q.courseTitle.toLowerCase().includes(term) ||
          q.moduleTitle.toLowerCase().includes(term) ||
          q.instructorName.toLowerCase().includes(term)
        )
      })
    }

    if (courseFilter !== 'all') {
      result = result.filter(q => q.courseId === courseFilter)
    }

    if (moduleFilter !== 'all') {
      result = result.filter(q => q.moduleId === moduleFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(q => q.review.estado === statusFilter)
    }

    switch (sortBy) {
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'attempts_desc':
        result.sort((a, b) => b.attempts - a.attempts)
        break
      case 'avg_desc':
        result.sort((a, b) => b.avgScore - a.avgScore)
        break
      case 'questions_desc':
        result.sort((a, b) => b.questionsCount - a.questionsCount)
        break
      case 'created_asc':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'created_desc':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    return result
  }, [quizzes, search, courseFilter, moduleFilter, statusFilter, sortBy])

  const stats = useMemo(() => {
    const totalAttempts = quizzes.reduce((acc, curr) => acc + curr.attempts, 0)
    const totalQuestions = quizzes.reduce((acc, curr) => acc + curr.questionsCount, 0)
    const avgGeneral =
      quizzes.length > 0
        ? Math.round(quizzes.reduce((acc, curr) => acc + curr.avgScore, 0) / quizzes.length)
        : 0

    const byStatus = quizzes.reduce(
      (acc, item) => {
        acc[item.review.estado] = (acc[item.review.estado] || 0) + 1
        return acc
      },
      {
        pendiente: 0,
        en_revision: 0,
        aprobado: 0,
        rechazado: 0,
        requiere_cambios: 0,
      }
    )

    return {
      totalQuizzes: quizzes.length,
      totalAttempts,
      totalQuestions,
      avgGeneral,
      pending: byStatus.pendiente || 0,
      approved: byStatus.aprobado || 0,
      rejected: byStatus.rechazado || 0,
      changes: byStatus.requiere_cambios || 0,
      reviewing: byStatus.en_revision || 0,
    }
  }, [quizzes])

  const mostPopular = useMemo(() => {
    if (!quizzes.length) return null
    return quizzes.reduce((a, b) => (a.attempts > b.attempts ? a : b))
  }, [quizzes])

  const bestAvg = useMemo(() => {
    if (!quizzes.length) return null
    return quizzes.reduce((a, b) => (a.avgScore > b.avgScore ? a : b))
  }, [quizzes])

  const openReviewDrawer = quiz => {
    setSelectedQuiz(quiz)
    setIsDrawerOpen(true)
    setIsEditOpen(false)
    setErrorMsg('')
  }

  const closeReviewDrawer = () => {
    setSelectedQuiz(null)
    setIsDrawerOpen(false)
    setErrorMsg('')
  }

  const openEditModal = quiz => {
    setSelectedQuiz(quiz)
    setForm({
      titulo: quiz.title || '',
      descripcion: quiz.description === 'Sin descripción' ? '' : quiz.description,
      modulo_id: quiz.moduleId || '',
    })
    setIsEditOpen(true)
    setErrorMsg('')
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
    setForm(initialForm)
    setErrorMsg('')
  }

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateEditForm = () => {
    if (!form.titulo.trim()) return 'El título del quiz es obligatorio.'
    if (!form.modulo_id) return 'Debes seleccionar un módulo.'
    return ''
  }

  const handleSaveQuizBasicInfo = async e => {
    e.preventDefault()

    const validationError = validateEditForm()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    if (!selectedQuiz?.id) return

    setSaving(true)
    setErrorMsg('')

    try {
      await updateQuizBasicInfo(selectedQuiz.id, {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        modulo_id: form.modulo_id,
      })

      await createActivityLog({
        usuarioId: authUserId,
        accion: 'editar_quiz',
        tablaAfectada: 'quiz',
        descripcion: `Se editó el quiz ${selectedQuiz.title}`,
      })

      await loadAll()
      closeEditModal()
    } catch (error) {
      console.error(error)
      setErrorMsg(error.message || 'Ocurrió un error al actualizar el quiz.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteQuiz = async quiz => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el quiz "${quiz.title}"?\n\nTambién se eliminarán sus relaciones por las reglas ON DELETE CASCADE.`
    )

    if (!confirmed) return

    setDeletingId(quiz.id)

    try {
      await deleteQuizById(quiz.id)

      await createActivityLog({
        usuarioId: authUserId,
        accion: 'eliminar_quiz',
        tablaAfectada: 'quiz',
        descripcion: `Se eliminó el quiz ${quiz.title}`,
      })

      if (selectedQuiz?.id === quiz.id) {
        closeReviewDrawer()
        closeEditModal()
      }

      await loadAll()
    } catch (error) {
      console.error(error)
      alert(error.message || 'No se pudo eliminar el quiz.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpdateQuizReview = async values => {
    if (!selectedQuiz?.id) return

    setSaving(true)
    setErrorMsg('')

    try {
      await upsertQuizReview({
        quizId: selectedQuiz.id,
        adminId: adminProfileId,
        ...values,
      })

      await createActivityLog({
        usuarioId: authUserId,
        accion: 'revisar_quiz',
        tablaAfectada: 'revision_quiz',
        descripcion: `Se actualizó la revisión del quiz ${selectedQuiz.title} con estado ${values.estado}`,
      })

      await loadAll()
      setSelectedQuiz(prev => {
        if (!prev) return prev
        return {
          ...prev,
          review: {
            ...prev.review,
            ...values,
          },
        }
      })
    } catch (error) {
      console.error(error)
      setErrorMsg(error.message || 'No se pudo guardar la revisión del quiz.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateQuestionReview = async ({ preguntaId, estado, comentario, checklist }) => {
    if (!selectedQuiz?.id) return

    setSaving(true)
    setErrorMsg('')

    try {
      await upsertQuestionReview({
        quizId: selectedQuiz.id,
        preguntaId,
        estado,
        comentario,
        checklist,
      })

      await createActivityLog({
        usuarioId: authUserId,
        accion: 'revisar_pregunta_quiz',
        tablaAfectada: 'revision_pregunta',
        descripcion: `Se revisó una pregunta del quiz ${selectedQuiz.title}`,
      })

      await loadAll()
    } catch (error) {
      console.error(error)
      setErrorMsg(error.message || 'No se pudo guardar la revisión de la pregunta.')
    } finally {
      setSaving(false)
    }
  }

  return {
    quizzes,
    modules,
    loading,
    saving,
    deletingId,
    search,
    setSearch,
    courseFilter,
    setCourseFilter,
    moduleFilter,
    setModuleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredModules,
    filteredQuizzes,
    stats,
    mostPopular,
    bestAvg,
    selectedQuiz,
    isDrawerOpen,
    isEditOpen,
    form,
    errorMsg,
    courseOptions,
    loadAll,
    openReviewDrawer,
    closeReviewDrawer,
    openEditModal,
    closeEditModal,
    handleFormChange,
    handleSaveQuizBasicInfo,
    handleDeleteQuiz,
    handleUpdateQuizReview,
    handleUpdateQuestionReview,
  }
}
