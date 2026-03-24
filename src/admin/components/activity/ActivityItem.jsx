import { useState } from 'react'
import { AlertCircle, CheckCircle2, Info, User, XCircle, BookOpen, FileText } from 'lucide-react'
import ActivityDetailsModal from './ActivityDetailsModal'

export default function ActivityItem({ log }) {
  const [open, setOpen] = useState(false)
  const meta = getActivityMeta(log.type)

  return (
    <>
      <div className="flex flex-col gap-5 rounded-[22px] border border-[#E5E7EB] bg-white px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <div
            className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[18px]"
            style={{ backgroundColor: meta.softBg }}
          >
            <meta.icon className="h-7 w-7" style={{ color: meta.color }} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[18px] font-medium text-[#111827]">{log.description}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[#6B7280]">
              <span>{formatDate(log.date)}</span>
              <span>•</span>
              <span>Por: {log.user}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="self-start rounded-full bg-[#F3F4F6] px-5 py-2.5 text-[15px] font-medium text-[#374151] transition hover:bg-[#E5E7EB] md:self-auto"
        >
          Detalles
        </button>
      </div>

      <ActivityDetailsModal open={open} onClose={() => setOpen(false)} log={log} meta={meta} />
    </>
  )
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString))
}

function getActivityMeta(type) {
  switch (type) {
    case 'user_created':
      return {
        icon: User,
        color: '#22C55E',
        softBg: '#EAF8EF',
        label: 'Usuario creado',
      }

    case 'user_deleted':
      return {
        icon: XCircle,
        color: '#EF4444',
        softBg: '#FDEEEE',
        label: 'Usuario eliminado',
      }

    case 'course_created':
      return {
        icon: CheckCircle2,
        color: '#3B82F6',
        softBg: '#EAF2FF',
        label: 'Curso creado',
      }

    case 'course_updated':
      return {
        icon: CheckCircle2,
        color: '#3B82F6',
        softBg: '#EAF2FF',
        label: 'Curso actualizado',
      }

    case 'quiz_created':
      return {
        icon: FileText,
        color: '#8B5CF6',
        softBg: '#F2ECFF',
        label: 'Quiz creado',
      }

    case 'system_error':
      return {
        icon: AlertCircle,
        color: '#F59E0B',
        softBg: '#FFF7E8',
        label: 'Error del sistema',
      }

    default:
      return {
        icon: BookOpen,
        color: '#6B7280',
        softBg: '#F3F4F6',
        label: 'Evento general',
      }
  }
}
