import { useMemo, useState } from 'react'
import ActivityItem from './ActivityItem'

const ITEMS_PER_PAGE = 3

export default function ActivityList({ logs }) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(logs.length / ITEMS_PER_PAGE))

  const currentItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return logs.slice(start, end)
  }, [logs, page])

  const handlePrev = () => {
    setPage(prev => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setPage(prev => Math.min(totalPages, prev + 1))
  }

  if (!logs.length) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#D1D5DB] bg-[#FAFAFA] px-4 py-8 text-center">
        <p className="text-[14px] font-medium text-[#374151]">No hay eventos para mostrar</p>
        <p className="mt-1 text-[12px] text-[#6B7280]">
          Cuando el sistema registre actividad, aparecerá aquí.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {currentItems.map(log => (
        <ActivityItem key={log.id} log={log} />
      ))}

      <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-3 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px] text-[#6B7280]">Mostrando {logs.length} eventos recientes</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1}
            className="rounded-[8px] bg-[#F3F4F6] px-4 py-2 text-[14px] font-medium text-[#4B5563] transition hover:bg-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={page === totalPages}
            className="rounded-[8px] bg-[#FF2D55] px-4 py-2 text-[14px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
