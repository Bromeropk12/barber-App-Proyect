"use client"

import { useReservation } from '@/contexts/ReservationContext'
import { useState } from 'react'
import { User, Mail, Phone, Calendar, Clock, DollarSign } from 'lucide-react'

export default function ReservationSummary() {
  const { state, dispatch, nextStep, prevStep } = useReservation()
  const [notes, setNotes] = useState('')

  const handleNotesChange = (value: string) => {
    setNotes(value)
  }

  const handleContinue = () => {
    // Aquí podríamos calcular el precio total si fuera necesario
    dispatch({ type: 'SET_TOTAL_PRICE', payload: 0 }) // Por ahora 0, se calculará en backend
    nextStep()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // HH:MM format
  }

  if (!state.selectedService || !state.selectedBarber || !state.selectedDateTime) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Información de reserva incompleta</p>
      </div>
    )
  }

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Confirma tu Reserva</h2>
        <p className="step-description">Revisa los detalles antes de continuar</p>
      </div>

      {/* Resumen de la Reserva */}
      <div className="selection-card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detalles de la Reserva</h3>

        {/* Servicio */}
        <div className="flex items-center space-x-3 p-3 mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {state.selectedService.title.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="text-white font-medium">{state.selectedService.title}</h4>
            <p className="text-gray-400 text-sm">{state.selectedService.description}</p>
          </div>
        </div>

        {/* Barbero */}
        <div className="flex items-center space-x-3 p-3 mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <User className="w-5 h-5 text-accent-color" />
          <div>
            <h4 className="text-white font-medium">{state.selectedBarber.full_name}</h4>
            <p className="text-gray-400 text-sm">
              {state.selectedBarber.experience_years && `${state.selectedBarber.experience_years} años de experiencia`}
            </p>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="flex items-center space-x-3 p-3 mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <Calendar className="w-5 h-5 text-accent-color" />
          <div>
            <h4 className="text-white font-medium">{formatDate(state.selectedDateTime.date)}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">{formatTime(state.selectedDateTime.time)}</span>
            </div>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between p-3" style={{ background: 'rgba(229, 142, 9, 0.1)', borderRadius: '10px' }}>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-accent-color" />
            <span className="text-white font-medium">Precio Total</span>
          </div>
          <span className="text-white font-bold text-lg">
            ${state.totalPrice || 'Por calcular'}
          </span>
        </div>
      </div>

      {/* Información del Cliente */}
      <div className="selection-card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre completo"
              value={state.customerInfo.name}
              onChange={(e) => dispatch({
                type: 'SET_CUSTOMER_INFO',
                payload: { ...state.customerInfo, name: e.target.value }
              })}
              className="wizard-input"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={state.customerInfo.email}
              onChange={(e) => dispatch({
                type: 'SET_CUSTOMER_INFO',
                payload: { ...state.customerInfo, email: e.target.value }
              })}
              className="wizard-input"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={state.customerInfo.phone || ''}
              onChange={(e) => dispatch({
                type: 'SET_CUSTOMER_INFO',
                payload: { ...state.customerInfo, phone: e.target.value }
              })}
              className="wizard-input"
            />
          </div>
        </div>
      </div>

      {/* Notas Adicionales */}
      <div className="selection-card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notas Adicionales (Opcional)</h3>
        <textarea
          placeholder="¿Alguna petición especial o información adicional?"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={3}
          className="wizard-input resize-none"
        />
      </div>

      <div className="wizard-actions">
        <button
          onClick={prevStep}
          className="wizard-button wizard-button-secondary"
        >
          Anterior
        </button>

        <button
          onClick={handleContinue}
          className="wizard-button wizard-button-primary"
        >
          Continuar al Pago
        </button>
      </div>
    </div>
  )
}