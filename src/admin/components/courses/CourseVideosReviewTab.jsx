import { useMemo, useState } from 'react'
import { Video, Link as LinkIcon, Save } from 'lucide-react'
import { ReviewStatusBadge } from './ReviewStatusBadge'
import { saveVideoReview } from '../../services/courseReviewService'

export default function CourseVideosReviewTab({ course, onRefresh }) {
  const [videoStates, setVideoStates] = useState(() => buildInitialState(course))
  const [savingId, setSavingId] = useState(null)

  const totalVideos = useMemo(() => {
    return course?.modules?.reduce((acc, mod) => acc + (mod.video?.length || 0), 0) || 0
  }, [course])

  const handleStateChange = (videoId, field, value) => {
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        [field]: value,
      },
    }))
  }

  const handleSave = async video => {
    const current = videoStates[video.id_video]
    setSavingId(video.id_video)

    try {
      await saveVideoReview({
        videoId: video.id_video,
        estado: current.estado,
        observacion: current.observacion,
      })

      await onRefresh?.()
    } catch (error) {
      console.error('Error guardando revisión de video:', error)
      alert(error.message || 'No se pudo guardar la revisión del video.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] p-4">
        <p className="text-sm text-[#4A4A4A]">
          Aquí el administrador puede revisar cada video del curso, marcar si está aprobado, con
          observaciones o rechazado, y dejar comentarios para el instructor.
        </p>
        <p className="text-sm text-[#8A8A8A] mt-2">Total de videos: {totalVideos}</p>
      </div>

      {course?.modules?.length ? (
        <div className="space-y-4">
          {course.modules.map(module => (
            <div
              key={module.id_modulo}
              className="border border-[#EAEAEA] rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 bg-[#FCFCFC] border-b border-[#EAEAEA]">
                <h4 className="font-semibold text-[#1A1A1A]">
                  {module.orden}. {module.titulo}
                </h4>
                <p className="text-sm text-[#8A8A8A] mt-1">
                  {module.descripcion || 'Sin descripción'}
                </p>
              </div>

              <div className="p-5">
                {module.video?.length ? (
                  <div className="space-y-4">
                    {module.video.map(video => {
                      const current = videoStates[video.id_video] || {
                        estado: 'pending',
                        observacion: '',
                      }

                      return (
                        <div
                          key={video.id_video}
                          className="rounded-xl border border-[#EAEAEA] bg-white p-4"
                        >
                          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
                                  <Video className="w-5 h-5 text-[#4A4A4A]" />
                                </div>

                                <div className="flex-1">
                                  <h5 className="font-semibold text-[#1A1A1A]">{video.titulo}</h5>
                                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#8A8A8A]">
                                    <span>
                                      Duración: {video.duracion ? `${video.duracion} min` : 'N/A'}
                                    </span>
                                    <a
                                      href={video.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[#3A86FF] hover:underline"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                      Abrir video
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              <ReviewStatusBadge status={current.estado} type="video" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                                Estado de validación
                              </label>
                              <select
                                value={current.estado}
                                onChange={e =>
                                  handleStateChange(video.id_video, 'estado', e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                              >
                                <option value="pending">Pendiente</option>
                                <option value="approved">Aprobado</option>
                                <option value="observed">Con observaciones</option>
                                <option value="rejected">Rechazado</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                                Observaciones para instructor
                              </label>
                              <textarea
                                rows={4}
                                value={current.observacion}
                                onChange={e =>
                                  handleStateChange(video.id_video, 'observacion', e.target.value)
                                }
                                placeholder="Ej. El audio está saturado, el enlace no abre o el contenido necesita corrección."
                                className="w-full px-4 py-3 rounded-lg border border-[#EAEAEA] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF2D55]/20"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => handleSave(video)}
                              disabled={savingId === video.id_video}
                              className="px-4 py-2.5 rounded-lg bg-[#FF2D55] text-white hover:bg-[#E02849] transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                              <Save className="w-4 h-4" />
                              {savingId === video.id_video ? 'Guardando...' : 'Guardar revisión'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#8A8A8A]">Este módulo no tiene videos.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#EAEAEA] bg-white p-6">
          <p className="text-sm text-[#8A8A8A]">
            Este curso aún no tiene módulos ni videos para revisar.
          </p>
        </div>
      )}
    </div>
  )
}

function buildInitialState(course) {
  const state = {}
  for (const mod of course?.modules || []) {
    for (const video of mod.video || []) {
      state[video.id_video] = {
        estado: video.review?.estado || 'pending',
        observacion: video.review?.observacion || '',
      }
    }
  }
  return state
}
