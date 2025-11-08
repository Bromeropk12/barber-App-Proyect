"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, User, Phone, Mail, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Profile {
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

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    experience_years: '',
    work_shift: '',
    barber_status: ''
  })
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const user = await getCurrentUser()
      if (user?.profile) {
        setProfile(user.profile)
        setFormData({
          full_name: user.profile.full_name || '',
          phone: user.profile.phone || '',
          experience_years: user.profile.experience_years?.toString() || '',
          work_shift: user.profile.work_shift || '',
          barber_status: user.profile.barber_status || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const updates: any = {
        full_name: formData.full_name,
        phone: formData.phone
      }

      // Agregar campos específicos de barberos
      if (profile.role === 'barbero') {
        updates.experience_years = formData.experience_years ? parseInt(formData.experience_years) : null
        updates.work_shift = formData.work_shift
        updates.barber_status = formData.barber_status
      }

      await updateProfile(updates)

      toast.success('Perfil actualizado exitosamente')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>No se pudo cargar el perfil</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="sm"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-bold">Editar Perfil</h1>
              <p className="text-gray-400">Actualiza tu información personal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Actualiza tus datos básicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-gray-300">Nombre Completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar</p>
                </div>
              </CardContent>
            </Card>

            {/* Información Específica del Rol */}
            {profile.role === 'barbero' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Información Profesional
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Detalles específicos de tu trabajo como barbero
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience_years" className="text-gray-300">
                        Años de Experiencia
                      </Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Ej: 5"
                        min="0"
                        max="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="work_shift" className="text-gray-300 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Turno de Trabajo
                      </Label>
                      <Select
                        value={formData.work_shift}
                        onValueChange={(value) => handleInputChange('work_shift', value)}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Selecciona tu turno" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="morning">Mañana (8:00 - 14:00)</SelectItem>
                          <SelectItem value="afternoon">Tarde (14:00 - 20:00)</SelectItem>
                          <SelectItem value="night">Noche (20:00 - 02:00)</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barber_status" className="text-gray-300">
                      Estado Profesional
                    </Label>
                    <Select
                      value={formData.barber_status}
                      onValueChange={(value) => handleInputChange('barber_status', value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona tu estado" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="busy">Ocupado</SelectItem>
                        <SelectItem value="off_duty">Fuera de Servicio</SelectItem>
                        <SelectItem value="vacation">Vacaciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumen del Perfil */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumen del Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 bg-accent-color rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {formData.full_name || 'Sin nombre'}
                  </h3>
                  <p className="text-gray-400">{profile.email}</p>
                  <div className="inline-block px-3 py-1 bg-accent-color/20 text-accent-color rounded-full text-sm font-medium capitalize">
                    {profile.role}
                  </div>
                </div>

                {profile.role === 'barbero' && (
                  <div className="space-y-2 text-sm">
                    {formData.experience_years && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Experiencia:</span>
                        <span className="text-white">{formData.experience_years} años</span>
                      </div>
                    )}
                    {formData.work_shift && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Turno:</span>
                        <span className="text-white capitalize">{formData.work_shift}</span>
                      </div>
                    )}
                    {formData.barber_status && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <span className="text-white capitalize">{formData.barber_status.replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-accent-color hover:bg-accent-color/90"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full text-white border-gray-600 hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}