"use client"

import AuthGuard from '@/components/AuthGuard'
import ReservationWizard from '@/components/reservation/ReservationWizard'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import { contentManager } from "@/lib/content-manager"

export default function ReservationsPage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <Header />
      <AuthGuard
        required={true}
        roles={['cliente']}
        inline={false}
        fallback={
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h1>
              <p className="text-gray-400 mb-6">Solo los clientes autenticados pueden hacer reservas.</p>
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="bg-accent-color text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Iniciar Sesión como Cliente
              </button>
            </div>
          </div>
        }
      >
        <ReservationWizard />
      </AuthGuard>
      <Footer />
      <WhatsAppButton phoneNumber={contentManager.getContent().business.phone} />
    </main>
  )
}