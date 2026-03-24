import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField } from './InputField'
import { PrimaryButton } from './PrimaryButton'
import { UserTypeSelector } from './UserTypeSelector'
import { AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export function RegisterForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    userType: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = password => password.length >= 8

  // 🔥 NUEVO: cálculo de fortaleza
  const passwordStrength = () => {
    if (!formData.password) return null
    const strength = formData.password.length

    if (strength < 8) return { label: 'Débil', color: 'bg-[#FF2D55]', width: '33%' }

    if (strength < 12) return { label: 'Media', color: 'bg-[#FF6B8A]', width: '66%' }

    return { label: 'Fuerte', color: 'bg-[#3A86FF]', width: '100%' }
  }

  const strength = passwordStrength()

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    if (generalError) setGeneralError('')
  }

  const handleUserTypeChange = value => {
    setFormData(prev => ({
      ...prev,
      userType: value,
    }))

    if (errors.userType) {
      setErrors(prev => ({ ...prev, userType: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.userType) {
      newErrors.userType = 'Selecciona un tipo de usuario'
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.name,
            tipo_usuario: formData.userType,
          },
        },
      })

      if (error) throw error

      if (!data?.user) {
        throw new Error('No se pudo crear el usuario')
      }

      alert('Cuenta creada correctamente 🎉')
      navigate('/login')
    } catch (error) {
      console.error('Error registro:', error)

      if (error.message?.includes('User already registered')) {
        setGeneralError('Este correo ya está registrado')
      } else if (error.message?.includes('Password')) {
        setGeneralError('La contraseña no cumple los requisitos de seguridad')
      } else {
        setGeneralError('Error al crear la cuenta. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 font-['Poppins']">Crea tu cuenta</h2>

        <p className="text-[#8A8A8A]">Únete a Level Up y comienza a ganar XP aprendiendo</p>
      </div>

      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-[#FF2D55] rounded-xl flex items-start gap-3">
          <AlertCircle className="text-[#FF2D55]" size={20} />
          <p className="text-sm text-[#FF2D55]">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Nombre completo"
          type="text"
          name="name"
          placeholder="Juan Pérez"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <UserTypeSelector
          selected={formData.userType}
          onChange={handleUserTypeChange}
          error={errors.userType}
        />

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

        <div>
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

          {/* 🔥 Barra de fortaleza */}
          {strength && (
            <div className="mt-2">
              <div className="w-full h-2 bg-[#EAEAEA] rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs mt-1 text-[#8A8A8A]">Fortaleza: {strength.label}</p>
            </div>
          )}
        </div>

        <InputField
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        {/* Terms & Conditions */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 mt-1 rounded border-2 border-[#EAEAEA] text-[#FF2D55] focus:ring-[#FF2D55] focus:ring-2"
          />
          <label htmlFor="terms" className="text-sm text-[#4A4A4A] cursor-pointer">
            Acepto los{' '}
            <a href="#" className="text-[#FF2D55] hover:text-[#FF6B8A] font-medium">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-[#FF2D55] hover:text-[#FF6B8A] font-medium">
              política de privacidad
            </a>
          </label>
        </div>

        <PrimaryButton type="submit" loading={loading} variant="primary">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </PrimaryButton>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-[#EAEAEA]" />
        <span className="text-sm text-[#8A8A8A]">o</span>
        <div className="flex-1 h-px bg-[#EAEAEA]" />
      </div>

      <div className="text-center">
        <p className="text-[#4A4A4A]">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#FF2D55] hover:text-[#FF6B8A] font-medium transition-colors"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )
}
