import {
  Layers3,
  Video,
  ClipboardList,
  Users,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'
import { getCourseStructureStatus, getPublicationLabel } from '../../utils/courseStatus'
import { ReviewStatusBadge } from './ReviewStatusBadge'

export default function CourseOverviewTab({ course }) {
  const structure = getCourseStructureStatus(course)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A]">{course?.title}</h3>
              <p className="text-sm text-[#8A8A8A] mt-2">{course?.description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <ReviewStatusBadge status={course?.reviewStatus} type="course" />
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                  course?.review?.apto_publicacion
                    ? 'bg-[#ECFDF3] text-[#2ECC71] border-[#CDEFD9]'
                    : 'bg-[#FEF2F2] text-[#E74C3C] border-[#FECACA]'
                }`}
              >
                {getPublicationLabel(course)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MiniCard icon={Layers3} label="Módulos" value={course?.modulesCount || 0} />
            <MiniCard icon={Video} label="Videos" value={course?.videosCount || 0} />
            <MiniCard icon={ClipboardList} label="Quizzes" value={course?.quizzesCount || 0} />
            <MiniCard icon={Users} label="Inscripciones" value={course?.enrollmentsCount || 0} />
            <MiniCard
              icon={TrendingUp}
              label="Progreso"
              value={`${course?.averageProgress || 0}%`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <InfoRow label="Duración" value={course?.duration ? `${course.duration} min` : 'N/A'} />
            <InfoRow label="Creado" value={formatDate(course?.createdAt)} />
            <InfoRow label="Actualizado" value={formatDate(course?.updatedAt)} />
            <InfoRow
              label="Instructor"
              value={course?.instructor?.name || 'Instructor desconocido'}
            />
          </div>
        </div>

        <div className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-6">
          <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4">Validación rápida</h4>

          <div className="space-y-3">
            <ChecklistItem label="Descripción del curso" ok={structure.checklist.hasDescription} />
            <ChecklistItem label="Tiene módulos" ok={structure.checklist.hasModules} />
            <ChecklistItem label="Tiene videos" ok={structure.checklist.hasVideos} />
            <ChecklistItem label="Tiene quizzes" ok={structure.checklist.hasQuizzes} />
            <ChecklistItem
              label="Instructor verificado"
              ok={structure.checklist.verifiedInstructor}
            />
          </div>

          <div className="mt-6 rounded-xl border border-[#EAEAEA] bg-white p-4">
            <p className="text-sm text-[#4A4A4A] font-medium mb-2">Resultado</p>
            <p className="text-sm text-[#8A8A8A]">
              {structure.readyToPublish
                ? 'El curso cumple la estructura mínima para considerarse publicable.'
                : 'El curso todavía tiene elementos pendientes antes de publicarse.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#EAEAEA] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAEAEA]">
          <h4 className="text-lg font-semibold text-[#1A1A1A]">Estructura del curso</h4>
        </div>

        <div className="p-6">
          {course?.modules?.length ? (
            <div className="space-y-4">
              {[...course.modules]
                .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                .map(module => (
                  <div
                    key={module.id_modulo}
                    className="border border-[#EAEAEA] rounded-xl p-4 bg-[#FCFCFC]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h5 className="font-semibold text-[#1A1A1A]">
                          {module.orden}. {module.titulo}
                        </h5>
                        <p className="text-sm text-[#8A8A8A] mt-1">
                          {module.descripcion || 'Sin descripción'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <SmallPill text={`${module.video?.length || 0} videos`} />
                        <SmallPill text={`${module.quiz?.length || 0} quizzes`} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-[#8A8A8A]">Este curso todavía no tiene módulos.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({ label, ok }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#EAEAEA] bg-white px-4 py-3">
      <span className="text-sm text-[#4A4A4A]">{label}</span>
      <span className="flex items-center gap-2">
        {ok ? (
          <>
            <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-sm text-[#2ECC71] font-medium">Correcto</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-4 h-4 text-[#E74C3C]" />
            <span className="text-sm text-[#E74C3C] font-medium">Pendiente</span>
          </>
        )}
      </span>
    </div>
  )
}

function MiniCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#EAEAEA] bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#8A8A8A]" />
        <span className="text-sm text-[#8A8A8A]">{label}</span>
      </div>
      <p className="text-xl font-bold text-[#1A1A1A]">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="border border-[#EAEAEA] rounded-lg px-4 py-3 bg-white">
      <p className="text-xs uppercase tracking-wide text-[#8A8A8A] mb-1">{label}</p>
      <p className="text-sm text-[#1A1A1A] break-words">{value}</p>
    </div>
  )
}

function SmallPill({ text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#EAEAEA] px-3 py-1.5 text-xs text-[#4A4A4A]">
      <span>{text}</span>
    </div>
  )
}

function formatDate(date) {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'N/A'
  }
}
