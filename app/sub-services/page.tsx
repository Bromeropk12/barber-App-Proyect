import SubServices from '@/components/sub-services'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import { contentManager } from "@/lib/content-manager"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const content = contentManager.getContent()

  return {
    title: `Servicios Detallados - ${content.business.name}`,
    description: "Descubre todos nuestros servicios de barbería con precios detallados y ofertas especiales.",
    openGraph: {
      title: `Servicios Detallados - ${content.business.name}`,
      description: "Descubre todos nuestros servicios de barbería con precios detallados y ofertas especiales.",
      url: '/sub-services',
      type: 'website',
    },
  }
}

export default function SubServicesPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <SubServices />
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}