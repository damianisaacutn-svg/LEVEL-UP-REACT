import React from 'react'
import '../../styles/home.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Sube de nivel tu conocimiento</h1>

        <p>
          Aprende de expertos en tecnología y videojuegos con tutoriales interactivos y sistema de
          rachas.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Explorar Cursos</button>
          <button className="btn-secondary">Saber más</button>
        </div>
      </div>
    </section>
  )
}

export default Hero
