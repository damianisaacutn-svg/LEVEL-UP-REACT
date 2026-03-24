import React, { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, BookOpen, Clock3, User2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { Sidebar } from '../components/SidebarStudent'
import { Header } from '../components/HeaderStudent'

export function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    'Todos',
    'Diseño',
    'Programación',
    'Marketing',
    'Arte',
    'Tecnología',
    'Negocios',
  ]

  useEffect(() => {
    getCurrentUserAndCourses()
  }, [])

  async function getCurrentUserAndCourses() {
    try {
      setLoading(true)
      setError('')

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError

      const userId = user?.id || null

      let enrollmentsMap = {}
      let progressMap = {}

      if (userId) {
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('inscripcion')
          .select('curso_id, estado')
          .eq('usuario_id', userId)

        if (enrollmentsError) throw enrollmentsError

        const { data: progressRows, error: progressError } = await supabase
          .from('progreso')
          .select('curso_id, porcentaje_completado')
          .eq('usuario_id', userId)

        if (progressError) throw progressError

        enrollmentsMap = (enrollments || []).reduce((acc, item) => {
          acc[item.curso_id] = item.estado
          return acc
        }, {})

        progressMap = (progressRows || []).reduce((acc, item) => {
          acc[item.curso_id] = Number(item.porcentaje_completado || 0)
          return acc
        }, {})
      }

      const { data: coursesData, error: coursesError } = await supabase
        .from('curso')
        .select('id_curso, instructor_id, titulo, descripcion, duracion')
        .order('created_at', { ascending: false })

      if (coursesError) throw coursesError

      const instructorIds = [
        ...new Set((coursesData || []).map(course => course.instructor_id).filter(Boolean)),
      ]

      let instructorNameMap = {}

      if (instructorIds.length > 0) {
        const { data: instructorsData, error: instructorsError } = await supabase
          .from('instructor')
          .select('id_instructor, usuario_id')
          .in('id_instructor', instructorIds)

        if (instructorsError) throw instructorsError

        const usuarioIds = [
          ...new Set(
            (instructorsData || []).map(instructor => instructor.usuario_id).filter(Boolean)
          ),
        ]

        const { data: usersData, error: usersError } = await supabase
          .from('usuario')
          .select('id_usuario, nombre, email')
          .in('id_usuario', usuarioIds)

        if (usersError) throw usersError

        const userMap = (usersData || []).reduce((acc, item) => {
          acc[item.id_usuario] = item
          return acc
        }, {})

        instructorNameMap = (instructorsData || []).reduce((acc, instructor) => {
          const relatedUser = userMap[instructor.usuario_id]
          acc[instructor.id_instructor] =
            relatedUser?.nombre || relatedUser?.email || 'Instructor no disponible'
          return acc
        }, {})
      }

      const normalizedCourses = (coursesData || []).map(course => {
        const progress = progressMap[course.id_curso] ?? 0
        const enrollmentStatus = enrollmentsMap[course.id_curso] || null

        let status = 'not-started'
        if (enrollmentStatus === 'completada' || progress >= 100) {
          status = 'completed'
        } else if (enrollmentStatus === 'activa' || progress > 0) {
          status = 'in-progress'
        }

        return {
          id: course.id_curso,
          title: course.titulo || 'Curso sin título',
          description: course.descripcion || 'Sin descripción disponible.',
          duration: course.duracion || 0,
          instructor: instructorNameMap[course.instructor_id] || 'Instructor no disponible',
          category: detectCategory(course.titulo, course.descripcion),
          progress,
          status,
        }
      })

      setCourses(normalizedCourses)
    } catch (err) {
      console.error('Error cargando cursos:', err)
      setError(err.message || 'No se pudieron cargar los cursos.')
    } finally {
      setLoading(false)
    }
  }

  function detectCategory(title = '', description = '') {
    const text = `${title} ${description}`.toLowerCase()

    if (
      text.includes('javascript') ||
      text.includes('react') ||
      text.includes('python') ||
      text.includes('sql') ||
      text.includes('programación') ||
      text.includes('programacion') ||
      text.includes('desarrollo')
    ) {
      return 'Programación'
    }

    if (
      text.includes('diseño') ||
      text.includes('diseno') ||
      text.includes('figma') ||
      text.includes('ui') ||
      text.includes('ux')
    ) {
      return 'Diseño'
    }

    if (text.includes('marketing') || text.includes('redes') || text.includes('branding')) {
      return 'Marketing'
    }

    if (
      text.includes('arte') ||
      text.includes('ilustración') ||
      text.includes('ilustracion') ||
      text.includes('dibujo')
    ) {
      return 'Arte'
    }

    if (
      text.includes('tecnología') ||
      text.includes('tecnologia') ||
      text.includes('software') ||
      text.includes('hardware')
    ) {
      return 'Tecnología'
    }

    if (
      text.includes('negocio') ||
      text.includes('negocios') ||
      text.includes('empresa') ||
      text.includes('emprendimiento')
    ) {
      return 'Negocios'
    }

    return 'Tecnología'
  }

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' ||
        course.category.toLowerCase() === selectedCategory.toLowerCase()

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'En Progreso' && course.status === 'in-progress') ||
        (selectedStatus === 'No Iniciados' && course.status === 'not-started') ||
        (selectedStatus === 'Completados' && course.status === 'completed')

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [courses, searchQuery, selectedCategory, selectedStatus])

  function getStatusLabel(status) {
    if (status === 'in-progress') return 'En progreso'
    if (status === 'completed') return 'Completado'
    return 'No iniciado'
  }

  function getStatusClasses(status) {
    if (status === 'in-progress') {
      return 'bg-[#FFF1F5] text-[#FF2D55] border border-[#FFD3DE]'
    }
    if (status === 'completed') {
      return 'bg-[#EDFDF3] text-[#2ECC71] border border-[#CFF5DC]'
    }
    return 'bg-[#F3F3F5] text-[#8A8A8A] border border-[#EAEAEA]'
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <Sidebar />
      <Header />

      <main className="ml-60 px-6 pb-8 pt-32 md:px-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-family-secondary)' }}
          >
            Explora Cursos
          </h1>
          <p className="text-[#8A8A8A]">Descubre nuevos conocimientos y habilidades</p>
        </div>

        <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
              <input
                type="text"
                placeholder="Buscar cursos, descripción o instructor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F3F3F5] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-[#1A1A1A]"
              />
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-[#EAEAEA] rounded-lg hover:bg-[#F7F7F8] transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#4A4A4A]" />
              <span className="text-sm font-medium text-[#4A4A4A]">Filtros</span>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-[#4A4A4A] mb-2">Categorías</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const active =
                  (category === 'Todos' && selectedCategory === 'all') ||
                  category === selectedCategory

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'Todos' ? 'all' : category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A] text-white'
                        : 'bg-[#EAEAEA] text-[#4A4A4A] hover:bg-[#DCDCDC]'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[#4A4A4A] mb-2">Estado</p>
            <div className="flex flex-wrap gap-2">
              {['all', 'En Progreso', 'No Iniciados', 'Completados'].map(status => {
                const label = status === 'all' ? 'Todos' : status
                const active = selectedStatus === status

                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#EAEAEA] text-[#4A4A4A] hover:bg-[#DCDCDC]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-[#8A8A8A]">
            {loading
              ? 'Cargando cursos...'
              : `${filteredCourses.length} ${
                  filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'
                }`}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#FFD0D0] bg-[#FFF5F5] px-4 py-3 text-[#E74C3C]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div
                key={item}
                className="bg-white rounded-xl border border-[#EAEAEA] p-5 shadow-sm animate-pulse"
              >
                <div className="h-5 w-40 bg-[#EAEAEA] rounded mb-4" />
                <div className="h-4 w-full bg-[#F1F1F1] rounded mb-2" />
                <div className="h-4 w-4/5 bg-[#F1F1F1] rounded mb-4" />
                <div className="h-3 w-24 bg-[#EAEAEA] rounded mb-3" />
                <div className="h-2 w-full bg-[#EAEAEA] rounded" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-[#EAEAEA] p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1F5] text-[#FF2D55]">
                    {course.category}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                      course.status
                    )}`}
                  >
                    {getStatusLabel(course.status)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{course.title}</h3>

                <p className="text-sm text-[#8A8A8A] mb-4 line-clamp-3">{course.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <User2 className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <Clock3 className="w-4 h-4" />
                    <span>{course.duration} min</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <BookOpen className="w-4 h-4" />
                    <span>Progreso: {Math.round(course.progress)}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full h-2 bg-[#EAEAEA] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A]"
                      style={{ width: `${Math.max(0, Math.min(course.progress, 100))}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A] hover:opacity-95 transition-opacity"
                >
                  Ver curso
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[#EAEAEA] mx-auto flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-[#8A8A8A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No se encontraron cursos</h3>
            <p className="text-[#8A8A8A]">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </main>
    </div>
  )
}
