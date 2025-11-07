"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { ReservationState, ReservationService, Barber, WizardStep, PaymentInfo } from '@/types/reservation'

interface ReservationContextType {
  state: ReservationState
  dispatch: React.Dispatch<ReservationAction>
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: WizardStep) => void
  resetReservation: () => void
}

type ReservationAction =
  | { type: 'SET_SERVICE'; payload: ReservationService }
  | { type: 'SET_BARBER'; payload: Barber }
  | { type: 'SET_DATE_TIME'; payload: { date: string; time: string } }
  | { type: 'SET_CUSTOMER_INFO'; payload: ReservationState['customerInfo'] }
  | { type: 'SET_PAYMENT_INFO'; payload: PaymentInfo }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_TOTAL_PRICE'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: WizardStep }
  | { type: 'RESET' }

const initialState: ReservationState = {
  currentStep: 1,
  selectedService: null,
  selectedBarber: null,
  selectedDateTime: null,
  customerInfo: {
    name: '',
    email: '',
    phone: ''
  },
  paymentInfo: null,
  isProcessing: false,
  errors: {},
  totalPrice: 0
}

function reservationReducer(state: ReservationState, action: ReservationAction): ReservationState {
  switch (action.type) {
    case 'SET_SERVICE':
      return {
        ...state,
        selectedService: action.payload,
        errors: { ...state.errors, service: '' }
      }

    case 'SET_BARBER':
      return {
        ...state,
        selectedBarber: action.payload,
        errors: { ...state.errors, barber: '' }
      }

    case 'SET_DATE_TIME':
      return {
        ...state,
        selectedDateTime: action.payload,
        errors: { ...state.errors, dateTime: '' }
      }

    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: action.payload,
        errors: { ...state.errors, customerInfo: '' }
      }

    case 'SET_PAYMENT_INFO':
      return {
        ...state,
        paymentInfo: action.payload,
        errors: { ...state.errors, payment: '' }
      }

    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message }
      }

    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors }
      delete newErrors[action.payload]
      return {
        ...state,
        errors: newErrors
      }

    case 'SET_TOTAL_PRICE':
      return {
        ...state,
        totalPrice: action.payload
      }

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 5) as WizardStep
      }

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1) as WizardStep
      }

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reservationReducer, initialState)

  const nextStep = () => dispatch({ type: 'NEXT_STEP' })
  const prevStep = () => dispatch({ type: 'PREV_STEP' })
  const goToStep = (step: WizardStep) => dispatch({ type: 'GO_TO_STEP', payload: step })
  const resetReservation = () => dispatch({ type: 'RESET' })

  return (
    <ReservationContext.Provider value={{
      state,
      dispatch,
      nextStep,
      prevStep,
      goToStep,
      resetReservation
    }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservation() {
  const context = useContext(ReservationContext)
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider')
  }
  return context
}