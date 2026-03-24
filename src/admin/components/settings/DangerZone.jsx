import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function DangerZone({ onReset }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#F5C2C7] shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-[#E74C3C]" />
        </div>

        <div>
          <h3 className="text-[20px] font-bold text-[#1A1A1A]">Zona crítica</h3>
          <p className="text-[14px] text-[#8A8A8A] mt-1">
            Estas acciones pueden afectar la configuración general del sistema.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[#FFF8F8] border border-[#FAD4D8] mb-4">
        <p className="text-[14px] font-medium text-[#1A1A1A]">Restablecer configuraciones</p>
        <p className="text-[12px] text-[#8A8A8A] mt-1">
          Vuelve a los valores predeterminados de la plataforma. Usa esta opción solo si necesitas
          reiniciar los ajustes globales.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-4 py-3 bg-[#FFF1F2] text-[#E74C3C] rounded-lg text-[14px] font-medium hover:bg-[#FFE4E8] transition-colors flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Restablecer configuración
      </button>
    </div>
  )
}
