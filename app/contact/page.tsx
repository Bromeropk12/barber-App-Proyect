import Header from "@/components/Header"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import { contentManager } from "@/lib/content-manager"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const content = contentManager.getContent()

  return {
    title: `Contacto - ${content.business.name}`,
    description: content.contact.description,
    openGraph: {
      title: `Contacto - ${content.business.name}`,
      description: content.contact.description,
      url: '/contact',
      type: 'website',
    },
  }
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <Contact />
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}