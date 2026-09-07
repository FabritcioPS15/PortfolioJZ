import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700']
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'José Luis Zelada | Consultor en Gestión del Talento Humano',
  description: 'Consultor especializado en gestión del talento humano, desarrollo organizacional y consultoría estratégica. Acompaño a personas y organizaciones hacia el éxito.',
  keywords: ['Gestión del Talento Humano', 'Liderazgo', 'Recursos Humanos', 'Consultoría', 'José Luis Zelada', 'Desarrollo Organizacional'],
  authors: [{ name: 'José Luis Zelada' }],
  creator: 'José Luis Zelada',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://joseluiszelada.pe',
    title: 'José Luis Zelada | Consultor en Gestión del Talento Humano',
    description: 'Consultor especializado en gestión del talento humano y desarrollo organizacional. Acompaño a personas y organizaciones hacia el éxito.',
    siteName: 'José Luis Zelada',
    images: [{
      url: '/og-image.jpg', // Recommend user to add this image
      width: 1200,
      height: 630,
      alt: 'José Luis Zelada',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'José Luis Zelada | Consultor en Gestión del Talento Humano',
    description: 'Consultor especializado en gestión del talento humano, desarrollo organizacional y consultoría estratégica.',
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
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F2440' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`light ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-white text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
