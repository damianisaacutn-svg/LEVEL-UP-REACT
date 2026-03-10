import UserRow from './UserRow'

export default function UserTable({ users, onEdit, onRole, onToggle }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4">Nombre</th>
            <th className="p-4">Rol</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Registrado</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onRole={onRole}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
