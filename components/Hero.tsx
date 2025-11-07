"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { CAROUSEL_INTERVAL, BLUR_PLACEHOLDER } from "@/lib/constants"
import { useContent } from "@/contexts/ContentContext"
import "./hero-style.css"

function HeroSection() {
  const { content } = useContent()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % content.hero.backgroundImages.length)
    }, CAROUSEL_INTERVAL)

    return () => clearInterval(interval)
  }, [content.hero.backgroundImages.length])

  return (
    <div className="hero-carousel hero-height">
      {content.hero.backgroundImages.map((src, index) => (
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
        <h1 className="hero-text">{content.hero.title}</h1>
        <div className="hero-subtext">
          <p>{content.hero.subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
