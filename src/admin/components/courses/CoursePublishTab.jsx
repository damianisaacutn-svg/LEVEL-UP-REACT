import { useEffect, useState } from 'react'
import { Save, SendHorizonal } from 'lucide-react'
import { getCourseStructureStatus } from '../../utils/courseStatus'
import { saveCourseReview } from '../../services/courseReviewService'
import { ReviewStatusBadge } from './ReviewStatusBadge'

export default function CoursePublishTab({ course, onRefresh }) {
  const structure = getCourseStructureStatus(course)

  const [estadoRevision, setEstadoRevision] = useState(
    course?.review?.estado_revision || 'in_review'
  )
  const [aptoPublicacion, setAptoPublicacion] = useState(!!course?.review?.apto_publicacion)
  const [observacionesGenerales, setObservacionesGenerales] = useState(
    course?.review?.observaciones_generales || ''
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setEstadoRevision(course?.review?.estado_revision || 'in_review')
    setAptoPublicacion(!!course?.review?.apto_publicacion)
    setObservacionesGenerales(course?.review?.observaciones_generales || '')
  }, [course])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveCourseReview({
        courseId: course.id,
        estadoRevision,
        aptoPublicacion,
        observacionesGenerales,
      })

      await onRefresh?.()
    } catch (error) {
      console.error('Error guardando revisión del curso:', error)
      alert(error.message || 'No se pudo guardar la decisión de publicación.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#EAEAEA] bg-white p-6">
          <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4">Resumen de revisión</h4>

          <div className="space-y-3">
            <SummaryRow
              label="Estado actual"
              value={<ReviewStatusBadge status={course.reviewStatus} type="course" />}
            />
            <SummaryRow
              label="Videos revisados"
              value={`${course?.videosReviewedCount || 0} / ${course?.videosCount || 0}`}
            />
            <SummaryRow label="Videos con observaciones" value={course?.videosObservedCount || 0} />
            <SummaryRow label="Videos rechazados" value={course?.videosRejectedCount || 0} />
            <SummaryRow
              label="Estructura mínima"
              value={structure.readyToPublish ? 'Completa' : 'Incompleta'}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
          <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4">Decisión administrativa</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Estado de revisión
              </label>
              <select
                value={estadoRevision}
                onChange={e => setEstadoRevision(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
              >
                <option value="draft">Borrador</option>
                <option value="in_review">En revisión</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Publicación</label>
              <select
                value={aptoPublicacion ? 'yes' : 'no'}
                onChange={e => setAptoPublicacion(e.target.value === 'yes')}
                className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
              >
                <option value="no">No apto para publicar</option>
                <option value="yes">Apto para publicar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Observaciones generales para el instructor
              </label>
              <textarea
                rows={6}
                value={observacionesGenerales}
                onChange={e => setObservacionesGenerales(e.target.value)}
                placeholder="Ej. El curso está bien estructurado pero faltan correcciones en dos videos del módulo 2."
                className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
              />
            </div>

            <div className="rounded-xl border border-[#EAEAEA] bg-white p-4">
              <p className="text-sm font-medium text-[#1A1A1A] mb-2">Recomendación automática</p>
              <p className="text-sm text-[#8A8A8A]">
                {structure.readyToPublish
                  ? 'La estructura del curso permite evaluarlo como publicable.'
                  : 'Antes de publicarlo conviene completar su estructura y revisar el contenido pendiente.'}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-3 rounded-lg bg-[#FF2D55] text-white hover:bg-[#E02849] transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {aptoPublicacion ? (
                  <SendHorizonal className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Guardando...' : 'Guardar decisión'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#EAEAEA] px-4 py-3">
      <span className="text-sm text-[#4A4A4A]">{label}</span>
      <div className="text-sm text-[#1A1A1A] font-medium">{value}</div>
    </div>
  )
}
