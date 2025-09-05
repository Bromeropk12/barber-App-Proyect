"use client"

import Image from "next/image"
import { PhoneIcon as WhatsappIcon } from "lucide-react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function Promo() {
  const handleWhatsAppClick = () => {
    // Replace this with your actual WhatsApp number
    window.open("https://wa.me/+573103395588", "_blank")
  }

  return (
    <div className="relative w-full overflow-hidden shadow-2xl">
      {/* Background Image */}
      <Image
        src="/ASSETS/material/tijera.webp"
        alt="Brookings Barber background"
        width={1000}
        height={200}
        className="object-cover object-center w-full h-full absolute inset-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 w-full text-white py-4 md:py-6 px-6 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h2
              className={`${playfair.className} text-2xl md:text-3xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-white via-[#ffffff] to-white bg-clip-text text-transparent`}
            >
              ¡Luce un estilo único en Brookings Barber!
            </h2>
            <p className="text-sm md:text-base text-gray-200">Reserva tu cita ahora o visítanos cuando quieras</p>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="group relative flex items-center gap-2 bg-[#4f1e64] hover:bg-[#3b164b] text-white px-6 py-2.5 text-base md:text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[#4f1e64]/50 hover:shadow-lg whitespace-nowrap"
          >
            <WhatsappIcon className="w-5 h-5 animate-bounce" />
            347-768-3630
            <span className="absolute inset-0 bg-[#4f1e64] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  )
}
