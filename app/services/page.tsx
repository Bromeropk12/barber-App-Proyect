import Header from "@/components/Header"
import Services from "@/components/services"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import { contentManager } from "@/lib/content-manager"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const content = contentManager.getContent()

  return {
    title: `Servicios - ${content.business.name}`,
    description: `Descubre nuestros servicios de barbería: ${content.services.services.map(s => s.title).join(', ')}`,
    openGraph: {
      title: `Servicios - ${content.business.name}`,
      description: `Descubre nuestros servicios de barbería: ${content.services.services.map(s => s.title).join(', ')}`,
      url: '/services',
      type: 'website',
    },
  }
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <Services />
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}