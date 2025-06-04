import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import './globals.css';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Intervium',
  description:
    'AI-powered platform to practice and perfect your mock interviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.variable} ${monaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
