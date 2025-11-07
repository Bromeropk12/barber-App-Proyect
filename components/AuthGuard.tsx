"use client"

import { useState, useEffect } from 'react'
import { isAuthenticated, hasRole, getCurrentUser } from '@/lib/auth'
import { UserRole } from '@/lib/auth-middleware'

interface AuthGuardProps {
  children: React.ReactNode
  required?: boolean
  roles?: UserRole[]
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
  inline?: boolean // Nueva prop para control de layout
}

export default function AuthGuard({
  children,
  required = true,
  roles = [],
  fallback,
  loadingComponent,
  inline = false
}: AuthGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (required) {
          const authenticated = await isAuthenticated()
          if (!authenticated) {
            setAuthorized(false)
            return
          }

          if (roles.length > 0) {
            const hasRequiredRole = roles.some(role => hasRole(role))
            setAuthorized(hasRequiredRole)
          } else {
            setAuthorized(true)
          }
        } else {
          setAuthorized(true)
        }
      } catch (error) {
        console.warn('Error checking auth:', error)
        setAuthorized(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [required, roles])

  // Si está cargando, mostrar loading inline
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color"></div>
      </div>
    )
  }

  // Si no está autorizado, mostrar fallback
  if (!authorized) {
    if (inline) {
      return fallback || (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-white mb-2">Acceso Restringido</h3>
          <p className="text-gray-400 mb-4">Debes iniciar sesión para acceder a esta funcionalidad.</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-accent-color text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm"
          >
            Iniciar Sesión
          </button>
        </div>
      )
    }
    
    return fallback || (
      <div className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h2>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para acceder a esta funcionalidad.</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-accent-color text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}