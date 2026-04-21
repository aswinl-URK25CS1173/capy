import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: '7 NENI TURF | Cricket & Football Turf Booking – Chennai',
  description: '7 NENI TURF is Chennai\'s premium cricket and football turf booking destination. Reserve slots instantly, pay securely, and play where champions are made.',
  keywords: '7 NENI TURF, turf booking Chennai, cricket turf Chennai, football turf Chennai, sports turf Anna Nagar, turf booking online',
  openGraph: {
    title: '7 NENI TURF | Cricket & Football Turf Booking – Chennai',
    description: 'Book cricket and football slots instantly at 7 NENI TURF in Chennai. Premium turf, instant confirmation, champion-level atmosphere.',
    locale: 'en_IN',
    siteName: '7 NENI TURF',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#05060a', color: '#f1f5f9' }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#181b27',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#3b82f6', secondary: '#0a0a0f' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' } },
          }}
        />
      </body>
    </html>
  )
}
