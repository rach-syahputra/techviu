import type { Metadata } from 'next'
import { Mona_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Techviu',
  description:
    'AI-powered platform to practice and perfect your mock interviews.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${monaSans.variable} ${monaSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
