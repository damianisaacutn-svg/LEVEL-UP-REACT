import Modal from './Modal'

export default function SuccessModal({ isOpen, onClose, title, message, buttonText, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} message={message} icon="🎉">
      <button
        onClick={onConfirm}
        className="bg-[#f06292] text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90"
      >
        {buttonText}
      </button>
    </Modal>
  )
}
