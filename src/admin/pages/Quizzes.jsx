import { RefreshCw } from 'lucide-react'
import QuizFilters from '../components/quizzes/QuizFilters'
import QuizReviewDrawer from '../components/quizzes/QuizReviewDrawer'
import QuizStats from '../components/quizzes/QuizStats'
import QuizTable from '../components/quizzes/QuizTable'
import { useQuizzesReview } from '../hooks/useQuizzesReview'

export default function Quizzes() {
  const {
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
    selectedQuiz,
    isDrawerOpen,
    isEditOpen,
    form,
    errorMsg,
    courseOptions,
    modules,
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
  } = useQuizzesReview()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#8A8A8A]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando moderación de quizzes...</span>
        </div>
      </div>
    )
  }

  const modulesOptions = selectedQuiz?.courseId
    ? modules.filter(mod => mod.courseId === selectedQuiz.courseId)
    : modules

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">Moderación de Quizzes</h1>
          <p className="text-[16px] text-[#8A8A8A]">
            Revisa contenido, valida preguntas, genera observaciones y decide si un quiz puede
            publicarse
          </p>
        </div>

        <button
          onClick={loadAll}
          className="w-fit px-4 py-3 border border-[#EAEAEA] bg-white rounded-lg text-sm font-medium text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Recargar
        </button>
      </div>

      <QuizStats stats={stats} />

      <QuizFilters
        search={search}
        setSearch={setSearch}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        moduleFilter={moduleFilter}
        setModuleFilter={setModuleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        courseOptions={courseOptions}
        filteredModules={filteredModules}
      />

      {errorMsg && !isDrawerOpen && !isEditOpen ? (
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {errorMsg}
        </div>
      ) : null}

      <QuizTable
        quizzes={filteredQuizzes}
        deletingId={deletingId}
        onView={openReviewDrawer}
        onEdit={openEditModal}
        onDelete={handleDeleteQuiz}
      />

      <QuizReviewDrawer
        open={isDrawerOpen}
        quiz={selectedQuiz}
        onClose={closeReviewDrawer}
        onSaveQuizReview={handleUpdateQuizReview}
        onSaveQuestionReview={handleUpdateQuestionReview}
        saving={saving}
        errorMsg={errorMsg}
      />

      {isEditOpen && selectedQuiz ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#EAEAEA]">
              <h2 className="text-xl font-bold text-[#1A1A1A]">Editar quiz</h2>
              <p className="text-sm text-[#8A8A8A] mt-1">Actualiza la información base del quiz</p>
            </div>

            <form onSubmit={handleSaveQuizBasicInfo} className="p-6 space-y-5">
              {errorMsg ? (
                <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                  {errorMsg}
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleFormChange}
                  placeholder="Ej. Quiz módulo 1"
                  className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe brevemente el quiz..."
                  className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Módulo</label>
                <select
                  name="modulo_id"
                  value={form.modulo_id}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                >
                  <option value="">Selecciona un módulo</option>
                  {modulesOptions.map(mod => (
                    <option key={mod.id} value={mod.id}>
                      {mod.courseTitle} · {mod.order}. {mod.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-3 rounded-lg border border-[#EAEAEA] text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-lg bg-[#FF2D55] text-white hover:bg-[#E02849] transition-colors disabled:opacity-70"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
