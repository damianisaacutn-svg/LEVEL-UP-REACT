import { useState } from 'react'

export default function EditUserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.nombre)

  function handleSubmit(e) {
    e.preventDefault()

    onSave(user.id, name)

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Editar Usuario</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full border p-2 rounded mb-4"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>

            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
