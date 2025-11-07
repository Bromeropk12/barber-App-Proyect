import Header from "@/components/Header"
import About from "@/components/About"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import { contentManager } from "@/lib/content-manager"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const content = contentManager.getContent()

  return {
    title: `Sobre Nosotros - ${content.business.name}`,
    description: content.about.description,
    openGraph: {
      title: `Sobre Nosotros - ${content.business.name}`,
      description: content.about.description,
      url: '/about',
      type: 'website',
    },
  }
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <About />
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}