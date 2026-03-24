import { useState, useEffect } from 'react'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import { supabase } from '../../lib/supabaseClient'

export default function EditUserModal({ open, onClose, user, onUpdated }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
  })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  if (!open) return null

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 🔥 VALIDACIÓN CENTRAL
  const validateForm = () => {
    const nombre = form.nombre.trim()
    const email = form.email.trim()

    if (!nombre) return 'El nombre es obligatorio'
    if (!email) return 'El correo es obligatorio'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Correo inválido'

    return null
  }

  const handleSave = () => {
    const error = validateForm()

    if (error) {
      setErrorMsg(error)
      return
    }

    setErrorMsg(null)
    setConfirmOpen(true)
  }

  const confirmUpdate = async () => {
    try {
      setLoading(true)

      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
      }

      const { data, error } = await supabase
        .from('usuario')
        .update(payload)
        .eq('id_usuario', user.id)
        .select()

      if (error) throw error

      if (!data || data.length === 0) {
        throw new Error('No se actualizó el usuario')
      }

      setConfirmOpen(false)
      setShowToast(true)
      onUpdated()
      onClose()

      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      console.error('Error actualizando usuario:', err)
      setErrorMsg(err.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
          <h2 className="text-lg font-bold">Editar usuario</h2>

          {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button onClick={onClose}>Cancelar</button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#FF2D55] text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmUpdate}
      />

      {showToast && <Toast message="Usuario actualizado correctamente 🎯" />}
    </>
  )
}
