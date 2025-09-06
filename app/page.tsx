import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Intro from "@/components/Intro"
import Testimonials from "@/components/Testimonials"
import About from "@/components/About"
import Promo from "@/components/Promo"
import OpeningHours from "@/components/OpeningHours"
import Services from "@/components/services"
import Gallery from "@/components/Gallery"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Home() {
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
      <WhatsAppButton phoneNumber="573103395588" />
    </main>
  )
}
