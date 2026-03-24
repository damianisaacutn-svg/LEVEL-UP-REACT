import React from 'react'
import { GraduationCap, MonitorPlay } from 'lucide-react'

export function UserTypeSelector({ selected, onChange, error }) {
  const userTypes = [
    {
      value: 'student',
      label: 'Estudiante',
      description: 'Accede a cursos, videos y cuestionarios para aprender y ganar XP.',
      icon: GraduationCap,
    },
    {
      value: 'instructor',
      label: 'Instructor',
      description: 'Publica cursos, sube videos educativos y crea cuestionarios.',
      icon: MonitorPlay,
    },
  ]

  return (
    <div className="w-full">
      <label className="block mb-3 text-[#1A1A1A]">
        Tipo de usuario
        <span className="text-[#FF2D55] ml-1">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userTypes.map(type => {
          const isSelected = selected === type.value
          const Icon = type.icon

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`

                relative p-5 rounded-xl border-2 text-left transition-all duration-200
                hover:shadow-md

                ${
                  isSelected
                    ? 'border-[#FF2D55] bg-[#FF2D55]/5 shadow-lg shadow-[#FF2D55]/10'
                    : 'border-[#EAEAEA] bg-white hover:border-[#8A8A8A]'
                }

              `}
            >
              {/* Selected indicator */}

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#FF2D55] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}

              {/* Icon */}

              <div
                className={`mb-3 transition-colors ${
                  isSelected ? 'text-[#FF2D55]' : 'text-[#8A8A8A]'
                }`}
              >
                <Icon size={32} />
              </div>

              {/* Label */}

              <h3
                className={`font-semibold mb-2 font-['Poppins'] transition-colors ${
                  isSelected ? 'text-[#FF2D55]' : 'text-[#1A1A1A]'
                }`}
              >
                {type.label}
              </h3>

              {/* Description */}

              <p className="text-sm text-[#4A4A4A] leading-relaxed">{type.description}</p>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-2 text-sm text-[#FF2D55] flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-[#FF2D55]"></span>

          {error}
        </p>
      )}
    </div>
  )
}
