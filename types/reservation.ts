// Tipos para el sistema de reservas
export interface ReservationService {
  id: string
  title: string
  description: string
  icon: string
  prices?: Array<{ type: string; price: string }>
  price?: string
}

export interface Barber {
  id: string
  full_name: string
  avatar_url?: string
  experience_years?: number
  work_shift?: string
  barber_status?: string
}

export interface AvailableSlot {
  start_time: string
  end_time: string
  is_available: boolean
}

export interface ReservationData {
  service_id: string
  barber_id: string
  reservation_date: string
  start_time: string
  notes?: string
}

export interface PaymentInfo {
  method: 'cash' | 'card'
  cardDetails?: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
  }
}

export interface ReservationState {
  currentStep: number
  selectedService: ReservationService | null
  selectedBarber: Barber | null
  selectedDateTime: {
    date: string
    time: string
  } | null
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  paymentInfo: PaymentInfo | null
  isProcessing: boolean
  errors: Record<string, string>
  totalPrice: number
}

// Estados del wizard
export type WizardStep = 1 | 2 | 3 | 4 | 5

export interface WizardStepConfig {
  id: WizardStep
  title: string
  description: string
  component: string
  isCompleted: boolean
  isActive: boolean
}

// Configuración completa del wizard
export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 1,
    title: "Servicio",
    description: "Selecciona el servicio deseado",
    component: "ServiceSelection",
    isCompleted: false,
    isActive: false
  },
  {
    id: 2,
    title: "Barbero",
    description: "Elige tu barbero preferido",
    component: "BarberSelection",
    isCompleted: false,
    isActive: false
  },
  {
    id: 3,
    title: "Fecha y Hora",
    description: "Selecciona fecha y horario disponible",
    component: "DateTimeSelection",
    isCompleted: false,
    isActive: false
  },
  {
    id: 4,
    title: "Confirmación",
    description: "Revisa y confirma tu reserva",
    component: "ReservationSummary",
    isCompleted: false,
    isActive: false
  },
  {
    id: 5,
    title: "Pago",
    description: "Completa el proceso de pago",
    component: "PaymentProcessing",
    isCompleted: false,
    isActive: false
  }
]