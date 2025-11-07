"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { ReservationProvider, useReservation } from '@/contexts/ReservationContext'
import { WIZARD_STEPS } from '@/types/reservation'
import { useContent } from '@/contexts/ContentContext'
import ServiceSelection from './ServiceSelection'
import BarberSelection from './BarberSelection'
import DateTimeSelection from './DateTimeSelection'
import ReservationSummary from './ReservationSummary'
import PaymentProcessing from './PaymentProcessing'
import WizardProgress from './WizardProgress'
import './ReservationWizard.css'

function ReservationWizardContent() {
  const { state, dispatch } = useReservation()
  const { content } = useContent()
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')

  // Inicializar servicio desde URL si existe
  useEffect(() => {
    if (serviceParam && content.services.services.length > 0) {
      const service = content.services.services.find(s => s.title === serviceParam)
      if (service) {
        dispatch({ type: 'SET_SERVICE', payload: service })
      }
    }
  }, [serviceParam, content.services.services, dispatch])

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return <ServiceSelection />
      case 2:
        return <BarberSelection />
      case 3:
        return <DateTimeSelection />
      case 4:
        return <ReservationSummary />
      case 5:
        return <PaymentProcessing />
      default:
        return <ServiceSelection />
    }
  }

  return (
    <div className="reservation-wizard">
      <div className="reservation-container">
        <div className="max-w-6xl mx-auto">
          <div className="wizard-header">
            <h1 className="wizard-title">
              Reservar Cita
            </h1>
            <p className="wizard-subtitle">
              Completa el proceso en 5 simples pasos para agendar tu cita
            </p>
          </div>

          <WizardProgress />

          <div className="wizard-card">
            <div className="step-content">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReservationWizard() {
  return (
    <ReservationProvider>
      <ReservationWizardContent />
    </ReservationProvider>
  )
}