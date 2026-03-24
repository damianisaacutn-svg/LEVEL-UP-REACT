import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField } from './InputField'
import { PrimaryButton } from './PrimaryButton'
import { AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export function LoginForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }

    if (generalError) setGeneralError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setGeneralError('')

    try {
      // 🔐 LOGIN CON SUPABASE
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      const user = data?.user
      if (!user) throw new Error('No se pudo iniciar sesión')

      const userId = user.id

      // 🔥 1. VALIDAR ESTADO DEL USUARIO
      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('estado')
        .eq('id_usuario', userId)
        .maybeSingle()

      if (userError) throw userError

      if (!userData) {
        await supabase.auth.signOut()
        setGeneralError('Usuario no registrado correctamente')
        return
      }

      if (userData.estado === 'inactivo') {
        await supabase.auth.signOut()
        setGeneralError('Tu cuenta ha sido desactivada por el administrador')
        return
      }

      // 🔥 2. VERIFICAR SI ES ADMIN
      const { data: adminData, error: adminError } = await supabase
        .from('administrador')
        .select('id_admin')
        .eq('usuario_id', userId)
        .maybeSingle()

      if (adminError && adminError.code !== 'PGRST116') {
        throw adminError
      }

      if (adminData) {
        navigate('/admin', { replace: true })
        return
      }

      // 🔥 3. VERIFICAR SI ES INSTRUCTOR
      const { data: instructorData, error: instructorError } = await supabase
        .from('instructor')
        .select('id_instructor')
        .eq('usuario_id', userId)
        .maybeSingle()

      if (instructorError && instructorError.code !== 'PGRST116') {
        throw instructorError
      }

      if (instructorData) {
        navigate('/instructor', { replace: true })
        return
      }

      // 🔥 4. ESTUDIANTE
      navigate('/student', { replace: true })
    } catch (error) {
      console.error('Error login:', error)

      if (error.message?.includes('Invalid login credentials')) {
        setGeneralError('Correo o contraseña incorrectos')
      } else if (error.message?.includes('Email not confirmed')) {
        setGeneralError('Debes confirmar tu correo')
      } else {
        setGeneralError('Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 font-['Poppins']">
          ¡Bienvenido de vuelta!
        </h2>

        <p className="text-[#8A8A8A]">Inicia sesión para continuar tu aventura de aprendizaje</p>
      </div>

      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-[#FF2D55] rounded-xl flex items-start gap-3">
          <AlertCircle className="text-[#FF2D55] flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-[#FF2D55]">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <InputField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-[#EAEAEA] text-[#FF2D55] focus:ring-[#FF2D55] focus:ring-2"
            />
            <span className="text-sm text-[#4A4A4A]">Recordarme</span>
          </label>

          <button
            type="button"
            className="text-sm text-[#FF2D55] hover:text-[#FF6B8A] font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <PrimaryButton type="submit" loading={loading} variant="primary">
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </PrimaryButton>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-[#EAEAEA]"></div>
        <span className="text-sm text-[#8A8A8A]">o</span>
        <div className="flex-1 h-px bg-[#EAEAEA]"></div>
      </div>

      <div className="text-center">
        <p className="text-[#4A4A4A]">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-[#FF2D55] hover:text-[#FF6B8A] font-medium transition-colors"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  )
}
