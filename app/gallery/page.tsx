import Header from "@/components/Header"
import Gallery from "@/components/Gallery"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import { contentManager } from "@/lib/content-manager"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const content = contentManager.getContent()

  return {
    title: `Galería - ${content.business.name}`,
    description: content.gallery.description,
    openGraph: {
      title: `Galería - ${content.business.name}`,
      description: content.gallery.description,
      url: '/gallery',
      type: 'website',
    },
  }
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <Gallery />
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}