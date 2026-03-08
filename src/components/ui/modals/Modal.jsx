import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, message, icon, children }) {
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)

    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL */}
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 animate-scaleIn">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* ICON */}
        {icon && <div className="text-4xl mb-3 text-center">{icon}</div>}

        {/* TITLE */}
        <h2 className="text-xl font-bold text-center mb-2">{title}</h2>

        {/* MESSAGE */}
        <p className="text-gray-500 text-center mb-6">{message}</p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3">{children}</div>
      </div>
    </div>
  )
}
