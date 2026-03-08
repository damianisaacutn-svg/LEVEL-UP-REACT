import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/authService'
import AuthNavbar from '../components/layout/AuthNavbar'

import { validateName, validateEmail, validatePassword } from '../utils/validators'

import SuccessModal from '../components/ui/modals/SuccessModal'
import ErrorModal from '../components/ui/modals/ErrorModal'

export default function Register() {
  const navigate = useNavigate()

  const [rol, setRol] = useState('estudiante')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorText, setErrorText] = useState('')

  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const nombre = formData.get('nombre')
    const email = formData.get('email')
    const password = formData.get('password')

    /* VALIDACIONES */

    if (!validateName(nombre)) {
      setErrorText('El nombre debe tener al menos 3 letras y solo puede contener letras.')
      setErrorOpen(true)
      return
    }

    if (!validateEmail(email)) {
      setErrorText('Ingresa un correo electrónico válido.')
      setErrorOpen(true)
      return
    }

    if (!validatePassword(password)) {
      setErrorText(
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.'
      )
      setErrorOpen(true)
      return
    }

    try {
      setLoading(true)

      const data = {
        nombre,
        email,
        password,
        rol: formData.get('rol'),
        instructorData: {
          experiencia: formData.get('experiencia'),
          portafolio_url: formData.get('portafolio_url'),
          github_url: formData.get('github_url'),
          linkedin_url: formData.get('linkedin_url'),
          certificaciones: formData.get('certificaciones'),
        },
      }

      await registerUser(data)

      setRegisteredEmail(email)

      setSuccessOpen(true)
    } catch (error) {
      setErrorText(error.message || 'No pudimos crear tu cuenta. Intenta nuevamente.')
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => {
    navigate('/login', {
      state: { email: registeredEmail },
    })
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <AuthNavbar />

      <div className="flex justify-center items-center mt-20 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2">Crear cuenta 🚀</h1>

          <p className="text-center text-gray-500 mb-6">Únete a Level Up y comienza a aprender</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="nombre"
              placeholder="Nombre completo"
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF2D55]"
            />

            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF2D55]"
            />

            {/* PASSWORD */}

            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-[#FF2D55]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <select
              name="rol"
              value={rol}
              onChange={e => setRol(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="estudiante">Estudiante</option>
              <option value="instructor">Instructor</option>
            </select>

            {rol === 'instructor' && (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <h3 className="font-semibold mb-3">Información para instructores</h3>

                <textarea
                  name="experiencia"
                  placeholder="Describe tu experiencia"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-2"
                />

                <input
                  name="portafolio_url"
                  placeholder="Portafolio"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-2"
                />

                <input
                  name="github_url"
                  placeholder="GitHub"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-2"
                />

                <input
                  name="linkedin_url"
                  placeholder="LinkedIn"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-2"
                />

                <textarea
                  name="certificaciones"
                  placeholder="Certificaciones"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
            )}

            <button
              disabled={loading}
              className={`bg-[#f06292] text-white py-3 rounded-xl font-semibold hover:opacity-90 ${
                loading && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?
            <Link to="/login" className="text-[#f06292] font-semibold ml-1 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* SUCCESS MODAL */}

      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Cuenta creada"
        message="Tu cuenta fue registrada correctamente."
        buttonText="Iniciar sesión"
        onConfirm={goToLogin}
      />

      {/* ERROR MODAL */}

      <ErrorModal isOpen={errorOpen} onClose={() => setErrorOpen(false)} message={errorText} />
    </div>
  )
}
