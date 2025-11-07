// Utilidades para gestión de reservas
import { supabase } from './supabase'
import { getCurrentUser } from './auth'

export interface Service {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  base_price: number
  category: string
  is_active: boolean
}

export interface Barber {
  id: string
  full_name: string
  avatar_url: string | null
  experience_years: number | null
  work_shift: string | null
  barber_status: string | null
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

// Obtener servicios activos
export async function getActiveServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener servicios')
  }
}

// Obtener barberos disponibles
export async function getAvailableBarbers(): Promise<Barber[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, experience_years, work_shift, barber_status')
      .eq('role', 'barbero')
      .eq('barber_status', 'available')
      .order('full_name')

    if (error) throw error
    return data || []
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener barberos')
  }
}

// Obtener horarios disponibles para un barbero en una fecha
export async function getAvailableSlots(
  barberId: string,
  date: string,
  serviceId?: string
): Promise<AvailableSlot[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_available_slots', {
        p_barber_id: barberId,
        p_date: date,
        p_service_id: serviceId
      })

    if (error) throw error
    return data || []
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener horarios disponibles')
  }
}

// Calcular precio total de una reserva
export async function calculateReservationPrice(
  serviceId: string,
  barberId: string
): Promise<number> {
  try {
    // Obtener precio base del servicio
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('base_price')
      .eq('id', serviceId)
      .single()

    if (serviceError) throw serviceError

    // Verificar si el barbero tiene precio personalizado
    const { data: customPrice, error: priceError } = await supabase
      .from('barber_service_prices')
      .select('custom_price')
      .eq('barber_id', barberId)
      .eq('service_id', serviceId)
      .eq('is_available', true)
      .single()

    if (priceError && priceError.code !== 'PGRST116') {
      throw priceError
    }

    return customPrice?.custom_price || service.base_price
  } catch (error: any) {
    throw new Error(error.message || 'Error al calcular precio')
  }
}

// Crear reserva
export async function createReservation(reservationData: ReservationData): Promise<string> {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Calcular precio total
    const totalPrice = await calculateReservationPrice(
      reservationData.service_id,
      reservationData.barber_id
    )

    // Crear reserva
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        client_id: user.id,
        barber_id: reservationData.barber_id,
        service_id: reservationData.service_id,
        reservation_date: reservationData.reservation_date,
        start_time: reservationData.start_time,
        total_price: totalPrice,
        notes: reservationData.notes,
        status: 'pending'
      })
      .select()
      .single()

    if (reservationError) throw reservationError

    return reservation.id
  } catch (error: any) {
    throw new Error(error.message || 'Error al crear reserva')
  }
}

// Simular pago
export async function processPayment(
  reservationId: string,
  paymentMethod: 'cash' | 'card',
  cardDetails?: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
  }
): Promise<void> {
  try {
    // Generar ID de transacción simulado
    const transactionId = paymentMethod === 'card'
      ? `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : null

    // Crear registro de pago
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: reservationId,
        payment_method: paymentMethod,
        amount: 0, // Se calculará automáticamente desde la reserva
        status: 'completed',
        transaction_id: transactionId
      })

    if (paymentError) throw paymentError

    // Actualizar estado de la reserva a confirmada
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)

    if (updateError) throw updateError

  } catch (error: any) {
    throw new Error(error.message || 'Error al procesar pago')
  }
}

// Obtener reservas del usuario actual
export async function getUserReservations() {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        services:service_id (
          name,
          duration_minutes
        ),
        barber:barber_id (
          full_name,
          avatar_url
        ),
        payments (
          payment_method,
          status,
          transaction_id
        )
      `)
      .eq('client_id', user.id)
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener reservas')
  }
}

// Obtener reservas asignadas a un barbero
export async function getBarberReservations() {
  try {
    const user = await getCurrentUser()
    if (!user || user.profile?.role !== 'barbero') {
      throw new Error('Usuario no autorizado')
    }

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        services:service_id (
          name,
          duration_minutes
        ),
        client:client_id (
          full_name,
          phone
        ),
        payments (
          payment_method,
          status
        )
      `)
      .eq('barber_id', user.id)
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener reservas')
  }
}

// Cancelar reserva
export async function cancelReservation(reservationId: string): Promise<void> {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .eq('client_id', user.id)

    if (error) throw error
  } catch (error: any) {
    throw new Error(error.message || 'Error al cancelar reserva')
  }
}

// Actualizar disponibilidad del barbero
export async function updateBarberAvailability(
  date: string,
  startTime: string,
  endTime: string,
  isAvailable: boolean,
  reason?: string
): Promise<void> {
  try {
    const user = await getCurrentUser()
    if (!user || user.profile?.role !== 'barbero') {
      throw new Error('Usuario no autorizado')
    }

    const { error } = await supabase
      .from('barber_availability')
      .upsert({
        barber_id: user.id,
        date,
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable,
        reason
      })

    if (error) throw error
  } catch (error: any) {
    throw new Error(error.message || 'Error al actualizar disponibilidad')
  }
}

// Obtener estadísticas del dashboard
export async function getDashboardStats() {
  try {
    const user = await getCurrentUser()
    if (!user?.profile) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .rpc('get_dashboard_stats', {
        p_user_id: user.id,
        p_role: user.profile.role
      })

    if (error) throw error
    return data
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener estadísticas')
  }
}