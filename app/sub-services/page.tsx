import SubServices from '@/components/sub-services'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function SubServicesPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <SubServices />
      <Footer />
      <WhatsAppButton phoneNumber="573103395588" />
    </main>
  )
}