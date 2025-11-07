import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Intro from "@/components/Intro"
import About from "@/components/About"
import Promo from "@/components/Promo"
import Testimonials from "@/components/Testimonials"
import OpeningHours from "@/components/OpeningHours"
import Services from "@/components/services"
import Gallery from "@/components/Gallery"
import Contact from "@/components/Contact"
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
      <Hero />
      <Intro />
      <About />
      <Promo/>
      <Testimonials />
      <OpeningHours />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}