import { useState } from 'react'
import { Edit, Ban, Trash2, UserCheck } from 'lucide-react'
import EditUserModal from './EditUserModal'
import ConfirmModal from './ConfirmModal'
import { supabase } from '../../lib/supabaseClient'

export default function Actions({ user, onUpdated, onChangeRole }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔥 estados para los 3 modales
  const [confirm1, setConfirm1] = useState(false)
  const [confirm2, setConfirm2] = useState(false)
  const [confirm3, setConfirm3] = useState(false)

  // 🔥 detectar id correcto automáticamente
  const userId = user.id_usuario || user.id

  // 🔥 TOGGLE ROLE (CLAVE)
  const handleRoleToggle = async () => {
    try {
      const newRole = user.role === 'instructor' ? 'student' : 'instructor'

      await onChangeRole(userId, newRole)

      onUpdated()
    } catch (error) {
      console.error('❌ Error cambiando rol:', error)
    }
  }

  const handleBan = async () => {
    try {
      setLoading(true)

      const newStatus = user.status === 'activo' ? 'inactivo' : 'activo'

      const { error } = await supabase
        .from('usuario')
        .update({ estado: newStatus })
        .eq('id_usuario', userId)

      if (error) throw error

      onUpdated()
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 DELETE SOLO EN TABLA usuario
  const deleteUser = async () => {
    try {
      setLoading(true)

      console.log('🧠 Eliminando usuario de tabla:', userId)

      const { error } = await supabase.from('usuario').delete().eq('id_usuario', userId)

      if (error) throw error

      setConfirm3(false)
      onUpdated()
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* EDIT */}
        <button onClick={() => setOpenEdit(true)} className="p-2 rounded-lg bg-[#FFF5F7]">
          <Edit className="w-4 h-4 text-[#3A86FF]" />
        </button>

        {/* BAN */}
        <button onClick={handleBan} disabled={loading} className="p-2 rounded-lg bg-[#FFF9E6]">
          <Ban className="w-4 h-4 text-[#F39C12]" />
        </button>

        {/* 🔥 NUEVO BOTÓN CAMBIO DE ROL */}
        <button
          onClick={handleRoleToggle}
          className="p-2 rounded-lg bg-[#EEF2FF]"
          title="Cambiar rol"
        >
          <UserCheck className="w-4 h-4 text-[#7B61FF]" />
        </button>

        {/* 🔥 BOTÓN TRASH */}
        <button onClick={() => setConfirm1(true)} className="p-2 rounded-lg bg-[#FEF2F2]">
          <Trash2 className="w-4 h-4 text-[#E74C3C]" />
        </button>
      </div>

      {/* EDIT */}
      <EditUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={user}
        onUpdated={onUpdated}
      />

      {/* MODAL 1 */}
      <ConfirmModal
        open={confirm1}
        onClose={() => setConfirm1(false)}
        onConfirm={() => {
          setConfirm1(false)
          setConfirm2(true)
        }}
        title="Eliminar usuario"
        message="¿Seguro que deseas eliminar este usuario?"
      />

      {/* MODAL 2 */}
      <ConfirmModal
        open={confirm2}
        onClose={() => setConfirm2(false)}
        onConfirm={() => {
          setConfirm2(false)
          setConfirm3(true)
        }}
        title="Acción irreversible"
        message="Esta acción no se puede deshacer"
      />

      {/* MODAL 3 */}
      <ConfirmModal
        open={confirm3}
        onClose={() => setConfirm3(false)}
        onConfirm={deleteUser}
        title="Confirmación final"
        message="El usuario será eliminado permanentemente"
      />
    </>
  )
}
