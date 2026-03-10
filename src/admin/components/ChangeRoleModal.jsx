import { useState } from 'react'

export default function ChangeRoleModal({ user, onClose, onSave }) {
  const [role, setRole] = useState(user.rol_id)

  function handleSubmit(e) {
    e.preventDefault()

    if (role === 1) return

    onSave(user.id, role)

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Cambiar Rol</h2>

        <select
          value={role}
          onChange={e => setRole(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        >
          <option value={2}>Instructor</option>
          <option value={3}>Estudiante</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>

          <button onClick={handleSubmit} className="px-4 py-2 bg-pink-500 text-white rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
