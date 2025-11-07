import type { Metadata } from "next"
import { Lora } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from "@/components/ErrorBoundary"

const lora = Lora({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brookings Barber",
  description:
    "Transforma tu estilo con Brookings Barber Shop: cortes impecables, experiencia premium y un toque de realeza. No pierdas tiempo, reserva ahora y conquista el día.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={lora.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
