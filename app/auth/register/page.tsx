"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signUp } from '@/lib/auth'
import { Loader2, Eye, EyeOff, Info } from 'lucide-react'
import '@/styles/auth.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'cliente' as 'cliente' | 'barbero' | 'super_admin'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    if (!formData.phone.match(/^\+?[\d\s\-\(\)]+$/)) {
      setError('El número de teléfono no es válido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Determinar contraseña especial basada en el rol
      let finalPassword = formData.password

      if (formData.role === 'super_admin') {
        finalPassword = process.env.NEXT_PUBLIC_ADMIN_PASS || 'soloadmins123'
      } else if (formData.role === 'barbero') {
        finalPassword = process.env.NEXT_PUBLIC_BARBER_PASS || 'solobarbers123'
      }

      const result = await signUp(
        formData.email,
        finalPassword,
        formData.fullName,
        formData.phone
      )

      setSuccess(result.message)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)

    } catch (error: any) {
      setError(error.message)
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
          <h1 className="auth-title">Únete Al Equipo</h1>
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
            <label htmlFor="fullName" className="auth-label">
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
              className="auth-input"
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="auth-input"
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="phone" className="auth-label">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+57 300 123 4567"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              className="auth-input"
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="role" className="auth-label">
              Tipo de Cuenta
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="auth-select"
              disabled={isLoading}
            >
              <option value="cliente">Cliente</option>
              <option value="barbero">Barbero</option>
              <option value="super_admin">Administrador</option>
            </select>
          </div>

          {(formData.role === 'barbero' || formData.role === 'super_admin') && (
            <div className="auth-info-card">
              <div className="auth-info-title">
                <Info size={16} />
                Información Importante
              </div>
              <p className="auth-info-text">
                Para registrarte como {formData.role === 'barbero' ? 'barbero' : 'administrador'},
                se te asignará una contraseña especial automáticamente.
              </p>
            </div>
          )}

          {formData.role === 'cliente' && (
            <>
              <div className="auth-input-group">
                <label htmlFor="password" className="auth-label">
                  Contraseña
                </label>
                <div className="auth-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crea una contraseña segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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

              <div className="auth-input-group">
                <label htmlFor="confirmPassword" className="auth-label">
                  Confirmar Contraseña
                </label>
                <div className="auth-password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="auth-input"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-password-toggle"
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-divider">
            <span>¿Ya tienes cuenta?</span>
          </div>
          <div>
            <Link href="/auth/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}