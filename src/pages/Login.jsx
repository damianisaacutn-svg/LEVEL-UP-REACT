import AuthNavbar from '../components/layout/AuthNavbar'
import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from '../config/supabaseClient'

import SuccessModal from '../components/ui/modals/SuccessModal'
import ErrorModal from '../components/ui/modals/ErrorModal'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(location?.state?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorText, setErrorText] = useState('')

  const [userRole, setUserRole] = useState(null)

  const handleLogin = async e => {
    e.preventDefault()

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorText('Email o contraseña incorrectos.')
      setErrorOpen(true)
      setLoading(false)
      return
    }

    const user = data.user

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('rol_id, estado')
      .eq('auth_user_id', user.id)
      .single()

    if (!usuario) {
      setErrorText('No se encontró el usuario en el sistema.')
      setErrorOpen(true)
      setLoading(false)
      return
    }

    if (usuario.estado !== 'activo') {
      await supabase.auth.signOut()

      setErrorText('Tu cuenta está suspendida. Contacta al administrador.')
      setErrorOpen(true)
      setLoading(false)
      return
    }

    setUserRole(usuario.rol_id)

    setSuccessOpen(true)

    setLoading(false)
  }

  const goToDashboard = () => {
    if (userRole === 1) navigate('/admin')

    if (userRole === 2) navigate('/instructor/dashboard')

    if (userRole === 3) navigate('/estudiante/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <AuthNavbar />

      <div className="flex justify-center items-center mt-20 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-2">Bienvenido a Level Up 🚀</h2>

          <p className="text-center text-gray-500 mb-6">Inicia sesión para continuar aprendiendo</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF2D55]"
              required
            />

            {/* PASSWORD */}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-[#FF2D55]"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              disabled={loading}
              className="bg-[#f06292] text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?
            <Link to="/register" className="text-[#f06292] font-semibold ml-1">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>

      {/* SUCCESS MODAL */}

      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Bienvenido a Level Up"
        message="Has iniciado sesión correctamente."
        buttonText="Ir al Dashboard"
        onConfirm={goToDashboard}
      />

      {/* ERROR MODAL */}

      <ErrorModal isOpen={errorOpen} onClose={() => setErrorOpen(false)} message={errorText} />
    </div>
  )
}
