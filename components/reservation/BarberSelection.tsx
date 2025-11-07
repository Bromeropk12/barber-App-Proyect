"use client"

import { useState, useEffect } from 'react'
import { useReservation } from '@/contexts/ReservationContext'
import { getAvailableBarbers } from '@/lib/reservations'
import { Barber } from '@/types/reservation'
import { User, Star } from 'lucide-react'

export default function BarberSelection() {
  const { state, dispatch, nextStep, prevStep } = useReservation()
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const availableBarbers = await getAvailableBarbers()
        // Convertir tipos para compatibilidad
        const convertedBarbers: Barber[] = availableBarbers.map(barber => ({
          id: barber.id,
          full_name: barber.full_name,
          avatar_url: barber.avatar_url || undefined,
          experience_years: barber.experience_years || undefined,
          work_shift: barber.work_shift || undefined,
          barber_status: barber.barber_status || undefined
        }))
        setBarbers(convertedBarbers)
      } catch (error) {
        console.error('Error fetching barbers:', error)
        dispatch({ type: 'SET_ERROR', payload: { field: 'barber', message: 'Error al cargar barberos' } })
      } finally {
        setLoading(false)
      }
    }

    fetchBarbers()
  }, [dispatch])

  const handleBarberSelect = (barber: Barber) => {
    dispatch({ type: 'SET_BARBER', payload: barber })
  }

  const handleContinue = () => {
    if (state.selectedBarber) {
      nextStep()
    } else {
      dispatch({ type: 'SET_ERROR', payload: { field: 'barber', message: 'Por favor selecciona un barbero' } })
    }
  }

  if (loading) {
    return (
      <div className="wizard-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Selecciona un Barbero</h2>
        <p className="step-description">Elige el barbero de tu preferencia</p>
      </div>

      {state.errors.barber && (
        <div className="error-message">
          {state.errors.barber}
        </div>
      )}

      <div className="barbers-grid">
        {barbers.map((barber) => {
          const isSelected = state.selectedBarber?.id === barber.id

          return (
            <div
              key={barber.id}
              onClick={() => handleBarberSelect(barber)}
              className={`selection-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                  {barber.avatar_url ? (
                    <img
                      src={barber.avatar_url}
                      alt={barber.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{barber.full_name}</h3>

                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    {barber.experience_years && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{barber.experience_years} años exp.</span>
                      </div>
                    )}

                    {barber.work_shift && (
                      <span>Turno: {barber.work_shift}</span>
                    )}
                  </div>

                  {barber.barber_status && (
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        barber.barber_status === 'available'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {barber.barber_status === 'available' ? 'Disponible' : 'Ocupado'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
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
          disabled={!state.selectedBarber}
          className="wizard-button wizard-button-primary"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}