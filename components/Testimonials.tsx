"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import "./Testimonials.css"

const testimonials = [
  {
    name: "Carlos M.",
    image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    text: "Increíble experiencia. El corte de pelo y el arreglo de barba fueron perfectos. Ambiente relajado y profesional.",
    rating: 5,
  },
  {
    name: "Javier R.",
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    text: "La mejor barbería de la ciudad. El servicio de afeitado con navaja es insuperable. Volveré seguro.",
    rating: 5,
  },
  {
    name: "Alejandro G.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    text: "Excelente atención y resultados. Me encanta cómo queda mi barba después de cada visita.",
    rating: 4,
  },
  {
    name: "Miguel Á.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    text: "Ambiente muy masculino y relajado. Los barberos son verdaderos artistas. Altamente recomendado.",
    rating: 5,
  },
  {
    name: "Roberto S.",
    image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    text: "Servicio de primera. El masaje de cuero cabelludo es una experiencia que hay que probar.",
    rating: 4,
  },

]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="testimonials-container py-16 px-4 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="testimonial-title text-3xl sm:text-4xl md:text-5xl text-center mb-12 sm:mb-16">
          EXPERIENCIAS DE NUESTROS CLIENTES
        </h2>
        <div className="testimonial-carousel">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="testimonial-content">
                <div className="testimonial-image-container">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={300}
                    height={300}
                    className="testimonial-image"
                  />
                </div>
                <div className="testimonial-text">
                  <p className="testimonial-quote">{testimonial.text}</p>
                  <p className="testimonial-name">- {testimonial.name}</p>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={prevTestimonial} className="testimonial-nav-button left-0">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={nextTestimonial} className="testimonial-nav-button right-0">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

