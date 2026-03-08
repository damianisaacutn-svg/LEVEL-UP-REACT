import Modal from './Modal'

export default function ErrorModal({
  isOpen,
  onClose,
  title = '¡Ups!',
  message = 'Algo salió mal. Intenta nuevamente.',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} message={message} icon="⚠️">
      <button
        onClick={onClose}
        className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90"
      >
        Entendido
      </button>
    </Modal>
  )
}
