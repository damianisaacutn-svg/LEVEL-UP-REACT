export default function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[300px] text-center space-y-4">
        {/* 🔥 NO SE ELIMINA, SOLO SE HACE DINÁMICO */}
        <h2 className="font-bold">{title || 'Confirmar cambios'}</h2>

        <p>{message || '¿Seguro que deseas actualizar este usuario?'}</p>

        <div className="flex justify-center gap-2">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onConfirm} className="bg-[#FF2D55] text-white px-4 py-2 rounded">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
