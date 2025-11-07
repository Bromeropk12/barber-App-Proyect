"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { useContent } from "@/contexts/ContentContext"
import "./WhatsAppButton.css"

interface WhatsAppButtonProps {
  phoneNumber?: string
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const { content } = useContent()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollPos = window.pageYOffset
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      setIsVisible(currentScrollPos < 10 || currentScrollPos < lastScrollPos)
      lastScrollPos = currentScrollPos
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = () => {
    const phone = phoneNumber || content.business.phone
    const message = content.business.whatsAppMessage || "¡Hola! Me gustaría obtener más información sobre sus servicios de barbería."
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank")
  }

  return (
    <button
      className={`whatsapp-button ${isVisible ? "visible" : "hidden"}`}
      onClick={handleClick}
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="whatsapp-icon" />
    </button>
  )
}

