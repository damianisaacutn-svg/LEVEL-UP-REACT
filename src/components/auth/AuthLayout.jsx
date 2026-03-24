import React from 'react'
import { Sparkles, Trophy, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#FF2D55] via-[#FF4D73] to-[#7B61FF] p-8 lg:p-16 flex flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Decorative Icons */}
        <div className="absolute top-10 left-10 opacity-20">
          <Star size={48} fill="white" />
        </div>

        <div className="absolute bottom-20 right-10 opacity-20">
          <Trophy size={64} fill="white" />
        </div>

        <div className="absolute top-1/3 right-20 opacity-10">
          <Sparkles size={32} fill="white" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          {/* Logo + Title */}
          <div className="mb-8">
            <Link to="/" className="flex flex-col items-center gap-4">
              {/* Texto */}
              <h1 className="text-6xl font-bold uppercase tracking-widest text-white">Level Up</h1>

              {/* Logo debajo */}
              <img src={logo} alt="Level Up Logo" className="w-28 h-28 object-contain" />

              {/* Decoración */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-1 w-12 bg-white rounded-full"></div>
                <Sparkles size={20} />
                <div className="h-1 w-12 bg-white rounded-full"></div>
              </div>
            </Link>
          </div>

          {/* Mascot Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Motivational Message */}
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-['Poppins']">
            Sube de nivel en tu aprendizaje
          </h2>

          <p className="text-lg lg:text-xl text-white/90 mb-8">
            Aprende, practica y gana puntos de experiencia mientras dominas nuevas habilidades
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm">Cursos</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm">Quizzes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm">XP Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
