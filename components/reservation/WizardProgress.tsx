"use client"

import { useReservation } from '@/contexts/ReservationContext'
import { WIZARD_STEPS } from '@/types/reservation'
import { CheckCircle, Circle } from 'lucide-react'

export default function WizardProgress() {
  const { state } = useReservation()

  const progressPercentage = ((state.currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100

  return (
    <div className="wizard-progress">
      <div className="progress-line">
        <div
          className="progress-line-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="progress-steps">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = state.currentStep > step.id
          const isActive = state.currentStep === step.id

          return (
            <div key={step.id} className="progress-step">
              <div
                className={`step-circle ${
                  isCompleted ? 'completed' : isActive ? 'active' : ''
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className={`step-label ${
                isCompleted ? 'completed' : isActive ? 'active' : ''
              }`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          {WIZARD_STEPS.find(step => step.id === state.currentStep)?.description}
        </p>
      </div>
    </div>
  )
}