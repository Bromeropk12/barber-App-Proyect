"use client"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { useContent } from "@/contexts/ContentContext"
import "./OpeningHours.css"

export default function OpeningHours() {
  const { content } = useContent()
  const router = useRouter()

  return (
    <section className="opening-hours-section">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="opening-hours-title text-4xl md:text-5xl font-bold text-center">HORARIO DE ATENCIÓN</h3>
        <div className="hours-container mt-12">
          {content.business.hours.map((item, index) => (
            <div key={index} className="hours-row">
              <span className="days">{item.days}</span>
              <span className="time flex items-center">
                <Clock className="w-5 h-5 mr-2 text-accent-color" />
                {item.time}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => router.push("/sub-services")} className="reservation-button">
            RESERVAR AHORA
          </button>
        </div>
      </div>
    </section>
  )
}

