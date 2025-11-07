"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from '@/lib/auth'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import '@/styles/auth.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await signIn(email, password)
      setSuccess('Inicio de sesión exitoso. Redirigiendo...')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <Link href="/">
          <Image
            src="/ASSETS/material/logo.png"
            alt="Brookings Barber Shop Logo"
            width={160}
            height={160}
            className="logo"
            priority
          />
        </Link>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Acceso Exclusivo</h1>
          <p className="auth-subtitle">Brookings Barber Shop</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-alert auth-alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-alert auth-alert-success">
              {success}
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label">
              Contraseña
            </label>
            <div className="auth-password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                disabled={isLoading}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div style={{ marginBottom: '1rem' }}>
            <Link href="/auth/forgot-password" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="auth-divider">
            <span>¿No tienes cuenta?</span>
          </div>
          <div>
            <Link href="/auth/register" className="auth-link">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}