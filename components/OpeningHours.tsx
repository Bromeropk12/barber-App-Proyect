"use client"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import "./OpeningHours.css"

const hours = [
  { days: "Lunes a Jueves", time: "10:00 AM - 8:00 PM" },
  { days: "Viernes y Sábado", time: "10:00 AM - 9:00 PM" },
  { days: "Domingo", time: "10:00 AM - 6:00 PM" },
]

export default function OpeningHours() {
  const router = useRouter()

  return (
    <section className="opening-hours-section">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="opening-hours-title text-4xl md:text-5xl font-bold text-center">HORARIO DE ATENCIÓN</h3>
        <div className="hours-container mt-12">
          {hours.map((item, index) => (
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
          <button onClick={() => router.push("/reserva")} className="reservation-button">
            RESERVAR AHORA
          </button>
        </div>
      </div>
    </section>
  )
}

