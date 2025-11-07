"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from "@/contexts/ContentContext"
import "./Testimonials.css"

export default function Testimonials() {
  const { content } = useContent()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % content.testimonials.testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [content.testimonials.testimonials.length])

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % content.testimonials.testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + content.testimonials.testimonials.length) % content.testimonials.testimonials.length)
  }

  return (
    <section className="testimonials-container py-16 px-4 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="testimonial-title text-3xl sm:text-4xl md:text-5xl text-center mb-12 sm:mb-16">
          {content.testimonials.title}
        </h2>
        <div className="testimonial-carousel">
          {content.testimonials.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
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
          {content.testimonials.testimonials.map((_, index) => (
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

