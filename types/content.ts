// Tipos de datos para el sistema de contenido dinámico

export interface HeroData {
  title: string
  subtitle: string
  backgroundImages: string[]
}

export interface IntroData {
  title: string
  description: string
}

export interface TeamMember {
  id: string
  name: string
  image: string
  description: string
}

export interface AboutData {
  title: string
  description: string
  team: TeamMember[]
}

export interface ServicePrice {
  type: string
  price: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  prices?: ServicePrice[]
  price?: string
}

export interface ServicesData {
  title: string
  services: Service[]
  offers: Service[]
}

export interface Testimonial {
  id: string
  name: string
  image: string
  text: string
  rating: number
}

export interface TestimonialsData {
  title: string
  testimonials: Testimonial[]
}

export interface GalleryData {
  title: string
  description: string
  images: string[]
}

export interface ContactData {
  title: string
  description: string
  address: string
  mapUrl: string
}

export interface BusinessInfo {
  name: string
  description: string
  phone: string
  address: string
  email: string
  whatsAppMessage?: string
  socialLinks: {
    facebook: string
    instagram: string
    tiktok: string
  }
  hours: {
    days: string
    time: string
  }[]
}

export interface BarberShopData {
  hero: HeroData
  intro: IntroData
  about: AboutData
  services: ServicesData
  testimonials: TestimonialsData
  gallery: GalleryData
  contact: ContactData
  business: BusinessInfo
}

// Tipos para administración
export interface ContentUpdate {
  section: keyof BarberShopData
  data: any
}

export interface AdminCredentials {
  username: string
  password: string
}