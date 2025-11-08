"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, getCurrentUser } from '@/lib/auth'
import { getUserReservations, getBarberReservations, getDashboardStats } from '@/lib/reservations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, DollarSign, Users, LogOut, User, Settings } from 'lucide-react'
import type { User as AuthUser } from '@supabase/supabase-js'

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

interface DashboardProps {
  user: AuthUser
  profile: Profile
}

export default function ClientDashboard({ user, profile }: DashboardProps) {
  const [reservations, setReservations] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [profile.role])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Cargar estadísticas
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)

      // Cargar reservas según el rol
      if (profile.role === 'barbero') {
        const barberReservations = await getBarberReservations()
        setReservations(barberReservations)
      } else {
        const userReservations = await getUserReservations()
        setReservations(userReservations)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmada', variant: 'default' as const },
      completed: { label: 'Completada', variant: 'default' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const },
      no_show: { label: 'No Asistió', variant: 'destructive' as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // HH:MM format
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <User className="h-8 w-8 text-accent-color" />
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-gray-400">{profile.full_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="capitalize">
              {profile.role}
            </Badge>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent-color">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="reservations" className="data-[state=active]:bg-accent-color">
              Reservas
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-accent-color">
              Perfil
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-accent-color">
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profile.role === 'cliente' && stats && (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Total Reservas
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Próximas
                      </CardTitle>
                      <Clock className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.upcoming_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Completadas
                      </CardTitle>
                      <Users className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.completed_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Canceladas
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.cancelled_reservations || 0}</div>
                    </CardContent>
                  </Card>
                </>
              )}

              {profile.role === 'barbero' && stats && (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Hoy
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.today_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Esta Semana
                      </CardTitle>
                      <Clock className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.week_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Ganancias Totales
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats.total_earnings || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Tasa de Finalización
                      </CardTitle>
                      <Users className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.completion_rate || 0}%</div>
                    </CardContent>
                  </Card>
                </>
              )}

              {profile.role === 'super_admin' && stats && (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Total Usuarios
                      </CardTitle>
                      <Users className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total_users || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Total Reservas
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Hoy
                      </CardTitle>
                      <Clock className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.today_reservations || 0}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Ingresos Totales
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-accent-color" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats.total_revenue || 0}</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tienes reservas aún</p>
                      {profile.role === 'cliente' && (
                        <Button
                          onClick={() => router.push('/sub-services')}
                          className="mt-4 bg-accent-color hover:bg-accent-color/90"
                        >
                          Hacer una Reserva
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                reservations.map((reservation: any) => (
                  <Card key={reservation.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">
                            {reservation.services?.name || 'Servicio'}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {formatDate(reservation.reservation_date)} a las {formatTime(reservation.start_time)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Precio:</span>
                          <span className="ml-2 text-white font-semibold">
                            ${reservation.total_price}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">
                            {profile.role === 'barbero' ? 'Cliente:' : 'Barbero:'}
                          </span>
                          <span className="ml-2 text-white">
                            {profile.role === 'barbero'
                              ? reservation.client?.full_name || 'Cliente'
                              : reservation.barber?.full_name || 'Barbero'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Duración:</span>
                          <span className="ml-2 text-white">
                            {reservation.services?.duration_minutes || 0} min
                          </span>
                        </div>
                      </div>
                      {reservation.notes && (
                        <div className="mt-4 p-3 bg-gray-700 rounded-md">
                          <span className="text-gray-400 text-sm">Notas:</span>
                          <p className="text-white mt-1">{reservation.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Información del Perfil</CardTitle>
                <CardDescription className="text-gray-400">
                  Gestiona tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Nombre Completo</label>
                    <p className="text-white mt-1">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Correo Electrónico</label>
                    <p className="text-white mt-1">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Teléfono</label>
                    <p className="text-white mt-1">{profile.phone || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Rol</label>
                    <p className="text-white mt-1 capitalize">{profile.role}</p>
                  </div>
                  {profile.role === 'barbero' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Años de Experiencia</label>
                        <p className="text-white mt-1">{profile.experience_years || 0} años</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Turno de Trabajo</label>
                        <p className="text-white mt-1 capitalize">{profile.work_shift || 'No especificado'}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => router.push('/profile/edit')}
                    variant="outline"
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Cuenta y Seguridad</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gestiona la configuración de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => router.push('/profile/edit')}
                    className="w-full bg-accent-color hover:bg-accent-color/90"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>

                  <Button
                    onClick={() => router.push('/auth/forgot-password')}
                    variant="outline"
                    className="w-full text-white border-gray-600 hover:bg-gray-700"
                  >
                    Cambiar Contraseña
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Preferencias</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configura tus preferencias de la aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Notificaciones</p>
                      <p className="text-gray-400 text-sm">Recibe actualizaciones sobre tus reservas</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-white border-gray-600">
                      Configurar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Idioma</p>
                      <p className="text-gray-400 text-sm">Idioma de la aplicación</p>
                    </div>
                    <span className="text-accent-color">Español</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Rol:</span>
                    <p className="text-white font-medium capitalize">{profile.role}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Estado:</span>
                    <p className="text-green-400 font-medium">Activo</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Última conexión:</span>
                    <p className="text-white font-medium">Ahora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}