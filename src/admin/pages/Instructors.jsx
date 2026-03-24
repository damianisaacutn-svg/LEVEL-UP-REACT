import { useEffect, useState } from 'react'
import { Mail, BookOpen, Users, Star } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export default function Instructors() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 🆕 NUEVOS ESTADOS
  const [editedSpecialty, setEditedSpecialty] = useState('')
  const [verificationStatus, setVerificationStatus] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    setLoading(true)

    try {
      const { data: instructorsData, error } = await supabase.from('instructor').select('*')
      if (error) throw error

      const { data: usersData, error: usersError } = await supabase
        .from('usuario')
        .select('id_usuario, nombre, email')
      if (usersError) throw usersError

      const { data: coursesData, error: coursesError } = await supabase
        .from('curso')
        .select('id_curso, instructor_id')
      if (coursesError) throw coursesError

      const formatted = instructorsData.map(inst => {
        const user = usersData.find(u => u.id_usuario === inst.usuario_id)

        const coursesCount = coursesData.filter(c => c.instructor_id === inst.id_instructor).length

        return {
          id: inst.id_instructor,
          name: user?.nombre ?? 'Sin nombre',
          email: user?.email ?? 'Sin email',
          specialty: inst.especialidad ?? 'Instructor Level Up',
          coursesCount,
          studentsCount: 0,
          rating: 0,
          verified: inst.verificado,
        }
      })

      setInstructors(formatted)
    } catch (err) {
      console.error('Error cargando instructores:', err)
    } finally {
      setLoading(false)
    }
  }

  // 📩 CONTACTAR
  const handleContact = instructor => {
    const subject = 'Verificación de Instructor - Level Up'

    const body = `
Hola ${instructor.name},

Te contactamos desde el equipo de administración de Level Up.

Para completar tu proceso de verificación como instructor, por favor envíanos los siguientes documentos:

- Identificación oficial
- CV o perfil profesional
- Certificaciones (si aplica)
- Portafolio o evidencia de experiencia

Una vez recibidos, procederemos con la validación en el sistema.

Saludos,
Administración Level Up
    `

    window.location.href = `mailto:${instructor.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  // ✅ VERIFICAR ORIGINAL (NO LO QUITAMOS)
  const handleVerify = async () => {
    if (!selectedInstructor) return

    await supabase
      .from('instructor')
      .update({ verificado: true })
      .eq('id_instructor', selectedInstructor.id)

    await fetchInstructors()
    setIsModalOpen(false)
  }

  // 🆕 TOGGLE VERIFICACIÓN
  const handleToggleVerification = async () => {
    if (!selectedInstructor) return

    if (verificationStatus) {
      // ❌ DESVERIFICAR + EMAIL
      const subject = 'Desverificación de Instructor - Level Up'

      const body = `
Hola ${selectedInstructor.name},

Te informamos que tu cuenta ha sido desverificada en la plataforma Level Up.

Motivo:
[Especificar motivo aquí]

Si tienes dudas puedes responder a este correo.

Saludos,
Administración Level Up
      `

      window.location.href = `mailto:${selectedInstructor.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`

      await supabase
        .from('instructor')
        .update({ verificado: false })
        .eq('id_instructor', selectedInstructor.id)

      setSuccessModal(true)
    } else {
      // ✅ VERIFICAR
      await supabase
        .from('instructor')
        .update({ verificado: true })
        .eq('id_instructor', selectedInstructor.id)
    }

    await fetchInstructors()
    setIsModalOpen(false)
  }

  // 💾 GUARDAR CAMBIOS
  const handleSaveChanges = async () => {
    if (!selectedInstructor) return

    await supabase
      .from('instructor')
      .update({ especialidad: editedSpecialty })
      .eq('id_instructor', selectedInstructor.id)

    await fetchInstructors()
    setIsModalOpen(false)
  }

  if (loading) {
    return <p className="text-center">Cargando instructores...</p>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2">Instructores</h1>
        <p className="text-[16px] text-[#8A8A8A]">Gestiona los instructores de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#EAEAEA]">
          <p className="text-[14px] text-[#8A8A8A] mb-1">Total de instructores</p>
          <p className="text-[32px] font-bold text-[#1A1A1A]">{instructors.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#EAEAEA]">
          <p className="text-[14px] text-[#8A8A8A] mb-1">Cursos totales</p>
          <p className="text-[32px] font-bold text-[#1A1A1A]">
            {instructors.reduce((acc, curr) => acc + curr.coursesCount, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#EAEAEA]">
          <p className="text-[14px] text-[#8A8A8A] mb-1">Estudiantes alcanzados</p>
          <p className="text-[32px] font-bold text-[#1A1A1A]">
            {instructors.reduce((acc, curr) => acc + curr.studentsCount, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#EAEAEA]">
          <p className="text-[14px] text-[#8A8A8A] mb-1">Rating promedio</p>
          <p className="text-[32px] font-bold text-[#1A1A1A]">
            {instructors.length > 0
              ? (
                  instructors.reduce((acc, curr) => acc + curr.rating, 0) / instructors.length
                ).toFixed(1)
              : 0}
            ★
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map(instructor => (
          <div
            key={instructor.id}
            className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="h-24 bg-gradient-to-br from-[#FF2D55] to-[#FF6B8A] relative" />

            <div className="p-6 -mt-12 relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7B61FF] to-[#3A86FF] rounded-xl flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                <span className="text-white text-[24px] font-bold">
                  {instructor.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </span>
              </div>

              <h3 className="text-[20px] font-bold">{instructor.name}</h3>

              {instructor.verified && (
                <span className="inline-block mb-2 px-3 py-1 text-xs rounded-full bg-[#2ECC71]/10 text-[#2ECC71]">
                  ✔ Instructor verificado
                </span>
              )}

              <p className="text-[#FF2D55] mb-4">{instructor.specialty}</p>

              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-4 h-4 text-[#8A8A8A]" />
                {instructor.email}
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 px-4 py-2 bg-[#FF2D55] text-white rounded-lg"
                  onClick={() => {
                    setSelectedInstructor(instructor)
                    setEditedSpecialty(instructor.specialty)
                    setVerificationStatus(instructor.verified)
                    setIsModalOpen(true)
                  }}
                >
                  Ver perfil
                </button>

                <button
                  className="px-4 py-2 bg-[#F5F5F5] rounded-lg"
                  onClick={() => handleContact(instructor)}
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && selectedInstructor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px]">
            <h2 className="text-[20px] font-bold mb-4">{selectedInstructor.name}</h2>

            <p className="text-[14px] text-[#8A8A8A] mb-2">{selectedInstructor.email}</p>

            {/* ESPECIALIDAD EDITABLE */}
            <label className="text-[14px] text-[#8A8A8A]">Especialidad</label>
            <input
              value={editedSpecialty}
              onChange={e => setEditedSpecialty(e.target.value)}
              className="w-full border border-[#EAEAEA] rounded-lg px-3 py-2 mt-1 mb-4"
            />

            <p className="mb-2">Cursos: {selectedInstructor.coursesCount}</p>

            <p className="mb-4">Estado: {verificationStatus ? 'Verificado' : 'Pendiente'}</p>

            {/* BOTÓN DINÁMICO */}
            <button
              onClick={handleToggleVerification}
              className={`w-full py-2 rounded-lg text-white ${
                verificationStatus ? 'bg-[#E74C3C]' : 'bg-[#2ECC71]'
              }`}
            >
              {verificationStatus ? 'Desverificar Instructor' : 'Verificar Instructor'}
            </button>

            {/* GUARDAR */}
            <button
              onClick={handleSaveChanges}
              className="mt-3 w-full py-2 bg-[#FF2D55] text-white rounded-lg"
            >
              Guardar cambios
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-3 w-full py-2 border border-[#EAEAEA] rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL ÉXITO */}
      {successModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] text-center">
            <h2 className="text-[20px] font-bold mb-2">Proceso completado</h2>
            <p className="text-[#8A8A8A] mb-4">La desverificación fue realizada correctamente</p>

            <button
              onClick={() => setSuccessModal(false)}
              className="w-full py-2 bg-[#FF2D55] text-white rounded-lg"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
