"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CAROUSEL_INTERVAL, BLUR_PLACEHOLDER } from "@/lib/constants"
import styles from "./About.module.css"

const miembrosEquipo = [
  {
    name: "Rafael García",
    image: "/ASSETS/material/barberos/0.webp",
    description:
      "Rafael es un barbero maestro con más de 20 años de experiencia en la industria. Su pericia y atención al detalle lo convierten en una pieza clave de nuestro equipo.",
  },
  {
    name: "Sandra Guerrero",
    image: "/ASSETS/material/barberos/2.webp",
    description:
      "Sandra aporta un toque fresco y moderno a nuestro equipo de barbería. Le encanta crear estilos tan únicos como cada cliente individual.",
  },
  {
    name: "Maikol Colmenares",
    image: "/ASSETS/material/barberos/1.webp",
    description: "Con una pasión por los cortes clásicos, Maikol garantiza que cada cliente salga luciendo impecable y sintiéndose increíble.",
  },
]

export default function About() {
  const [indiceActual, setIndiceActual] = useState(0)
  const [direccion, setDireccion] = useState(0)

  const cambiarSlide = useCallback((nuevoIndice: number, nuevaDireccion: number) => {
    setIndiceActual(nuevoIndice)
    setDireccion(nuevaDireccion)
  }, [])

  const manejarAnterior = useCallback(() => {
    const nuevoIndice = (indiceActual - 1 + miembrosEquipo.length) % miembrosEquipo.length
    cambiarSlide(nuevoIndice, -1)
  }, [indiceActual, cambiarSlide])

  const manejarSiguiente = useCallback(() => {
    const nuevoIndice = (indiceActual + 1) % miembrosEquipo.length
    cambiarSlide(nuevoIndice, 1)
  }, [indiceActual, cambiarSlide])

  useEffect(() => {
    const temporizador = setInterval(manejarSiguiente, CAROUSEL_INTERVAL)
    return () => clearInterval(temporizador)
  }, [manejarSiguiente])

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
      <h2 className={styles.title}>¿Qué nos diferencia?</h2>  
        <p className={styles.description}>  
        Vive una experiencia premium donde la tradición clásica se fusiona con detalles impecables.  
        Nuestro equipo experto no solo perfecciona tu look, sino que redefine tu actitud.  
        ¿Listo para lucir imparable? Reserva ahora y descubre por qué somos la barbería #1 en Brooklyn.  
        ¡Tu mejor versión te espera! ✨  
        </p>  
        <div className={styles.team}>
          <h3 className={styles.subtitle}>NUESTRO EQUIPO</h3>
          <div className={styles.carouselContainer}>
            <button
              onClick={manejarAnterior}
              className={`${styles.navButton} ${styles.prevButton}`}
              aria-label="Barbero anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <div className={styles.carouselTrack} style={{ transform: `translateX(-${indiceActual * 100}%)` }}>
              {miembrosEquipo.map((miembro, indice) => (
                <div
                  key={indice}
                  className={`${styles.memberCard} ${indice === indiceActual ? styles.active : ""}`}
                  style={{ transform: `translateX(${(indice - indiceActual) * 100}%)` }}
                >
                  <div className={styles.memberImageContainer} style={{ backgroundImage: `url(${miembro.image})` }}>
                    <Image
                      src={miembro.image}
                      alt={miembro.name}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      style={{ objectFit: 'cover' }}
                      className={styles.memberImage}
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h4 className={styles.memberName}>{miembro.name}</h4>
                    <p className={styles.memberDescription}>{miembro.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={manejarSiguiente}
              className={`${styles.navButton} ${styles.nextButton}`}
              aria-label="Siguiente barbero"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className={styles.indicators}>
            {miembrosEquipo.map((_, indice) => (
              <button
                key={indice}
                className={`${styles.indicator} ${indice === indiceActual ? styles.activeIndicator : ""}`}
                onClick={() => cambiarSlide(indice, indice > indiceActual ? 1 : -1)}
                aria-label={`Ir al slide ${indice + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
