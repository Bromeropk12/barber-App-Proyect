"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Scissors, RadarIcon as Razor, Droplet, Clock, Users, DollarSign } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useContent } from "@/contexts/ContentContext"
import "./sub-services.css"

export default function Services() {
  const { content } = useContent()
  const router = useRouter()
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const getIconComponent = (iconName: string) => {
    const icons = { Scissors, Razor, Droplet, Clock, Users, DollarSign }
    return icons[iconName as keyof typeof icons] || Scissors
  }

  return (
    <div className="services-container min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="service-title text-4xl md:text-5xl text-center text-white mb-16">{content.services.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {content.services.services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon)
            return (
              <div
                key={service.id}
                className="service-card rounded-xl p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="icon-container mb-6">
                  <IconComponent
                    className="w-12 h-12 text-accent-color"
                    style={{
                      transform: hoveredService === service.id ? "scale(1.1) rotate(10deg)" : "scale(1)",
                      transition: "transform 0.3s ease",
                      color: "white",
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                {Array.isArray(service.prices) ? (
                  <div className="space-y-2">
                    {service.prices.map((price, idx) => (
                      <div key={idx} className="flex justify-between text-white">
                        <span>{price.type}</span>
                        <span className="text-white">${price.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-white">${service.price}</div>
                )}
                <button
                  onClick={() => router.push(`/sub-services?service=${encodeURIComponent(service.title)}`)}
                  className="price-button w-full py-3 px-6 rounded-lg mt-6 font-semibold"
                >
                  RESERVAR AHORA
                </button>
              </div>
            )
          })}
        </div>

        <h2 className="service-title text-3xl md:text-4xl text-center text-white mb-16">OFERTAS Y PROMOCIONES</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.services.offers.map((offer, index) => {
            const IconComponent = getIconComponent(offer.icon)
            return (
              <div key={offer.id} className="service-card rounded-xl p-8" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="icon-container mb-6">
                  <IconComponent className="w-12 h-12 text-accent-color" style={{ color: "white" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{offer.title}</h3>
                <p className="text-gray-400 mb-6">{offer.description}</p>
                <div className="text-3xl font-bold text-white">${offer.price}</div>
                <button
                  onClick={() => router.push(`/special-offers/${index}`)}
                  className="price-button w-full py-3 px-6 rounded-lg mt-6 font-semibold"
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

