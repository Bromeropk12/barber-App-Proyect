"use client"

import { useState } from 'react'
import { useReservation } from '@/contexts/ReservationContext'
import { createReservation, processPayment } from '@/lib/reservations'
import { useRouter } from 'next/navigation'
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'

export default function PaymentProcessing() {
  const { state, dispatch, prevStep, resetReservation } = useReservation()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    if (!state.selectedService || !state.selectedBarber || !state.selectedDateTime) {
      setError('Información de reserva incompleta')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Crear la reserva
      const reservationData = {
        service_id: state.selectedService.id,
        barber_id: state.selectedBarber.id,
        reservation_date: state.selectedDateTime.date,
        start_time: state.selectedDateTime.time,
        notes: `Cliente: ${state.customerInfo.name} - Email: ${state.customerInfo.email}${state.customerInfo.phone ? ` - Tel: ${state.customerInfo.phone}` : ''}`
      }

      const reservationId = await createReservation(reservationData)

      // Procesar el pago
      await processPayment(reservationId, paymentMethod, paymentMethod === 'card' ? cardDetails : undefined)

      setCompleted(true)

      // Redirigir al dashboard después de 3 segundos
      setTimeout(() => {
        resetReservation()
        router.push('/dashboard?success=reservation_created')
      }, 3000)

    } catch (err: any) {
      console.error('Error processing reservation:', err)
      setError(err.message || 'Error al procesar la reserva')
    } finally {
      setProcessing(false)
    }
  }

  const handleCardDetailChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }))
  }

  if (completed) {
    return (
      <div className="step-content">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.7) 100%)',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)'
          }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <div>
            <h2 className="step-title">¡Reserva Confirmada!</h2>
            <p className="step-description">
              Tu cita ha sido agendada exitosamente. Recibirás una confirmación por email.
            </p>
          </div>

          <div className="selection-card max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Detalles de tu Reserva</h3>

            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Servicio:</span>
                <span className="text-white">{state.selectedService?.title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Barbero:</span>
                <span className="text-white">{state.selectedBarber?.full_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Fecha:</span>
                <span className="text-white">
                  {new Date(state.selectedDateTime?.date || '').toLocaleDateString('es-ES')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Hora:</span>
                <span className="text-white">{state.selectedDateTime?.time.substring(0, 5)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Método de Pago:</span>
                <span className="text-white">{paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Redirigiendo al dashboard en unos segundos...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Procesar Pago</h2>
        <p className="step-description">Completa el proceso de pago para confirmar tu reserva</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Método de Pago */}
      <div className="selection-card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Método de Pago</h3>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
              className="text-accent-color focus:ring-accent-color"
            />
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-white">Pago en Efectivo</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'card')}
              className="text-accent-color focus:ring-accent-color"
            />
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span className="text-white">Tarjeta de Crédito/Débito</span>
          </label>
        </div>
      </div>

      {/* Detalles de Tarjeta */}
      {paymentMethod === 'card' && (
        <div className="selection-card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Detalles de la Tarjeta</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Número de Tarjeta</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardDetailChange('cardNumber', e.target.value)}
                className="wizard-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Fecha de Expiración</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardDetailChange('expiryDate', e.target.value)}
                  className="wizard-input"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                  className="wizard-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Nombre del Titular</label>
              <input
                type="text"
                placeholder="Como aparece en la tarjeta"
                value={cardDetails.cardholderName}
                onChange={(e) => handleCardDetailChange('cardholderName', e.target.value)}
                className="wizard-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resumen del Pago */}
      <div className="selection-card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Resumen del Pago</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-400">
            <span>Servicio:</span>
            <span className="text-white">{state.selectedService?.title}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Barbero:</span>
            <span className="text-white">{state.selectedBarber?.full_name}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Fecha y Hora:</span>
            <span className="text-white">
              {state.selectedDateTime && `${new Date(state.selectedDateTime.date).toLocaleDateString('es-ES')} ${state.selectedDateTime.time.substring(0, 5)}`}
            </span>
          </div>

          <div className="border-t border-gray-600 pt-3 flex justify-between text-lg font-bold">
            <span className="text-white">Total a Pagar:</span>
            <span className="text-accent-color">${state.totalPrice || 'Por calcular'}</span>
          </div>
        </div>
      </div>

      <div className="wizard-actions">
        <button
          onClick={prevStep}
          disabled={processing}
          className="wizard-button wizard-button-secondary"
        >
          Anterior
        </button>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="wizard-button wizard-button-primary"
        >
          {processing ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </div>
  )
}