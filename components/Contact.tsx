"use client"

import { useState } from "react"
import { MessageSquarePlus, Send, CheckCircle, X, Loader2 } from "lucide-react"
import "./Contact.css"

export default function Contact() {
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
        <h2 className="contact-title text-4xl md:text-5xl font-bold mb-12 text-center">CONTÁCTANOS</h2>
        <p className="text-center mb-8 text-white">
          Visítanos en Brooklyn, NY en 1675 79th St, o déjanos tu opinión sobre nuestra página web.
        </p>
        <div className="map-container mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.7471547492633!2d-73.99887518459578!3d40.61340707934112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2444a812fd823%3A0x4bbdfe04cc4ad5c2!2s1675%2079th%20St%2C%20Brooklyn%2C%20NY%2011214%2C%20USA!5e0!3m2!1sen!2sdo!4v1599299403226!5m2!1sen!2sdo"
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

