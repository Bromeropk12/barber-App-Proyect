// Middleware de autenticación global para rutas protegidas
import { isAuthenticated, hasRole, getCurrentUser } from './auth'
import { redirect } from 'next/navigation'

export type UserRole = 'cliente' | 'barbero' | 'super_admin'

export interface AuthConfig {
  required?: boolean
  roles?: UserRole[]
  redirectTo?: string
}

// Verificar autenticación del usuario (para Server Components)
export async function requireAuth(config: AuthConfig = {}): Promise<void> {
  const { required = true, roles = [], redirectTo = '/auth/login' } = config

  if (!required) return

  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect(`${redirectTo}?redirect=${encodeURIComponent('/')}`)
    return
  }

  if (roles.length > 0) {
    const hasRequiredRole = roles.some(role => hasRole(role))
    if (!hasRequiredRole) {
      redirect('/unauthorized')
      return
    }
  }
}

// Utilidad para redireccionar después del login
export function getRedirectPath(): string {
  if (typeof window === 'undefined') return '/'

  const urlParams = new URLSearchParams(window.location.search)
  const redirect = urlParams.get('redirect')
  return redirect || '/dashboard'
}