import { useState } from 'react'

import AdminSidebar from '../components/AdminSidebar'
import NavbarAdmin from '../components/NavbarAdmin'

import useAdminUsers from '../hooks/useAdminUsers'

import UserTable from '../components/UserTable'
import EditUserModal from '../components/EditUserModal'
import ChangeRoleModal from '../components/ChangeRoleModal'

export default function AdminUsuarios() {
  const { users, loading, changeRole, toggleStatus, updateName } = useAdminUsers()

  const [editUser, setEditUser] = useState(null)
  const [roleUser, setRoleUser] = useState(null)

  return (
    <div className="flex bg-[#F7F7F7] min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavbarAdmin />

        {/* Content */}
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

            <p className="text-gray-500">Administra los usuarios registrados en la plataforma</p>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">Cargando usuarios...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No hay usuarios registrados</div>
            ) : (
              <UserTable
                users={users}
                onEdit={setEditUser}
                onRole={setRoleUser}
                onToggle={user => toggleStatus(user.id, user.estado)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}

      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={updateName} />
      )}

      {roleUser && (
        <ChangeRoleModal user={roleUser} onClose={() => setRoleUser(null)} onSave={changeRole} />
      )}
    </div>
  )
}
