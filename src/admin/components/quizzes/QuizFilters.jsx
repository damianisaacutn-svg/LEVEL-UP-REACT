import { Filter, Search } from 'lucide-react'

export default function QuizFilters({
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
  courseOptions,
  filteredModules,
}) {
  return (
    <div className="bg-white rounded-xl border border-[#EAEAEA] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-[#8A8A8A]" />
        <span className="text-sm font-medium text-[#4A4A4A]">Filtros de moderación</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por quiz, curso, módulo o instructor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          />
        </div>

        <div className="lg:col-span-2">
          <select
            value={courseFilter}
            onChange={e => {
              setCourseFilter(e.target.value)
              setModuleFilter('all')
            }}
            className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          >
            <option value="all">Todos los cursos</option>
            {courseOptions.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={moduleFilter}
            onChange={e => setModuleFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          >
            <option value="all">Todos los módulos</option>
            {filteredModules.map(mod => (
              <option key={mod.id} value={mod.id}>
                {mod.courseTitle} · {mod.order}. {mod.title}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En revisión</option>
            <option value="aprobado">Aprobado</option>
            <option value="requiere_cambios">Requiere cambios</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
          >
            <option value="created_desc">Más recientes</option>
            <option value="created_asc">Más antiguos</option>
            <option value="title_asc">Título A-Z</option>
            <option value="attempts_desc">Más intentos</option>
            <option value="avg_desc">Mejor promedio</option>
            <option value="questions_desc">Más preguntas</option>
          </select>
        </div>
      </div>
    </div>
  )
}
