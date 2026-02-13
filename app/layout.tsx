import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://invisaligndentists.com'),

  title: {
    default: 'Invisalign Dentists | Find Platinum Invisalign Providers',
    template: '%s | Invisalign Dentists',
  },

  description:
    'Connecting discerning patients with the top 1% of Platinum Invisalign providers for verified orthodontic results across the UK.',

  keywords: [
    'invisalign',
    'invisalign dentist',
    'platinum invisalign provider',
    'clear aligners UK',
    'orthodontics UK',
  ],

  authors: [{ name: 'Invisalign Dentists' }],
  creator: 'Invisalign Dentists',
  publisher: 'Invisalign Dentists',

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },

  openGraph: {
    type: 'website',
    url: 'https://invisaligndentists.com',
    title: 'Invisalign Dentists | Platinum Invisalign Referral Network',
    description:
      'Find elite Invisalign providers across the UK. Verified results. Trusted specialists.',
    siteName: 'Invisalign Dentists',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Invisalign Dentists Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Invisalign Dentists | Platinum Invisalign Providers',
    description:
      'Connecting patients with the top Invisalign specialists across the UK.',
    images: ['/icon-512x512.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
