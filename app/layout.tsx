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
  title: 'Invisalign Dentists - Expert Referral Network',
  description: 'Connecting discerning patients with the top 1% of Platinum Invisalign providers for verified orthodontic results.',
  keywords: ['invisalign', 'dentist', 'orthodontics', 'clear aligners', 'platinum provider', 'UK'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>{children}</body>
    </html>
  )
}
