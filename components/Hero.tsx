"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { CAROUSEL_INTERVAL, BLUR_PLACEHOLDER } from "@/lib/constants"
import "./hero-style.css"

const images = [
  "/ASSETS/hero-background/0.webp",
  "/ASSETS/hero-background/1.webp",
  "/ASSETS/hero-background/2.webp",
  "/ASSETS/hero-background/3.webp",
  "/ASSETS/hero-background/4.webp",
  "/ASSETS/hero-background/5.webp",
  "/ASSETS/hero-background/6.webp",
]

function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, CAROUSEL_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-carousel hero-height">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Hero image ${index + 1}`}
          fill
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          style={{ objectFit: 'cover' }}
          className={`carousel-image ${index === currentImageIndex ? "active" : ""} ${
            index === 0 && currentImageIndex === 0 ? "first-image" : ""
          }`}
          priority={index === 0}
        />
      ))}
      <div className="hero-carousel-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-text">TU ESTILO COMIENZA EN NUESTRA SILLA</h1>
        <div className="hero-subtext">
          <p>Gracias por confiar en nosotros para destacar tu imagen.
          En Brookings nos tomamos muy en serio tu apariencia.
          Tu satisfacción es nuestra prioridad.</p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
