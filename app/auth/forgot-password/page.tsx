"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { resetPassword } from '@/lib/auth'
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import '@/styles/auth.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await resetPassword(email)
      setSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico.')
      setEmailSent(true)
    } catch (error: any) {
      setError(error.message || 'Error al enviar el email de recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
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
            <div className="auth-success-icon">
              <CheckCircle size={48} color="#22c55e" />
            </div>
            <h1 className="auth-title">Email Enviado</h1>
            <p className="auth-subtitle">Revisa tu bandeja de entrada</p>
          </div>

          <div className="auth-success-content">
            <div className="auth-alert auth-alert-success">
              <p>{success}</p>
            </div>
            
            <div className="auth-instructions">
              <h3>¿No recibiste el email?</h3>
              <ul>
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Verifica que hayas ingresado el email correcto</li>
                <li>Espera unos minutos y vuelve a intentar</li>
              </ul>
            </div>

            <div className="auth-actions">
              <button
                onClick={() => setEmailSent(false)}
                className="auth-button auth-button-secondary"
              >
                Intentar de nuevo
              </button>
              
              <Link href="/auth/login" className="auth-link auth-link-back">
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
          <div className="auth-forgot-icon">
            <Mail size={40} color="#e58e09" />
          </div>
          <h1 className="auth-title">Recuperar Contraseña</h1>
          <p className="auth-subtitle">Te ayudamos a recuperar el acceso</p>
        </div>

        <div className="auth-forgot-info">
          <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-alert auth-alert-error">
              <div className="auth-alert-header">
                <AlertCircle size={16} />
                <span>Error</span>
              </div>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-alert auth-alert-success">
              <div className="auth-alert-header">
                <CheckCircle size={16} />
                <span>Éxito</span>
              </div>
              {success}
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              Correo Electrónico
            </label>
            <div className="auth-input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu email registrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                disabled={isLoading}
              />
              <Mail size={20} className="auth-input-icon" />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Enlace de Recuperación'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-back-link">
            <Link href="/auth/login" className="auth-link">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
          
          <div className="auth-divider">
            <span>¿No tienes cuenta?</span>
          </div>
          
          <div>
            <Link href="/auth/register" className="auth-link">
              Crear cuenta nueva
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}