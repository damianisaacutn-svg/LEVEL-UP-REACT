import { useEffect, useState } from 'react'
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  updateUserName,
} from '../services/adminService'

export default function useAdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchUsers() {
    try {
      setLoading(true)

      const data = await getAllUsers()

      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function changeRole(userId, roleId) {
    const user = users.find(u => u.id === userId)

    if (user?.rol_id === 1) {
      throw new Error('No se puede modificar un administrador')
    }

    await updateUserRole(userId, roleId)

    await fetchUsers()
  }

  async function toggleStatus(userId, status) {
    const user = users.find(u => u.id === userId)

    if (user?.rol_id === 1) {
      throw new Error('No se puede suspender un administrador')
    }

    await toggleUserStatus(userId, status)

    await fetchUsers()
  }

  async function updateName(userId, name) {
    const user = users.find(u => u.id === userId)

    if (user?.rol_id === 1) {
      throw new Error('No se puede modificar un administrador')
    }

    await updateUserName(userId, name)

    await fetchUsers()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    changeRole,
    toggleStatus,
    updateName,
  }
}
