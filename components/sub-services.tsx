"use client"

import { useRouter } from "next/navigation"
import { Scissors, RadarIcon as Razor, Droplet, Clock, Users, DollarSign } from "lucide-react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useContent } from "@/contexts/ContentContext"
import { isAuthenticated } from "@/lib/auth"
import { getRedirectPath } from "@/lib/auth-middleware"
import "./sub-services.css"

function ServicesContent() {
  const { content } = useContent()
  const router = useRouter()
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const getIconComponent = (iconName: string) => {
    const icons = { Scissors, Razor, Droplet, Clock, Users, DollarSign }
    return icons[iconName as keyof typeof icons] || Scissors
  }

  const handleReservationClick = async (serviceTitle: string) => {
    const authenticated = await isAuthenticated()

    if (authenticated) {
      // Usuario autenticado - ir al proceso de reserva
      router.push(`/reservations?service=${encodeURIComponent(serviceTitle)}`)
    } else {
      // Usuario no autenticado - ir al login con redirect
      const currentPath = `/sub-services?service=${encodeURIComponent(serviceTitle)}`
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }

  return (
    <div className="services-container min-h-screen py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="service-title text-3xl sm:text-4xl md:text-5xl text-center text-white mb-12 md:mb-16">{content.services.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {content.services.services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon)
            return (
              <div
                key={service.id}
                className="service-card rounded-xl p-6 md:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="icon-container mb-4 md:mb-6">
                  <IconComponent
                    className="w-10 h-10 md:w-12 md:h-12 text-accent-color"
                    style={{
                      transform: hoveredService === service.id ? "scale(1.1) rotate(10deg)" : "scale(1)",
                      transition: "transform 0.3s ease",
                      color: "white",
                    }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">{service.description}</p>
                {Array.isArray(service.prices) ? (
                  <div className="space-y-2 mb-6">
                    {service.prices.map((price, idx) => (
                      <div key={idx} className="flex justify-between text-white text-sm md:text-base">
                        <span>{price.type}</span>
                        <span className="text-white font-semibold">${price.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-2xl md:text-3xl font-bold text-white mb-6">${service.price}</div>
                )}
                <button
                  onClick={() => handleReservationClick(service.title)}
                  className="price-button w-full py-3 px-6 rounded-lg mt-4 md:mt-6 font-semibold text-sm md:text-base"
                >
                  RESERVAR AHORA
                </button>
              </div>
            )
          })}
        </div>

        <h2 className="service-title text-2xl sm:text-3xl md:text-4xl text-center text-white mb-12 md:mb-16">OFERTAS Y PROMOCIONES</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {content.services.offers.map((offer, index) => {
            const IconComponent = getIconComponent(offer.icon)
            return (
              <div key={offer.id} className="service-card rounded-xl p-6 md:p-8" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="icon-container mb-4 md:mb-6">
                  <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-accent-color" style={{ color: "white" }} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{offer.title}</h3>
                <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">{offer.description}</p>
                <div className="text-2xl md:text-3xl font-bold text-white mb-6">${offer.price}</div>
                <button
                  onClick={() => router.push(`/special-offers/${index}`)}
                  className="price-button w-full py-3 px-6 rounded-lg mt-4 md:mt-6 font-semibold text-sm md:text-base"
                >
                  OBTENER OFERTA
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <Suspense fallback={
      <div className="services-container min-h-screen py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-color"></div>
          </div>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  )
}

