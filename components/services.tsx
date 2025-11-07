"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Scissors } from "lucide-react"
import { useContent } from "@/contexts/ContentContext"
import "./services.css"

export default function ServicesCard() {
  const { content } = useContent()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div id="services" className="services-container min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="service-title text-4xl md:text-5xl text-center text-white mb-16">{content.services.title}</h1>
        <div className="flex justify-center">
          <div
            className="service-card rounded-xl p-8 max-w-md w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="icon-container mb-6">
              <Scissors
                className="w-12 h-12 text-accent-color"
                style={{
                  color: 'white',
                  transform: isHovered ? "scale(1.1) rotate(10deg)" : "scale(1)",
                  transition: "transform 0.8s ease",
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">DESCUBRE NUESTROS SERVICIOS</h3>
            <p className="text-gray-400 mb-6">
              Explora nuestra amplia gama de servicios de barbería y ofertas especiales. Desde cortes de caballero hasta
              afeitados clásicos, tenemos todo lo que necesitas para lucir tu mejor versión.
            </p>
            <button
              onClick={() => router.push("/sub-services")}
              className="price-button w-full py-3 px-6 rounded-lg mt-6 font-semibold"
            >
              RESERVAR SERVICIO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
