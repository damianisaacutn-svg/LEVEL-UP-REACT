import { Database, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react'

export default function BackupStatusCard({
  lastBackup = '2026-03-17 12:30',
  statusText = 'Hace 2 horas',
  onCreateBackup,
  onRestoreBackup,
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#F8F9FA] rounded-lg border border-[#EAEAEA]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F0FFF4] flex items-center justify-center">
              <Database className="w-5 h-5 text-[#2ECC71]" />
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">Estado del respaldo</p>
              <p className="text-[12px] text-[#8A8A8A] mt-1">Último backup registrado</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#EAF8F0] text-[#20A35A] text-[12px] font-medium">
            {statusText}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white border border-[#EAEAEA]">
            <p className="text-[12px] text-[#8A8A8A]">Fecha</p>
            <p className="text-[14px] font-medium text-[#1A1A1A] mt-1">{lastBackup}</p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-[#EAEAEA]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
              <p className="text-[14px] font-medium text-[#1A1A1A]">Integridad estable</p>
            </div>
            <p className="text-[12px] text-[#8A8A8A] mt-1">Respaldo disponible para restauración</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCreateBackup}
          className="w-full px-4 py-3 bg-[#FF2D55] text-white rounded-lg text-[14px] font-medium hover:bg-[#E02849] transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Crear backup ahora
        </button>

        <button
          type="button"
          onClick={onRestoreBackup}
          className="w-full px-4 py-3 bg-[#F5F5F5] text-[#4A4A4A] rounded-lg text-[14px] font-medium hover:bg-[#EAEAEA] transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar respaldo
        </button>
      </div>
    </div>
  )
}
