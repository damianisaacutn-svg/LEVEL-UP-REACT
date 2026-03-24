import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Filter } from 'lucide-react'
import { Badge } from '../components/badge'

import { SearchInput } from '../components/SearchInput'
import { UserCell } from '../components/UserCell'
import Actions from '../components/Actions'

export default function Users() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  // 🔥 CAMBIO DE ROL (AQUÍ ESTÁ LA CLAVE)
  const changeRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ tipo_usuario: newRole })
        .eq('id_usuario', userId)

      if (error) throw error

      console.log('✅ Rol actualizado')
      fetchUsers()
    } catch (error) {
      console.error('❌ Error cambiando rol:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // 🔥 1. Obtener IDs de administradores
      const { data: admins, error: adminError } = await supabase
        .from('administrador')
        .select('usuario_id')

      if (adminError) throw adminError

      const adminIds = (admins || []).map(a => a.usuario_id)

      // 🔥 2. Obtener todos los usuarios
      const { data, error } = await supabase.from('usuario').select('*')

      if (error) throw error

      // 🔥 3. Filtrar admins
      const filtered = (data || []).filter(user => !adminIds.includes(user.id_usuario))

      // 🔥 4. Mapear
      const mappedUsers = filtered.map(user => ({
        id: user.id_usuario,
        name: user.nombre ?? 'Sin nombre',
        email: user.email ?? 'Sin correo',
        role: user.tipo_usuario === 'instructor' ? 'instructor' : 'student',
        xp: 0,
        registrationDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
        status: user.estado ?? 'activo',
      }))

      setUsers(mappedUsers)
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    user =>
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = role => {
    const styles = {
      instructor: 'bg-[#7B61FF] text-white',
      student: 'bg-[#FF2D55] text-white',
    }

    const labels = {
      instructor: 'Instructor',
      student: 'Estudiante',
    }

    return <Badge className={styles[role]}>{labels[role]}</Badge>
  }

  const getStatusBadge = status => {
    const isActive = status === 'activo'

    return (
      <Badge
        variant="outline"
        className={
          isActive
            ? 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20'
            : 'bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/20'
        }
      >
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  }

  if (loading) {
    return <p className="text-center mt-10">Cargando usuarios...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Gestión de Usuarios</h1>
        <p className="text-base text-[#8A8A8A]">Administra todos los usuarios de la plataforma</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-[#EAEAEA]">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />

          <button className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F5] rounded-lg text-sm font-medium text-[#4A4A4A] hover:bg-[#EAEAEA]">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#EAEAEA]">
              <tr>
                {['Nombre', 'Correo', 'Rol', 'Registro', 'Estado', 'XP', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-medium text-[#4A4A4A]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAEAEA]">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#F8F9FA]">
                  <td className="px-6 py-4">
                    <UserCell name={user.name} />
                  </td>

                  <td className="px-6 py-4 text-sm text-[#4A4A4A]">{user.email}</td>

                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                  <td className="px-6 py-4 text-sm text-[#4A4A4A]">{user.registrationDate}</td>

                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>

                  <td className="px-6 py-4 text-sm font-medium text-[#FF2D55]">
                    {user.xp.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <Actions
                      user={user}
                      onUpdated={fetchUsers}
                      onChangeRole={changeRole} // 🔥 AQUÍ SE PASA
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#EAEAEA] flex items-center justify-between">
          <p className="text-sm text-[#8A8A8A]">Mostrando {filteredUsers.length} usuarios</p>

          <div className="flex gap-2">
            <PaginationButton>Anterior</PaginationButton>
            <PaginationButton active>Siguiente</PaginationButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaginationButton({ children, active }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        active ? 'bg-[#FF2D55] text-white' : 'bg-[#F5F5F5] text-[#4A4A4A]'
      }`}
    >
      {children}
    </button>
  )
}
