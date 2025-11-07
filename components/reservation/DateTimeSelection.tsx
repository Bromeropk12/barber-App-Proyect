"use client"

import { useState, useEffect } from 'react'
import { useReservation } from '@/contexts/ReservationContext'
import { getAvailableSlots } from '@/lib/reservations'
import { AvailableSlot } from '@/types/reservation'
import { Calendar, Clock } from 'lucide-react'

export default function DateTimeSelection() {
  const { state, dispatch, nextStep, prevStep } = useReservation()
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Generar próximas 7 fechas disponibles
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }

    return dates
  }

  const availableDates = generateAvailableDates()

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !state.selectedBarber) return

      setLoading(true)
      try {
        const slots = await getAvailableSlots(
          state.selectedBarber.id,
          selectedDate,
          state.selectedService?.id
        )
        setAvailableSlots(slots.filter(slot => slot.is_available))
      } catch (error) {
        console.error('Error fetching slots:', error)
        dispatch({ type: 'SET_ERROR', payload: { field: 'dateTime', message: 'Error al cargar horarios disponibles' } })
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [selectedDate, state.selectedBarber, state.selectedService, dispatch])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    dispatch({ type: 'CLEAR_ERROR', payload: 'dateTime' })
  }

  const handleTimeSelect = (time: string) => {
    dispatch({ type: 'SET_DATE_TIME', payload: { date: selectedDate, time } })
  }

  const handleContinue = () => {
    if (state.selectedDateTime) {
      nextStep()
    } else {
      dispatch({ type: 'SET_ERROR', payload: { field: 'dateTime', message: 'Por favor selecciona fecha y hora' } })
    }
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

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Selecciona Fecha y Hora</h2>
        <p className="step-description">Elige el día y horario que prefieras</p>
      </div>

      {state.errors.dateTime && (
        <div className="error-message">
          {state.errors.dateTime}
        </div>
      )}

      {/* Selector de Fecha */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Selecciona una Fecha
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableDates.map((date) => {
            const isSelected = selectedDate === date
            const isToday = date === new Date().toISOString().split('T')[0]

            return (
              <button
                key={date}
                onClick={() => handleDateSelect(date)}
                className={`selection-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="text-white font-medium">
                  {isToday ? 'Hoy' : formatDate(date).split(',')[0]}
                </div>
                <div className="text-gray-400 text-sm">
                  {formatDate(date).split(',')[1]?.trim()}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selector de Hora */}
      {selectedDate && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Horarios Disponibles
          </h3>

          {loading ? (
            <div className="wizard-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => {
                const isSelected = state.selectedDateTime?.time === slot.start_time

                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(slot.start_time)}
                    className={`selection-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="text-white font-medium text-center">
                      {formatTime(slot.start_time)}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No hay horarios disponibles para esta fecha</p>
            </div>
          )}
        </div>
      )}

      <div className="wizard-actions">
        <button
          onClick={prevStep}
          className="wizard-button wizard-button-secondary"
        >
          Anterior
        </button>

        <button
          onClick={handleContinue}
          disabled={!state.selectedDateTime}
          className="wizard-button wizard-button-primary"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}