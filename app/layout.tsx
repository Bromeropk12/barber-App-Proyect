import type { Metadata } from "next"
import { Lora } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from "@/components/ErrorBoundary"
import { ContentProvider } from "@/contexts/ContentContext"
import { contentManager } from "@/lib/content-manager"

const lora = Lora({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const content = contentManager.getContent()

  return {
    title: content.business.name,
    description: content.business.description,
    keywords: ["barbería", "cortes de cabello", "afeitado", "Brooklyn", "barber shop"],
    authors: [{ name: content.business.name }],
    creator: content.business.name,
    publisher: content.business.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://brookingsbarber.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: content.business.name,
      description: content.business.description,
      url: 'https://brookingsbarber.com',
      siteName: content.business.name,
      locale: 'es_CO',
      type: 'website',
      images: [
        {
          url: '/ASSETS/material/logo.png',
          width: 1200,
          height: 630,
          alt: `${content.business.name} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.business.name,
      description: content.business.description,
      images: ['/ASSETS/material/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = contentManager.getContent()

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": content.business.name,
              "description": content.business.description,
              "url": "https://brookingsbarber.com",
              "telephone": content.business.phone,
              "email": content.business.email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": content.business.address,
                "addressLocality": "Brooklyn",
                "addressRegion": "NY",
                "postalCode": "11214",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.6134,
                "longitude": -73.9989
              },
              "openingHours": content.business.hours.map(h => `Mo-Th ${h.time}, Fr-Sa ${h.time}, Su ${h.time}`),
              "priceRange": "$$",
              "image": "/ASSETS/material/logo.png",
              "sameAs": [
                content.business.socialLinks.facebook,
                content.business.socialLinks.instagram,
                content.business.socialLinks.tiktok
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Barbería",
                "itemListElement": content.services.services.map(service => ({
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": service.title,
                    "description": service.description
                  }
                }))
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": content.testimonials.testimonials.length.toString()
              }
            })
          }}
        />
      </head>
      <body className={lora.className}>
        <ContentProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ContentProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
