// Utilidades de autenticación con Supabase
import { supabase } from './supabase'
import { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    id: string
    email: string
    full_name: string
    phone?: string
    role: 'cliente' | 'barbero' | 'super_admin'
    avatar_url?: string
    is_verified: boolean
    experience_years?: number
    work_shift?: string
    barber_status?: string
  }
}

// Función para determinar rol basado en contraseña especial
export function getRoleFromPassword(password: string): 'cliente' | 'barbero' | 'super_admin' {
  if (password === process.env.NEXT_PASS_ADMISN) {
    return 'super_admin'
  }
  if (password === process.env.NEXT_PASS_BARBERS) {
    return 'barbero'
  }
  return 'cliente'
}

// Registro de usuario
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone?: string
) {
  try {
    // Verificar si email ya existe
    const { data: existingUser } = await supabase
      .rpc('is_email_available', { p_email: email })

    if (!existingUser) {
      throw new Error('El correo electrónico ya está registrado')
    }

    // Verificar teléfono si se proporciona
    if (phone) {
      const { data: phoneAvailable } = await supabase
        .rpc('is_phone_available', { p_phone: phone })

      if (!phoneAvailable) {
        throw new Error('El número de teléfono ya está registrado')
      }
    }

    const role = getRoleFromPassword(password)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          admin_password: role === 'super_admin' ? process.env.NEXT_PASS_ADMISN : null,
          barber_password: role === 'barbero' ? process.env.NEXT_PASS_BARBERS : null,
        }
      }
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session,
      message: 'Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.'
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al registrar usuario')
  }
}

// Inicio de sesión
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión')
  }
}

// Cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error: any) {
    throw new Error(error.message || 'Error al cerrar sesión')
  }
}

// Obtener usuario actual con perfil
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error obteniendo perfil:', profileError)
      return user as AuthUser
    }

    return {
      ...user,
      profile
    } as AuthUser
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    return null
  }
}

// Obtener sesión actual
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error obteniendo sesión:', error)
    return null
  }
}

// Verificar si usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return !!session
}

// Verificar rol del usuario
export async function hasRole(requiredRole: 'cliente' | 'barbero' | 'super_admin'): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user?.profile) return false

  const roleHierarchy = {
    cliente: 1,
    barbero: 2,
    super_admin: 3
  }

  return roleHierarchy[user.profile.role] >= roleHierarchy[requiredRole]
}

// Resetear contraseña
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })

    if (error) throw error

    return {
      message: 'Se ha enviado un enlace de recuperación a tu correo electrónico'
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al enviar email de recuperación')
  }
}

// Actualizar contraseña
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return {
      message: 'Contraseña actualizada exitosamente'
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al actualizar contraseña')
  }
}

// Actualizar perfil
export async function updateProfile(updates: {
  full_name?: string
  phone?: string
  avatar_url?: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Verificar teléfono si se está actualizando
    if (updates.phone) {
      const { data: phoneAvailable } = await supabase
        .rpc('is_phone_available', {
          p_phone: updates.phone,
          p_exclude_user_id: user.id
        })

      if (!phoneAvailable) {
        throw new Error('El número de teléfono ya está registrado')
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    return {
      message: 'Perfil actualizado exitosamente'
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error al actualizar perfil')
  }
}