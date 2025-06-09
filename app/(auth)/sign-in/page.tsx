import { Metadata } from 'next'

import { CLIENT_BASE_URL } from '@/constants'
import AuthForm from '@/components/AuthForm'

export const metadata: Metadata = {
  title: 'Sign In - Techviu',
  description:
    'Sign in to Techviu to start your AI-powered interview and get instant feedback.',
  openGraph: {
    title: 'Sign In - Techviu',
    description:
      'Sign in to Techviu to start your AI-powered interview and get instant feedback.',

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

const SignInPage = () => {
  return <AuthForm type="sign-in" />
}

export default SignInPage
