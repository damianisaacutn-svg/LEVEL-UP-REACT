import Modal from './Modal'

export default function ConfirmModal({ isOpen, onClose, title, message, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} message={message} icon="❓">
      <button onClick={onClose} className="border border-gray-300 px-5 py-2 rounded-xl">
        Cancelar
      </button>

      <button onClick={onConfirm} className="bg-[#f06292] text-white px-5 py-2 rounded-xl">
        Confirmar
      </button>
    </Modal>
  )
}
