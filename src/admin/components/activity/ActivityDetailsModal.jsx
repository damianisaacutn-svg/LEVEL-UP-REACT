import { X } from 'lucide-react'

export default function ActivityDetailsModal({ open, onClose, log, meta }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-5">
          <h3 className="text-[22px] font-bold text-[#111827]">Detalle del evento</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6B7280] transition hover:bg-[#F3F4F6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px]"
              style={{ backgroundColor: meta.softBg }}
            >
              <meta.icon className="h-6 w-6" style={{ color: meta.color }} />
            </div>

            <div>
              <p className="text-sm font-medium text-[#6B7280]">Tipo</p>
              <p className="text-[18px] font-semibold text-[#111827]">{meta.label}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[18px] bg-[#F9FAFB] p-4">
              <p className="text-sm font-medium text-[#6B7280]">Descripción</p>
              <p className="mt-2 text-[16px] text-[#111827]">{log.description}</p>
            </div>

            <div className="rounded-[18px] bg-[#F9FAFB] p-4">
              <p className="text-sm font-medium text-[#6B7280]">Usuario</p>
              <p className="mt-2 text-[16px] text-[#111827]">{log.user}</p>
            </div>

            <div className="rounded-[18px] bg-[#F9FAFB] p-4">
              <p className="text-sm font-medium text-[#6B7280]">Fecha</p>
              <p className="mt-2 text-[16px] text-[#111827]">{formatDate(log.date)}</p>
            </div>

            <div className="rounded-[18px] bg-[#F9FAFB] p-4">
              <p className="text-sm font-medium text-[#6B7280]">Acción interna</p>
              <p className="mt-2 break-words text-[16px] text-[#111827]">{log.type}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#E5E7EB] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] bg-[#FF2D55] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}
