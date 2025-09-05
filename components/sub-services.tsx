"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Scissors, RadarIcon as Razor, Droplet, Clock, Users, DollarSign } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import "./sub-services.css"

type Service = {
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  prices?: { type: string; price: string }[]
  price?: string
}

const services: { [key: string]: Service } = {
  mensCuts: {
    title: "CORTES DE CABALLERO",
    description:
      "Todas las formas y estilos posibles pueden hacerse realidad gracias a las técnicas avanzadas de estilismo que te ofrecemos ahora mismo.",
    icon: Scissors,
    prices: [
      { type: "Estilo 1", price: "28" },
      { type: "Estilo 2", price: "38" },
      { type: "Estilo 3", price: "40" },
      { type: "Estilo 4", price: "38" },
      { type: "Estilo 5", price: "35" },
    ],
  },
  classicShaving: {
    title: "AFEITADO CLÁSICO",
    description:
      "Un look limpio y prolijo es garantía de éxito en todo lo que hagas. Prueba nuestra experiencia especial de afeitado real y disfruta del resultado.",
    icon: Razor,
    price: "10",
  },
  shapeUp: {
    title: "ARREGLO DE BARBA",
    description:
      "Encontrar la forma perfecta para tu vello facial puede ser complicado, pero nuestros especialistas se aseguran de que logres un resultado cómodo y espectacular.",
    icon: Droplet,
    price: "20",
  },
  hotTowelShaving: {
    title: "AFEITADO CON TOALLA CALIENTE",
    description:
      "Si te gusta el estilo retro, opta por un afeitado con toalla caliente. El vapor te envolverá en comodidad mientras relaja y limpia los poros al mismo tiempo.",
    icon: Clock,
    price: "35",
  },
  beardTrims: {
    title: "RECORTE DE BARBA",
    description:
      "Haz que tu barba luzca increíble con unos pocos movimientos precisos. Nuestros especialistas saben lo que está en tendencia y pueden hacer maravillas con tu vello facial.",
    icon: Scissors,
    price: "20",
  },
  clipperCuts: {
    title: "CORTES CON MÁQUINA",
    description:
      "Si prefieres un cabello completamente corto que requiera mínimo mantenimiento, los cortes con máquina son ideales para ti. Podemos demostrar que lo simple también puede ser elegante.",
    icon: Razor,
    price: "20",
  },
}

const specialOffers = [
  {
    title: "PROMO 1+1 (BRO + BRO)",
    description:
      "Trae a un amigo y obtengan un corte juntos a un precio espectacular. Una excelente oportunidad para traer a tu hermano o a tu hijo.",
    price: "60",
    icon: Users,
  },
  {
    title: "TARJETA DE REGALO ESPECIAL",
    description: "Corte de cabello y Afeitado Real con Toalla Caliente. Perfecto para las festividades.",
    price: "55",
    icon: DollarSign,
  },
]

export default function Services() {
  const router = useRouter()
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  return (
    <div className="services-container min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="service-title text-4xl md:text-5xl text-center text-white mb-16">NUESTROS SERVICIOS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {Object.entries(services).map(([key, service], index) => (
            <div
              key={key}
              className="service-card rounded-xl p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredService(key)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="icon-container mb-6">
                <service.icon
                  className="w-12 h-12 text-accent-color"
                  style={{
                    transform: hoveredService === key ? "scale(1.1) rotate(10deg)" : "scale(1)",
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
          ))}
        </div>

        <h2 className="service-title text-3xl md:text-4xl text-center text-white mb-16">OFERTAS Y PROMOCIONES</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {specialOffers.map((offer, index) => (
            <div key={index} className="service-card rounded-xl p-8" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="icon-container mb-6">
                <offer.icon className="w-12 h-12 text-accent-color" style={{ color: "white" }} />
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
          ))}
        </div>
      </div>
    </div>
  )
}

