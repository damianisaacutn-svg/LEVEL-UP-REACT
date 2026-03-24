import { useState } from 'react'
import { Sidebar } from '../components/SidebarInstructor'
import { Header } from '../components/HeaderInstructor'

export function MyCourses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const courses = []

  const filteredCourses = courses.filter(course => {
    const title = course.title?.toLowerCase() || ''
    const description = course.description?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()

    const matchesSearch = title.includes(query) || description.includes(query)
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <Header />
      <main className="lg:ml-64 min-h-screen pt-20">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h1
                  className="text-2xl sm:text-3xl font-bold leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif', color: '#1A1A1A' }}
                >
                  Mis Cursos
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#8A8A8A]">
                  Administra y organiza todos tus cursos
                </p>
              </div>

              <button className="w-full sm:w-auto bg-[#FF2D55] hover:bg-[#E6154A] text-white px-5 py-3 rounded-xl font-medium transition-colors">
                Crear Curso
              </button>
            </div>

            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-12 border border-[#EAEAEA] rounded-xl px-4 text-sm outline-none focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 xl:w-auto">
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="h-12 w-full sm:w-48 border border-[#EAEAEA] rounded-xl px-4 text-sm bg-white outline-none focus:border-[#FF2D55]"
                  >
                    <option value="all">Todos</option>
                    <option value="publicado">Publicado</option>
                    <option value="borrador">Borrador</option>
                    <option value="archivado">Archivado</option>
                  </select>

                  <div className="flex w-full sm:w-auto rounded-xl border border-[#EAEAEA] p-1 bg-[#F8F8F8]">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'grid' ? 'bg-[#FF2D55] text-white shadow-sm' : 'text-[#1A1A1A]'
                      }`}
                    >
                      Grid
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'list' ? 'bg-[#FF2D55] text-white shadow-sm' : 'text-[#1A1A1A]'
                      }`}
                    >
                      Lista
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {filteredCourses.length === 0 && (
              <div className="border-2 border-dashed border-[#EAEAEA] bg-white rounded-2xl px-6 py-14 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F4F4F4] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#8A8A8A] text-2xl">📚</span>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                  {searchQuery || filterStatus !== 'all'
                    ? 'No se encontraron cursos'
                    : 'Aún no tienes cursos'}
                </h3>

                <p className="text-[#8A8A8A] mb-6 max-w-md mx-auto">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primer curso y comienza a compartir conocimiento'}
                </p>

                {!searchQuery && filterStatus === 'all' && (
                  <button className="bg-[#FF2D55] hover:bg-[#E6154A] text-white px-5 py-3 rounded-xl font-medium transition-colors">
                    Crear Primer Curso
                  </button>
                )}
              </div>
            )}

            {filteredCourses.length > 0 && viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="h-40 bg-gradient-to-br from-[#FF2D55] to-[#7B61FF]" />

                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-[#1A1A1A]">{course.title}</h3>

                      <p className="text-sm text-[#8A8A8A] mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mb-4">
                        <span className="inline-block text-xs bg-[#F3F3F3] text-[#1A1A1A] px-3 py-1 rounded-full">
                          {course.status}
                        </span>
                      </div>

                      <button className="w-full border border-[#EAEAEA] rounded-xl px-4 py-2.5 hover:bg-[#F8F8F8] transition-colors">
                        Gestionar Curso
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredCourses.length > 0 && viewMode === 'list' && (
              <div className="space-y-4">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    className="bg-white border border-[#EAEAEA] rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                      <div className="w-full md:w-28 h-28 rounded-xl bg-gradient-to-br from-[#FF2D55] to-[#7B61FF] flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-[#1A1A1A] mb-1">
                          {course.title}
                        </h3>

                        <p className="text-sm text-[#8A8A8A] mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        <span className="inline-block text-xs bg-[#F3F3F3] text-[#1A1A1A] px-3 py-1 rounded-full">
                          {course.status}
                        </span>
                      </div>

                      <div className="md:flex-shrink-0">
                        <button className="w-full md:w-auto border border-[#EAEAEA] rounded-xl px-4 py-2.5 hover:bg-[#F8F8F8] transition-colors">
                          Gestionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
