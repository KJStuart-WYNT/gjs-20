import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'GJS 20th Year Celebration - You\'re Invited',
  description: 'Join the GJS Property Team for our 20th year celebration! An evening of celebration, connection, and cheers to two decades of excellence.',
  keywords: 'GJS Property, 20th anniversary, celebration, event, Sydney, real estate',
  authors: [{ name: 'GJS Property Team' }],
  creator: 'GJS Property',
  publisher: 'GJS Property',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gjs-20.vercel.app'),
  openGraph: {
    title: 'GJS 20th Year Celebration - You\'re Invited',
    description: 'Join the GJS Property Team for our 20th year celebration! An evening of celebration, connection, and cheers to two decades of excellence.',
    url: 'https://gjs-20.vercel.app',
    siteName: 'GJS 20th Year Celebration',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GJS 20th Year Celebration Invitation',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GJS 20th Year Celebration - You\'re Invited',
    description: 'Join the GJS Property Team for our 20th year celebration!',
    images: ['/og-image.jpg'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}