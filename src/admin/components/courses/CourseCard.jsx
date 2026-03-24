import { BookOpen, Clock3, Layers3, Users, Eye, Pencil, Trash2 } from 'lucide-react'
import { ReviewStatusBadge } from './ReviewStatusBadge'

export default function CourseCard({ course, onReview, onDelete, deleting = false }) {
  const publicationReady = !!course?.review?.apto_publicacion

  return (
    <div className="bg-white rounded-[28px] border border-[#EAEAEA] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="relative h-[200px] bg-gradient-to-br from-[#FF2D55] to-[#FF5F7E] flex items-center justify-center">
        <div className="absolute top-4 left-4">
          <ReviewStatusBadge status={course.reviewStatus} type="course" />
        </div>

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              publicationReady
                ? 'bg-[#ECFDF3] text-[#2ECC71] border-[#CDEFD9]'
                : 'bg-[#FFF7ED] text-[#F39C12] border-[#FDE7C3]'
            }`}
          >
            {publicationReady ? 'Apto para publicar' : 'No apto'}
          </span>
        </div>

        <BookOpen className="w-20 h-20 text-white/40" strokeWidth={1.5} />
      </div>

      <div className="p-7">
        <h3 className="text-[20px] font-bold text-[#1A1A1A] line-clamp-1">{course.title}</h3>

        <p className="text-[#7A7A7A] text-[15px] leading-7 mt-3 line-clamp-2 min-h-[56px]">
          {course.description}
        </p>

        <div className="flex items-center gap-3 mt-5">
          <div className="w-11 h-11 rounded-full bg-[#5B6CFF] text-white flex items-center justify-center text-sm font-semibold uppercase">
            {getInitials(course?.instructor?.name)}
          </div>

          <div>
            <p className="text-[17px] font-medium text-[#243041]">
              {course?.instructor?.name || 'Instructor desconocido'}
            </p>
            <p className="text-sm text-[#8A8A8A]">
              {course?.instructor?.verified ? 'Instructor verificado' : 'Instructor no verificado'}
            </p>
          </div>
        </div>

        <div className="border-t border-[#EAEAEA] mt-6 pt-5">
          <div className="grid grid-cols-3 gap-4 text-[#4A4A4A]">
            <MetricItem icon={Clock3} top={course.duration ? course.duration : 0} bottom="horas" />
            <MetricItem icon={Layers3} top={course.modulesCount || 0} bottom="módulos" />
            <MetricItem icon={Users} top={course.enrollmentsCount || 0} bottom="inscritos" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-3 mt-6">
          <button
            onClick={() => onReview(course)}
            className="h-[52px] rounded-[16px] bg-[#FF2D55] text-white font-semibold text-[18px] hover:bg-[#E02849] transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Ver
          </button>

          <button
            onClick={() => onReview(course)}
            className="w-[52px] h-[52px] rounded-[16px] bg-[#F5F5F5] text-[#4A4A4A] hover:bg-[#EAEAEA] transition-colors flex items-center justify-center"
            title="Editar / revisar curso"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(course)}
            disabled={deleting}
            className="w-[52px] h-[52px] rounded-[16px] bg-[#F5F5F5] text-[#FF5A4F] hover:bg-[#FDECEC] transition-colors flex items-center justify-center disabled:opacity-60"
            title="Eliminar curso"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <SmallTag label={`${course.videosCount || 0} videos`} />
          <SmallTag label={`${course.quizzesCount || 0} quizzes`} />
          <SmallTag label={`${course.averageProgress || 0}% progreso`} />
          <SmallTag label={`${course.videosObservedCount || 0} observados`} />
        </div>
      </div>
    </div>
  )
}

function MetricItem({ icon: Icon, top, bottom }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 mt-1 text-[#8A8A8A]" />
      <div className="leading-tight">
        <p className="text-[22px] font-medium text-[#243041]">{top}</p>
        <p className="text-[14px] text-[#4A4A4A]">{bottom}</p>
      </div>
    </div>
  )
}

function SmallTag({ label }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F6F7FB] text-[#4A4A4A] border border-[#EAEAEA]">
      {label}
    </span>
  )
}

function getInitials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'IN'
  )
}
