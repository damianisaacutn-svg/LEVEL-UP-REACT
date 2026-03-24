import { Award, ChevronRight, Clock3 } from 'lucide-react'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('')
}

function getStatusStyles(status) {
  switch (status) {
    case 'Completado':
      return 'bg-emerald-50 text-emerald-600'
    case 'Avanzado':
      return 'bg-violet-50 text-violet-600'
    case 'En progreso':
      return 'bg-blue-50 text-blue-600'
    default:
      return 'bg-amber-50 text-amber-600'
  }
}

export default function StudentProgressCard({ user, onViewProfile }) {
  return (
    <article className="rounded-2xl border border-[#EAEAEA] bg-[#FCFCFD] p-5 transition hover:shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FF4D6D] text-base font-bold text-white">
            {getInitials(user.studentName)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-[20px] font-semibold text-[#1A1A1A]">{user.studentName}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(user.status)}`}
              >
                {user.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#8A8A8A]">{user.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {user.courses.slice(0, 2).map(course => (
                <span
                  key={course.id}
                  className="rounded-full border border-[#EAEAEA] bg-white px-3 py-1 text-xs text-[#4A4A4A]"
                >
                  {course.course}
                </span>
              ))}

              {user.courses.length > 2 && (
                <span className="rounded-full border border-[#EAEAEA] bg-white px-3 py-1 text-xs text-[#4A4A4A]">
                  +{user.courses.length - 2} cursos más
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:min-w-[520px]">
          <Metric label="Promedio" value={`${user.averageProgress}%`} />
          <Metric label="Cursos" value={user.courses.length} />
          <Metric label="Completados" value={user.completedCourses} />
          <Metric label="Quiz promedio" value={`${user.averageQuizScore}%`} />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#F1F1F1] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-[#4A4A4A]">Progreso general del usuario</p>
          <p className="text-sm font-bold text-[#1A1A1A]">{user.averageProgress}%</p>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-[#FCE1E7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A] transition-all"
            style={{ width: `${user.averageProgress}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
            <span className="inline-flex items-center gap-2 font-semibold text-[#FF2D55]">
              <Award className="h-4 w-4" />
              {user.totalXP} XP
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              Última actividad: {user.lastActivity}
            </span>
          </div>

          <button
            type="button"
            onClick={onViewProfile}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5F5F5] px-4 py-2 text-sm font-medium text-[#1A1A1A] transition hover:bg-[#EBEBEB]"
          >
            Ver perfil
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-[#EAEAEA] bg-white px-4 py-3">
      <p className="text-xs text-[#8A8A8A]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{value}</p>
    </div>
  )
}
