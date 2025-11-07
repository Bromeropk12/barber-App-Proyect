"use client"

import { useReservation } from '@/contexts/ReservationContext'
import { useContent } from '@/contexts/ContentContext'
import { Scissors, RadarIcon as Razor, Droplet, Clock, Users, DollarSign } from 'lucide-react'

export default function ServiceSelection() {
  const { state, dispatch, nextStep } = useReservation()
  const { content } = useContent()

  const getIconComponent = (iconName: string) => {
    const icons = { Scissors, Razor, Droplet, Clock, Users, DollarSign }
    return icons[iconName as keyof typeof icons] || Scissors
  }

  const handleServiceSelect = (service: any) => {
    dispatch({ type: 'SET_SERVICE', payload: service })
  }

  const handleContinue = () => {
    if (state.selectedService) {
      nextStep()
    } else {
      dispatch({ type: 'SET_ERROR', payload: { field: 'service', message: 'Por favor selecciona un servicio' } })
    }
  }

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Selecciona un Servicio</h2>
        <p className="step-description">Elige el servicio que deseas reservar</p>
      </div>

      {state.errors.service && (
        <div className="error-message">
          {state.errors.service}
        </div>
      )}

      <div className="services-grid">
        {content.services.services.map((service) => {
          const IconComponent = getIconComponent(service.icon)
          const isSelected = state.selectedService?.id === service.id

          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`selection-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <IconComponent className="w-6 h-6 text-accent-color" />
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
              </div>

              <p className="text-gray-400 text-sm mb-3">{service.description}</p>

              {Array.isArray(service.prices) ? (
                <div className="space-y-1">
                  {service.prices.map((price, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-400">{price.type}</span>
                      <span className="text-white font-semibold">${price.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-lg font-bold text-white">${service.price}</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="wizard-actions">
        <div></div> {/* Spacer */}
        <button
          onClick={handleContinue}
          disabled={!state.selectedService}
          className="wizard-button wizard-button-primary"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}