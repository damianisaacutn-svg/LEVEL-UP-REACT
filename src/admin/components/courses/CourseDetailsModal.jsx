import { useState } from 'react'
import { X, Save } from 'lucide-react'
import CourseOverviewTab from './CourseOverviewTab'
import CourseVideosReviewTab from './CourseVideosReviewTab'
import CoursePublishTab from './CoursePublishTab'

const tabs = [
  { id: 'overview', label: 'Información general' },
  { id: 'videos', label: 'Videos y validación' },
  { id: 'publish', label: 'Publicación' },
  { id: 'edit', label: 'Editar curso' },
]

export default function CourseDetailsModal({
  open,
  onClose,
  course,
  instructors,
  onRefresh,
  onSubmit,
  form,
  onChange,
  saving,
  errorMsg,
}) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!open || !course) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Revisión de curso</h2>
            <p className="text-sm text-[#8A8A8A] mt-1">
              Supervisa contenido, valida videos y define si el curso puede publicarse.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#4A4A4A]" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex flex-wrap gap-2 border-b border-[#EAEAEA] pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF2D55] text-white'
                    : 'bg-[#F5F5F5] text-[#4A4A4A] hover:bg-[#EAEAEA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <CourseOverviewTab course={course} />}
          {activeTab === 'videos' && (
            <CourseVideosReviewTab course={course} onRefresh={onRefresh} />
          )}
          {activeTab === 'publish' && <CoursePublishTab course={course} onRefresh={onRefresh} />}
          {activeTab === 'edit' && (
            <form onSubmit={onSubmit} className="space-y-5">
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
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={onChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="duracion"
                    value={form.duracion}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Instructor
                  </label>
                  <select
                    name="instructor_id"
                    value={form.instructor_id}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                  >
                    <option value="">Selecciona un instructor</option>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} {instructor.verified ? '• Verificado' : '• No verificado'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-lg border border-[#EAEAEA] text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-lg bg-[#FF2D55] text-white hover:bg-[#E02849] transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
