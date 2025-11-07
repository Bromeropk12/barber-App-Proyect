"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { CAROUSEL_INTERVAL, BLUR_PLACEHOLDER } from "@/lib/constants"
import "./gallery-comp.css"

const galleryImages = [
  "/ASSETS/material/gallery1.jpg",
  "/ASSETS/material/gallery2.jpg",
  "/ASSETS/material/gallery3.jpg",
  "/ASSETS/material/gallery4.jpg",
  "/ASSETS/material/gallery5.jpg",
  "/ASSETS/material/gallery6.jpg",
  "/ASSETS/material/gallery7.jpg",
  "/ASSETS/material/gallery8.jpg",
  "/ASSETS/material/gallery9.jpg",
  "/ASSETS/material/gallery10.jpg",
  "/ASSETS/material/gallery11.jpg",
  "/ASSETS/material/gallery12.jpg",
]

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [isTransitioning])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide()
    }

    if (touchStart - touchEnd < -75) {
      prevSlide()
    }
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, CAROUSEL_INTERVAL)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section id="gallery" className="gallery-section py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="gallery-title text-4xl md:text-5xl font-bold mb-12 text-center">NUESTRA GALERÍA</h2>
        <div
          className="gallery-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="gallery-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {galleryImages.map((src, index) => (
              <div key={index} className={`gallery-slide ${index === currentIndex ? "active" : ""}`}>
                <div className="image-overlay"></div>
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
          <button className="gallery-control left" onClick={prevSlide} aria-label="Previous image">
            <ChevronLeft size={24} />
          </button>
          <button className="gallery-control right" onClick={nextSlide} aria-label="Next image">
            <ChevronRight size={24} />
          </button>
          <div className="gallery-indicators">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        <div className="gallery-info">
          <Camera className="gallery-icon" />
          <p className="gallery-description">Explora nuestra colección de estilos y cortes de cabello</p>
        </div>
      </div>
    </section>
  )
}