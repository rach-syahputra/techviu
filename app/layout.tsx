import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

import { CLIENT_BASE_URL } from '@/constants'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Techviu',
  description:
    'AI-powered platform to practice and perfect your mock interviews.',
  openGraph: {
    title: 'Techviu',
    description:
      'AI-powered platform to practice and perfect your mock interviews.',

    type: 'website',
    siteName: 'AI-Powered Interview',
    images: [
      {
        url: '/open-graph.png',
        secureUrl: '/open-graph.png',
        width: 1200,
        height: 630,
        alt: 'AI-Powered Interview',
      },
    ],
  },
  metadataBase: new URL(CLIENT_BASE_URL),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${plusJakartaSans.variable} font-plus-jakarta-sans antialiased`}
      >
        {children}

        <Toaster />
      </body>
    </html>
  )
}
