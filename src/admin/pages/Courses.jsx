import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  RefreshCw,
  Filter,
  BookOpen,
  Video,
  ClipboardList,
  Layers3,
  TrendingUp,
} from 'lucide-react'
import CourseDetailsModal from '../components/courses/CourseDetailsModal'
import CourseCard from '../components/courses/CourseCard'
import {
  fetchCoursesService,
  fetchInstructorsService,
  updateCourseService,
  deleteCourseService,
} from '../services/coursesService'

const initialForm = {
  titulo: '',
  descripcion: '',
  duracion: '',
  instructor_id: '',
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [search, setSearch] = useState('')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [publicationFilter, setPublicationFilter] = useState('all')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated_desc')

  const [openModal, setOpenModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      const [coursesData, instructorsData] = await Promise.all([
        fetchCoursesService(),
        fetchInstructorsService(),
      ])

      setCourses(coursesData)
      setInstructors(instructorsData)

      if (selectedCourse?.id) {
        const freshSelected = coursesData.find(course => course.id === selectedCourse.id)
        if (freshSelected) {
          setSelectedCourse(freshSelected)
        }
      }
    } catch (error) {
      console.error('Error cargando cursos:', error)
      setErrorMsg(error.message || 'No se pudieron cargar los cursos.')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = useMemo(() => {
    let result = [...courses]

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(course => {
        return (
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          course.instructor.name.toLowerCase().includes(term)
        )
      })
    }

    if (reviewFilter !== 'all') {
      result = result.filter(course => course.reviewStatus === reviewFilter)
    }

    if (publicationFilter !== 'all') {
      result = result.filter(course => {
        if (publicationFilter === 'ready') return !!course.review?.apto_publicacion
        if (publicationFilter === 'not_ready') return !course.review?.apto_publicacion
        return true
      })
    }

    if (instructorFilter !== 'all') {
      result = result.filter(course => course.instructorId === instructorFilter)
    }

    switch (sortBy) {
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'videos_desc':
        result.sort((a, b) => b.videosCount - a.videosCount)
        break
      case 'progress_desc':
        result.sort((a, b) => b.averageProgress - a.averageProgress)
        break
      case 'updated_asc':
        result.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        break
      case 'updated_desc':
      default:
        result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        break
    }

    return result
  }, [courses, search, reviewFilter, publicationFilter, instructorFilter, sortBy])

  const stats = useMemo(() => {
    const published = courses.filter(course => !!course.review?.apto_publicacion).length
    const drafts = courses.filter(course => !course.review?.apto_publicacion).length
    const enrollments = courses.reduce((acc, course) => acc + (course.enrollmentsCount || 0), 0)
    const modules = courses.reduce((acc, course) => acc + (course.modulesCount || 0), 0)
    const videos = courses.reduce((acc, course) => acc + (course.videosCount || 0), 0)
    const quizzes = courses.reduce((acc, course) => acc + (course.quizzesCount || 0), 0)

    return {
      published,
      drafts,
      enrollments,
      modules,
      videos,
      quizzes,
    }
  }, [courses])

  const openReviewModal = course => {
    setSelectedCourse(course)
    setForm({
      titulo: course.title || '',
      descripcion: course.description === 'Sin descripción' ? '' : course.description,
      duracion: course.duration || '',
      instructor_id: course.instructorId || '',
    })
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setSelectedCourse(null)
    setErrorMsg('')
    setForm(initialForm)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!form.titulo.trim()) return 'El título es obligatorio.'
    if (!form.instructor_id) return 'Debes seleccionar un instructor.'
    if (form.duracion !== '' && Number(form.duracion) < 0) {
      return 'La duración no puede ser negativa.'
    }
    return ''
  }

  const handleSaveCourse = async e => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    if (!selectedCourse?.id) return

    setSaving(true)
    setErrorMsg('')

    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      duracion: form.duracion === '' ? null : Number(form.duracion),
      instructor_id: form.instructor_id,
    }

    try {
      await updateCourseService(selectedCourse.id, payload)
      await loadAll()
    } catch (error) {
      console.error('Error actualizando curso:', error)
      setErrorMsg(error.message || 'No se pudo actualizar el curso.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCourse = async course => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el curso "${course.title}"?\n\nEsto eliminará módulos, videos, quizzes, inscripciones y progreso relacionados.`
    )

    if (!confirmed) return

    setDeletingId(course.id)

    try {
      await deleteCourseService(course.id)

      if (selectedCourse?.id === course.id) {
        closeModal()
      }

      await loadAll()
    } catch (error) {
      console.error('Error eliminando curso:', error)
      alert(error.message || 'No se pudo eliminar el curso.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#8A8A8A]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando cursos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Gestión de Cursos</h1>
          <p className="text-base text-[#8A8A8A]">
            Revisa cursos, valida videos y controla qué contenido puede publicarse.
          </p>
        </div>

        <button
          onClick={loadAll}
          className="w-fit px-4 py-3 border border-[#EAEAEA] bg-white rounded-xl text-sm font-medium text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Recargar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatBox label="Cursos publicados" value={stats.published} color="#2ECC71" />
        <StatBox label="En borrador" value={stats.drafts} color="#F39C12" />
        <StatBox label="Total inscripciones" value={stats.enrollments} color="#FF2D55" />
        <StatBox label="Módulos" value={stats.modules} color="#7B61FF" />
        <StatBox label="Videos" value={stats.videos} color="#3A86FF" />
        <StatBox label="Quizzes" value={stats.quizzes} color="#FF6B8A" />
      </div>

      <div className="bg-white rounded-[24px] border border-[#EAEAEA] p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cursos, descripción o instructor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
            />
          </div>

          <div className="lg:col-span-2">
            <select
              value={reviewFilter}
              onChange={e => setReviewFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
            >
              <option value="all">Todos revisión</option>
              <option value="draft">Borrador</option>
              <option value="in_review">En revisión</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={publicationFilter}
              onChange={e => setPublicationFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
            >
              <option value="all">Todos publicación</option>
              <option value="ready">Aptos para publicar</option>
              <option value="not_ready">No aptos</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={instructorFilter}
              onChange={e => setInstructorFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
            >
              <option value="all">Todos instructores</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
            >
              <option value="updated_desc">Más recientes</option>
              <option value="updated_asc">Más antiguos</option>
              <option value="title_asc">Título A-Z</option>
              <option value="title_desc">Título Z-A</option>
              <option value="videos_desc">Más videos</option>
              <option value="progress_desc">Mayor progreso</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#EAEAEA] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8A8A8A]" />
            <span className="text-sm text-[#4A4A4A]">
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado
              {filteredCourses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {errorMsg ? (
          <div className="px-6 pt-4">
            <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
              {errorMsg}
            </div>
          </div>
        ) : null}

        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              No hay cursos para mostrar
            </h3>
            <p className="text-sm text-[#8A8A8A]">
              Intenta cambiar los filtros para revisar otros cursos.
            </p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onReview={openReviewModal}
                onDelete={handleDeleteCourse}
                deleting={deletingId === course.id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <InsightCard
          icon={Layers3}
          title="Módulos por curso"
          subtitle="Ayuda a detectar cursos incompletos."
        />
        <InsightCard
          icon={Video}
          title="Validación de videos"
          subtitle="Permite observar enlaces, audio o contenido incorrecto."
        />
        <InsightCard
          icon={ClipboardList}
          title="Cobertura de quizzes"
          subtitle="Útil para saber si el curso evalúa el aprendizaje."
        />
        <InsightCard
          icon={TrendingUp}
          title="Progreso e inscripciones"
          subtitle="Da contexto antes de aprobar o rechazar contenido."
        />
      </div>

      <CourseDetailsModal
        open={openModal}
        onClose={closeModal}
        course={selectedCourse}
        instructors={instructors}
        onRefresh={loadAll}
        onSubmit={handleSaveCourse}
        form={form}
        onChange={handleChange}
        saving={saving}
        errorMsg={errorMsg}
      />
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-white rounded-[18px] p-4 border border-[#EAEAEA]">
      <p className="text-[14px] text-[#6F6F6F] mb-3 leading-5">{label}</p>
      <p className="text-[36px] leading-none font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}

function InsightCard({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-white rounded-[24px] border border-[#EAEAEA] p-6">
      <div className="w-12 h-12 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-[#4A4A4A]" />
      </div>
      <h3 className="font-semibold text-[#1A1A1A] text-[18px]">{title}</h3>
      <p className="text-sm text-[#8A8A8A] mt-2 leading-6">{subtitle}</p>
    </div>
  )
}
