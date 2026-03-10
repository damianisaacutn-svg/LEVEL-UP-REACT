export default function UserRow({ user, onEdit, onRole, onToggle }) {
  const roleName = {
    1: 'Admin',
    2: 'Instructor',
    3: 'Estudiante',
  }

  const isAdmin = user.rol_id === 1

  return (
    <tr className="border-b">
      <td className="p-4">{user.nombre}</td>

      <td className="p-4">{roleName[user.rol_id]}</td>

      <td className="p-4">
        <span
          className={`px-2 py-1 rounded text-xs ${
            user.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {user.estado}
        </span>
      </td>

      <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>

      <td className="p-4 flex gap-2">
        {isAdmin ? (
          <span className="text-gray-400 text-sm italic">Protegido</span>
        ) : (
          <>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => onEdit(user)}
            >
              Editar
            </button>

            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded"
              onClick={() => onRole(user)}
            >
              Cambiar Rol
            </button>

            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => onToggle(user)}
            >
              {user.estado === 'activo' ? 'Suspender' : 'Activar'}
            </button>
          </>
        )}
      </td>
    </tr>
  )
}
