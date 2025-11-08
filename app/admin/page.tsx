"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useContent } from "@/contexts/ContentContext"
import { BarberShopData } from "@/types/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, Download, Upload } from "lucide-react"
import { isAuthenticated, hasRole, getCurrentUser } from "@/lib/auth"
import { AuthUser } from "@/lib/auth"

export default function AdminPage() {
  const { content, updateContent } = useContent()
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editedContent, setEditedContent] = useState<BarberShopData>(content)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setEditedContent(content)
  }, [content])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()
        const hasSuperAdminRole = await hasRole('super_admin')
        const currentUser = await getCurrentUser()

        setIsUserAuthenticated(authenticated)
        setIsSuperAdmin(hasSuperAdminRole)
        setUser(currentUser)
      } catch (error) {
        console.warn('Error verificando autenticación:', error)
        setIsUserAuthenticated(false)
        setIsSuperAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirigir si no está autenticado o no es super_admin
  useEffect(() => {
    if (!loading && (!isUserAuthenticated || !isSuperAdmin)) {
      router.push('/auth/login?redirect=/admin')
    }
  }, [loading, isUserAuthenticated, isSuperAdmin, router])

  const handleSave = () => {
    updateContent({ section: "hero", data: editedContent.hero })
    updateContent({ section: "intro", data: editedContent.intro })
    updateContent({ section: "about", data: editedContent.about })
    updateContent({ section: "services", data: editedContent.services })
    updateContent({ section: "testimonials", data: editedContent.testimonials })
    updateContent({ section: "gallery", data: editedContent.gallery })
    updateContent({ section: "contact", data: editedContent.contact })
    updateContent({ section: "business", data: editedContent.business })
    setHasChanges(false)
    alert("Cambios guardados exitosamente")
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(editedContent, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'barber-shop-content.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          setEditedContent(importedData)
          setHasChanges(true)
        } catch (error) {
          alert("Error al importar el archivo")
        }
      }
      reader.readAsText(file)
    }
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color"></div>
              <span className="ml-2">Verificando permisos...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si no está autenticado o no es super_admin, mostrar mensaje de acceso denegado
  if (!isUserAuthenticated || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">
                Solo los usuarios con rol de <strong>super_admin</strong> pueden acceder a esta página.
              </p>
              {user?.profile?.role && (
                <p className="text-sm text-gray-500">
                  Tu rol actual: <Badge variant="outline">{user.profile.role}</Badge>
                </p>
              )}
              <Button
                onClick={() => router.push('/auth/login?redirect=/admin')}
                className="w-full"
              >
                Ir al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-sm text-gray-400 mt-1">
              Bienvenido, {user?.profile?.full_name || user?.email} ({user?.profile?.role})
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="intro">Intro</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Sección Hero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Título</Label>
                  <Input
                    id="hero-title"
                    value={editedContent.hero.title}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        hero: { ...editedContent.hero, title: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtítulo</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={editedContent.hero.subtitle}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        hero: { ...editedContent.hero, subtitle: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label>Imágenes del Carrusel</Label>
                  {editedContent.hero.backgroundImages.map((image, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...editedContent.hero.backgroundImages]
                          newImages[index] = e.target.value
                          setEditedContent({
                            ...editedContent,
                            hero: { ...editedContent.hero, backgroundImages: newImages }
                          })
                          setHasChanges(true)
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImages = editedContent.hero.backgroundImages.filter((_, i) => i !== index)
                          setEditedContent({
                            ...editedContent,
                            hero: { ...editedContent.hero, backgroundImages: newImages }
                          })
                          setHasChanges(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setEditedContent({
                        ...editedContent,
                        hero: {
                          ...editedContent.hero,
                          backgroundImages: [...editedContent.hero.backgroundImages, ""]
                        }
                      })
                      setHasChanges(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Imagen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intro Tab */}
          <TabsContent value="intro">
            <Card>
              <CardHeader>
                <CardTitle>Sección Intro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="intro-title">Título</Label>
                  <Input
                    id="intro-title"
                    value={editedContent.intro.title}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        intro: { ...editedContent.intro, title: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="intro-description">Descripción</Label>
                  <Textarea
                    id="intro-description"
                    value={editedContent.intro.description}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        intro: { ...editedContent.intro, description: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Sección About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Título</Label>
                  <Input
                    id="about-title"
                    value={editedContent.about.title}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        about: { ...editedContent.about, title: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="about-description">Descripción</Label>
                  <Textarea
                    id="about-description"
                    value={editedContent.about.description}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        about: { ...editedContent.about, description: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label>Equipo</Label>
                  {editedContent.about.team.map((member, index) => (
                    <Card key={member.id} className="mt-4">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Nombre</Label>
                            <Input
                              value={member.name}
                              onChange={(e) => {
                                const newTeam = [...editedContent.about.team]
                                newTeam[index] = { ...newTeam[index], name: e.target.value }
                                setEditedContent({
                                  ...editedContent,
                                  about: { ...editedContent.about, team: newTeam }
                                })
                                setHasChanges(true)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Imagen</Label>
                            <Input
                              value={member.image}
                              onChange={(e) => {
                                const newTeam = [...editedContent.about.team]
                                newTeam[index] = { ...newTeam[index], image: e.target.value }
                                setEditedContent({
                                  ...editedContent,
                                  about: { ...editedContent.about, team: newTeam }
                                })
                                setHasChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const newTeam = editedContent.about.team.filter((_, i) => i !== index)
                                setEditedContent({
                                  ...editedContent,
                                  about: { ...editedContent.about, team: newTeam }
                                })
                                setHasChanges(true)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Descripción</Label>
                          <Textarea
                            value={member.description}
                            onChange={(e) => {
                              const newTeam = [...editedContent.about.team]
                              newTeam[index] = { ...newTeam[index], description: e.target.value }
                              setEditedContent({
                                ...editedContent,
                                about: { ...editedContent.about, team: newTeam }
                              })
                              setHasChanges(true)
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const newMember = {
                        id: Date.now().toString(),
                        name: "",
                        image: "",
                        description: ""
                      }
                      setEditedContent({
                        ...editedContent,
                        about: {
                          ...editedContent.about,
                          team: [...editedContent.about.team, newMember]
                        }
                      })
                      setHasChanges(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Miembro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Sección Servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services-title">Título</Label>
                  <Input
                    id="services-title"
                    value={editedContent.services.title}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        services: { ...editedContent.services, title: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label>Servicios</Label>
                  {editedContent.services.services.map((service, index) => (
                    <Card key={service.id} className="mt-4">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Título</Label>
                            <Input
                              value={service.title}
                              onChange={(e) => {
                                const newServices = [...editedContent.services.services]
                                newServices[index] = { ...newServices[index], title: e.target.value }
                                setEditedContent({
                                  ...editedContent,
                                  services: { ...editedContent.services, services: newServices }
                                })
                                setHasChanges(true)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Icono</Label>
                            <Input
                              value={service.icon}
                              onChange={(e) => {
                                const newServices = [...editedContent.services.services]
                                newServices[index] = { ...newServices[index], icon: e.target.value }
                                setEditedContent({
                                  ...editedContent,
                                  services: { ...editedContent.services, services: newServices }
                                })
                                setHasChanges(true)
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Descripción</Label>
                          <Textarea
                            value={service.description}
                            onChange={(e) => {
                              const newServices = [...editedContent.services.services]
                              newServices[index] = { ...newServices[index], description: e.target.value }
                              setEditedContent({
                                ...editedContent,
                                services: { ...editedContent.services, services: newServices }
                              })
                              setHasChanges(true)
                            }}
                          />
                        </div>
                        <div className="mt-4">
                          <Label>Precio</Label>
                          <Input
                            value={service.price || ""}
                            onChange={(e) => {
                              const newServices = [...editedContent.services.services]
                              newServices[index] = { ...newServices[index], price: e.target.value }
                              setEditedContent({
                                ...editedContent,
                                services: { ...editedContent.services, services: newServices }
                              })
                              setHasChanges(true)
                            }}
                          />
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newServices = editedContent.services.services.filter((_, i) => i !== index)
                              setEditedContent({
                                ...editedContent,
                                services: { ...editedContent.services, services: newServices }
                              })
                              setHasChanges(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const newService = {
                        id: Date.now().toString(),
                        title: "",
                        description: "",
                        icon: "Scissors",
                        price: ""
                      }
                      setEditedContent({
                        ...editedContent,
                        services: {
                          ...editedContent.services,
                          services: [...editedContent.services.services, newService]
                        }
                      })
                      setHasChanges(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Servicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Información del Negocio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-name">Nombre</Label>
                    <Input
                      id="business-name"
                      value={editedContent.business.name}
                      onChange={(e) => {
                        setEditedContent({
                          ...editedContent,
                          business: { ...editedContent.business, name: e.target.value }
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-phone">Teléfono</Label>
                    <Input
                      id="business-phone"
                      value={editedContent.business.phone}
                      onChange={(e) => {
                        setEditedContent({
                          ...editedContent,
                          business: { ...editedContent.business, phone: e.target.value }
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-email">Email</Label>
                    <Input
                      id="business-email"
                      value={editedContent.business.email}
                      onChange={(e) => {
                        setEditedContent({
                          ...editedContent,
                          business: { ...editedContent.business, email: e.target.value }
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-address">Dirección</Label>
                    <Input
                      id="business-address"
                      value={editedContent.business.address}
                      onChange={(e) => {
                        setEditedContent({
                          ...editedContent,
                          business: { ...editedContent.business, address: e.target.value }
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="business-description">Descripción</Label>
                  <Textarea
                    id="business-description"
                    value={editedContent.business.description}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        business: { ...editedContent.business, description: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp-message">Mensaje WhatsApp</Label>
                  <Textarea
                    id="whatsapp-message"
                    value={editedContent.business.whatsAppMessage || ""}
                    onChange={(e) => {
                      setEditedContent({
                        ...editedContent,
                        business: { ...editedContent.business, whatsAppMessage: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}