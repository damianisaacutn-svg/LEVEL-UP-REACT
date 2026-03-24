export default function QuizStatusBadge({ status = 'pendiente' }) {
  const styles = {
    pendiente: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
    en_revision: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    aprobado: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
    rechazado: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    requiere_cambios: 'bg-[#FFF1F2] text-[#BE123C] border-[#FDA4AF]',
  }

  const labels = {
    pendiente: 'Pendiente',
    en_revision: 'En revisión',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    requiere_cambios: 'Requiere cambios',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] || styles.pendiente}`}
    >
      {labels[status] || 'Pendiente'}
    </span>
  )
}
