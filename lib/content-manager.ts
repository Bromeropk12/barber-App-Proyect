// Sistema de gestión de contenido dinámico

import { BarberShopData, ContentUpdate } from '@/types/content'

const STORAGE_KEY = 'barber-shop-content'

// Datos por defecto (migramos el contenido estático aquí)
const defaultContent: BarberShopData = {
  hero: {
    title: "TU ESTILO COMIENZA EN NUESTRA SILLA",
    subtitle: "Gracias por confiar en nosotros para destacar tu imagen. En Brookings nos tomamos muy en serio tu apariencia. Tu satisfacción es nuestra prioridad.",
    backgroundImages: [
      "/ASSETS/hero-background/0.webp",
      "/ASSETS/hero-background/1.webp",
      "/ASSETS/hero-background/2.webp",
      "/ASSETS/hero-background/3.webp",
      "/ASSETS/hero-background/4.webp",
      "/ASSETS/hero-background/5.webp",
      "/ASSETS/hero-background/6.webp",
    ]
  },
  intro: {
    title: "¿Por qué elegir Brookings Barber?",
    description: "Transforma tu estilo con cortes impecables y una experiencia premium que solo Brookings Barber Shop puede ofrecer. No pierdas más tiempo, reserva ahora y luce como un rey en Brooklyn."
  },
  about: {
    title: "¿Qué nos diferencia?",
    description: "Vive una experiencia premium donde la tradición clásica se fusiona con detalles impecables. Nuestro equipo experto no solo perfecciona tu look, sino que redefine tu actitud. ¿Listo para lucir imparable? Reserva ahora y descubre por qué somos la barbería #1 en Brooklyn. ¡Tu mejor versión te espera! ✨",
    team: [
      {
        id: "1",
        name: "Rafael García",
        image: "/ASSETS/material/barberos/0.webp",
        description: "Rafael es un barbero maestro con más de 20 años de experiencia en la industria. Su pericia y atención al detalle lo convierten en una pieza clave de nuestro equipo."
      },
      {
        id: "2",
        name: "Sandra Guerrero",
        image: "/ASSETS/material/barberos/2.webp",
        description: "Sandra aporta un toque fresco y moderno a nuestro equipo de barbería. Le encanta crear estilos tan únicos como cada cliente individual."
      },
      {
        id: "3",
        name: "Maikol Colmenares",
        image: "/ASSETS/material/barberos/1.webp",
        description: "Con una pasión por los cortes clásicos, Maikol garantiza que cada cliente salga luciendo impecable y sintiéndose increíble."
      }
    ]
  },
  services: {
    title: "NUESTROS SERVICIOS",
    services: [
      {
        id: "mens-cuts",
        title: "CORTES DE CABALLERO",
        description: "Todas las formas y estilos posibles pueden hacerse realidad gracias a las técnicas avanzadas de estilismo que te ofrecemos ahora mismo.",
        icon: "Scissors",
        prices: [
          { type: "Estilo 1", price: "28" },
          { type: "Estilo 2", price: "38" },
          { type: "Estilo 3", price: "40" },
          { type: "Estilo 4", price: "38" },
          { type: "Estilo 5", price: "35" },
        ]
      },
      {
        id: "classic-shaving",
        title: "AFEITADO CLÁSICO",
        description: "Un look limpio y prolijo es garantía de éxito en todo lo que hagas. Prueba nuestra experiencia especial de afeitado real y disfruta del resultado.",
        icon: "Razor",
        price: "10"
      },
      {
        id: "shape-up",
        title: "ARREGLO DE BARBA",
        description: "Encontrar la forma perfecta para tu vello facial puede ser complicado, pero nuestros especialistas se aseguran de que logres un resultado cómodo y espectacular.",
        icon: "Droplet",
        price: "20"
      },
      {
        id: "hot-towel-shaving",
        title: "AFEITADO CON TOALLA CALIENTE",
        description: "Si te gusta el estilo retro, opta por un afeitado con toalla caliente. El vapor te envolverá en comodidad mientras relaja y limpia los poros al mismo tiempo.",
        icon: "Clock",
        price: "35"
      },
      {
        id: "beard-trims",
        title: "RECORTE DE BARBA",
        description: "Haz que tu barba luzca increíble con unos pocos movimientos precisos. Nuestros especialistas saben lo que está en tendencia y pueden hacer maravillas con tu vello facial.",
        icon: "Scissors",
        price: "20"
      },
      {
        id: "clipper-cuts",
        title: "CORTES CON MÁQUINA",
        description: "Si prefieres un cabello completamente corto que requiera mínimo mantenimiento, los cortes con máquina son ideales para ti. Podemos demostrar que lo simple también puede ser elegante.",
        icon: "Razor",
        price: "20"
      }
    ],
    offers: [
      {
        id: "promo-1-1",
        title: "PROMO 1+1 (BRO + BRO)",
        description: "Trae a un amigo y obtengan un corte juntos a un precio espectacular. Una excelente oportunidad para traer a tu hermano o a tu hijo.",
        icon: "Users",
        price: "60"
      },
      {
        id: "gift-card",
        title: "TARJETA DE REGALO ESPECIAL",
        description: "Corte de cabello y Afeitado Real con Toalla Caliente. Perfecto para las festividades.",
        icon: "DollarSign",
        price: "55"
      }
    ]
  },
  testimonials: {
    title: "EXPERIENCIAS DE NUESTROS CLIENTES",
    testimonials: [
      {
        id: "1",
        name: "Carlos M.",
        image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
        text: "Increíble experiencia. El corte de pelo y el arreglo de barba fueron perfectos. Ambiente relajado y profesional.",
        rating: 5
      },
      {
        id: "2",
        name: "Javier R.",
        image: "https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        text: "La mejor barbería de la ciudad. El servicio de afeitado con navaja es insuperable. Volveré seguro.",
        rating: 5
      },
      {
        id: "3",
        name: "Alejandro G.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        text: "Excelente atención y resultados. Me encanta cómo queda mi barba después de cada visita.",
        rating: 4
      },
      {
        id: "4",
        name: "Miguel Á.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        text: "Ambiente muy masculino y relajado. Los barberos son verdaderos artistas. Altamente recomendado.",
        rating: 5
      },
      {
        id: "5",
        name: "Roberto S.",
        image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        text: "Servicio de primera. El masaje de cuero cabelludo es una experiencia que hay que probar.",
        rating: 4
      }
    ]
  },
  gallery: {
    title: "NUESTRA GALERÍA",
    description: "Explora nuestra colección de estilos y cortes de cabello",
    images: [
      "/ASSETS/material/gallery1.jpg",
      "/ASSETS/material/gallery2.jpg",
      "/ASSETS/material/gallery3.jpg",
      "/ASSETS/material/gallery4.jpg",
      "/ASSETS/material/gallery5.jpg",
      "/ASSETS/material/gallery6.jpg",
      "/ASSETS/material/gallery7.jpg",
      "/ASSETS/material/gallery8.jpg",
      "/ASSETS/material/gallery9.jpg",
      "/ASSETS/material/gallery10.jpg",
      "/ASSETS/material/gallery11.jpg",
      "/ASSETS/material/gallery12.jpg"
    ]
  },
  contact: {
    title: "CONTÁCTANOS",
    description: "Visítanos en Brooklyn, NY en 1675 79th St, o déjanos tu opinión sobre nuestra página web.",
    address: "1675 79th St, Brooklyn, NY 11214, USA",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.7471547492633!2d-73.99887518459578!3d40.61340707934112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2444a812fd823%3A0x4bbdfe04cc4ad5c2!2s1675%2079th%20St%2C%20Brooklyn%2C%20NY%2011214%2C%20USA!5e0!3m2!1sen!2sdo!4v1599299403226!5m2!1sen!2sdo"
  },
  business: {
    name: "Brookings Barber",
    description: "Transforma tu estilo con Brookings Barber Shop: cortes impecables, experiencia premium y un toque de realeza.",
    phone: "573103395588",
    address: "1675 79th St, Brooklyn, NY 11214, USA",
    email: "info@brookingsbarber.com",
    socialLinks: {
      facebook: "https://www.facebook.com/profile.php?id=61562333762828",
      instagram: "https://www.instagram.com/brookingsbarber/",
      tiktok: "https://www.tiktok.com/@brookingsbarber"
    },
    hours: [
      { days: "Lunes a Jueves", time: "10:00 AM - 8:00 PM" },
      { days: "Viernes y Sábado", time: "10:00 AM - 9:00 PM" },
      { days: "Domingo", time: "10:00 AM - 6:00 PM" }
    ]
  }
}

class ContentManager {
  private content: BarberShopData = defaultContent

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          this.content = { ...defaultContent, ...JSON.parse(stored) }
        }
      } catch (error) {
        console.error('Error loading content from storage:', error)
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.content))
      } catch (error) {
        console.error('Error saving content to storage:', error)
      }
    }
  }

  getContent(): BarberShopData {
    return this.content
  }

  updateContent(update: ContentUpdate): void {
    this.content = {
      ...this.content,
      [update.section]: update.data
    }
    this.saveToStorage()
  }

  resetToDefault(): void {
    this.content = defaultContent
    this.saveToStorage()
  }

  exportData(): string {
    return JSON.stringify(this.content, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData)
      this.content = { ...defaultContent, ...parsed }
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

export const contentManager = new ContentManager()