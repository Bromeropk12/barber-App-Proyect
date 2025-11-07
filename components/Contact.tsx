"use client"

import { useState } from "react"
import { MessageSquarePlus, Send, CheckCircle, X, Loader2 } from "lucide-react"
import { useContent } from "@/contexts/ContentContext"
import "./Contact.css"

export default function Contact() {
  const { content } = useContent()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError("Por favor, escribe un mensaje.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMessage("")
      setIsPopupOpen(false)
      setShowConfirmation(true)
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowConfirmation(false), 5000)
    } catch (error) {
      setError("Error al enviar el mensaje. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-section py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="contact-title text-4xl md:text-5xl font-bold mb-12 text-center">{content.contact.title}</h2>
        <p className="text-center mb-8 text-white">
          {content.contact.description}
        </p>
        <div className="map-container mb-12">
          <iframe
            src={content.contact.mapUrl}
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map-iframe"
          ></iframe>
        </div>
        <div className="feedback-container">
          <button className="feedback-button" onClick={() => setIsPopupOpen(true)} type="button">
            <MessageSquarePlus className="feedback-icon" />
            <span>DANOS TU OPINIÓN</span>
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">Tu opinión es importante</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                required
                className="feedback-textarea"
                disabled={isSubmitting}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="submit-icon animate-spin" />
                ) : (
                  <Send className="submit-icon" />
                )}
                <span>{isSubmitting ? "Enviando..." : "Enviar"}</span>
              </button>
            </form>
            <button className="close-button" onClick={() => setIsPopupOpen(false)} type="button" aria-label="Cerrar">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de confirmación */}
      {showConfirmation && (
        <div className="confirmation-message">
          <div className="confirmation-content">
            <CheckCircle className="confirmation-icon" />
            <div className="confirmation-text">
              <h4>¡Gracias por tu feedback!</h4>
              <p>Tu mensaje ha sido enviado exitosamente</p>
            </div>
            <button
              className="confirmation-close"
              onClick={() => setShowConfirmation(false)}
              aria-label="Cerrar confirmación"
            >
              <X />
            </button>
            <button className="confirmation-accept" onClick={() => setShowConfirmation(false)}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

