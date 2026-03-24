import React from 'react'
import '../../styles/home.css'

const Features = () => {
  return (
    <section className="features">
      <div className="feature-card">
        <div className="icon">📺</div>
        <h3>Tutoriales Pro</h3>
        <p>Videos de alta calidad creados por expertos de la industria.</p>
      </div>

      <div className="feature-card">
        <div className="icon">🔥</div>
        <h3>Sistema de Rachas</h3>
        <p>No pierdas el ritmo. ¡Mantén tu racha diaria y gana insignias!</p>
      </div>

      <div className="feature-card">
        <div className="icon">🎮</div>
        <h3>Evaluaciones Gamificadas</h3>
        <p>Valida lo aprendido con retos y evaluaciones interactivas.</p>
      </div>
    </section>
  )
}

export default Features
