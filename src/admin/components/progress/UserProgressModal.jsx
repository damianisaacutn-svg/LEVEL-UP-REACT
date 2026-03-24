import { Award, BarChart3, BookOpen, Clock3, X } from 'lucide-react'

export default function UserProgressModal({ user, onClose }) {
  if (!user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#EAEAEA] px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">{user.studentName}</h2>
            <p className="mt-1 text-sm text-[#8A8A8A]">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#8A8A8A] transition hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-88px)] space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <InfoCard
              icon={BarChart3}
              label="Progreso promedio"
              value={`${user.averageProgress}%`}
            />
            <InfoCard icon={Award} label="XP total" value={`${user.totalXP} XP`} />
            <InfoCard icon={BookOpen} label="Cursos completados" value={user.completedCourses} />
            <InfoCard icon={Clock3} label="Última actividad" value={user.lastActivity} />
          </div>

          <section className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Cursos del usuario</h3>

            <div className="mt-4 space-y-4">
              {user.courses.length === 0 ? (
                <p className="text-sm text-[#8A8A8A]">Este usuario no tiene cursos registrados.</p>
              ) : (
                user.courses.map(course => (
                  <div key={course.id} className="rounded-xl border border-[#EAEAEA] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{course.course}</p>
                        <p className="text-sm text-[#8A8A8A]">
                          Última actividad: {course.lastActivity}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#1A1A1A]">{course.progress}%</span>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-[#F3E3E8]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF6B8A]"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Intentos de quiz</h3>

              <div className="mt-4 space-y-3">
                {user.quizAttempts.length === 0 ? (
                  <p className="text-sm text-[#8A8A8A]">
                    Este usuario aún no tiene intentos registrados.
                  </p>
                ) : (
                  user.quizAttempts.map((attempt, index) => (
                    <div
                      key={`${attempt.quizTitle}-${index}`}
                      className="rounded-xl bg-[#FAFAFA] p-4"
                    >
                      <p className="font-medium text-[#1A1A1A]">{attempt.quizTitle}</p>
                      <div className="mt-1 flex items-center justify-between text-sm text-[#8A8A8A]">
                        <span>
                          {attempt.fecha
                            ? new Date(attempt.fecha).toLocaleDateString()
                            : 'Sin fecha'}
                        </span>
                        <span className="font-bold text-[#1A1A1A]">{attempt.puntaje}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Movimientos de XP</h3>

              <div className="mt-4 space-y-3">
                {user.xpMovements.length === 0 ? (
                  <p className="text-sm text-[#8A8A8A]">No hay movimientos de XP registrados.</p>
                ) : (
                  user.xpMovements.map((movement, index) => (
                    <div
                      key={`${movement.fecha || 'xp'}-${index}`}
                      className="rounded-xl bg-[#FAFAFA] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#1A1A1A]">{movement.descripcion}</p>
                        <span className="font-bold text-[#FF2D55]">+{movement.puntos} XP</span>
                      </div>

                      <p className="mt-1 text-sm text-[#8A8A8A]">
                        {movement.fecha
                          ? new Date(movement.fecha).toLocaleDateString()
                          : 'Sin fecha'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-[#FCFCFD] p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#F4F4F5] p-3">
          <Icon className="h-5 w-5 text-[#1A1A1A]" />
        </div>
        <div>
          <p className="text-xs text-[#8A8A8A]">{label}</p>
          <p className="mt-1 text-base font-bold text-[#1A1A1A]">{value}</p>
        </div>
      </div>
    </div>
  )
}
