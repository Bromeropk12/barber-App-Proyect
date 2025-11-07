"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CAROUSEL_INTERVAL, BLUR_PLACEHOLDER } from "@/lib/constants"
import { useContent } from "@/contexts/ContentContext"
import styles from "./About.module.css"

export default function About() {
  const { content } = useContent()
  const [indiceActual, setIndiceActual] = useState(0)
  const [direccion, setDireccion] = useState(0)

  const cambiarSlide = useCallback((nuevoIndice: number, nuevaDireccion: number) => {
    setIndiceActual(nuevoIndice)
    setDireccion(nuevaDireccion)
  }, [])

  const manejarAnterior = useCallback(() => {
    const nuevoIndice = (indiceActual - 1 + content.about.team.length) % content.about.team.length
    cambiarSlide(nuevoIndice, -1)
  }, [indiceActual, cambiarSlide, content.about.team.length])

  const manejarSiguiente = useCallback(() => {
    const nuevoIndice = (indiceActual + 1) % content.about.team.length
    cambiarSlide(nuevoIndice, 1)
  }, [indiceActual, cambiarSlide, content.about.team.length])

  useEffect(() => {
    const temporizador = setInterval(manejarSiguiente, CAROUSEL_INTERVAL)
    return () => clearInterval(temporizador)
  }, [manejarSiguiente])

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
      <h2 className={styles.title}>{content.about.title}</h2>
        <p className={styles.description}>
        {content.about.description}
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
              {content.about.team.map((miembro, indice) => (
                <div
                  key={miembro.id}
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
            {content.about.team.map((_, indice) => (
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
