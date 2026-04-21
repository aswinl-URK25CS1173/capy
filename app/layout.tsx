import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'GreenField Sports Arena | Cricket & Football Turf Booking – Chennai',
  description: "Chennai's premier Cricket & Football turf. Book your slot online in real-time with instant confirmation and secure UPI/Card payment. Located in Anna Nagar.",
  keywords: 'turf booking Chennai, cricket ground Chennai, football ground Anna Nagar, box cricket booking, turf booking online',
  openGraph: {
    title: 'GreenField Sports Arena',
    description: 'Book your cricket or football slot instantly. Real-time availability.',
    locale: 'en_IN',
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
            success: { iconTheme: { primary: '#22c55e', secondary: '#0a0a0f' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' } },
          }}
        />
      </body>
    </html>
  )
}
