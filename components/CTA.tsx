'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import Button from './Button'

interface CTAProps {
  isAuthenticated: boolean
  hasReachedInterviewGenerationLimit: boolean
}

const CTA = ({
  isAuthenticated,
  hasReachedInterviewGenerationLimit,
}: CTAProps) => {
  const router = useRouter()

  const handleCTAClick = () => {
    if (!isAuthenticated) {
      toast('Sign in to start an interview')
      router.push('/sign-in')
    } else if (hasReachedInterviewGenerationLimit) {
      toast.error(
        'You have reached interview session limit. Please create a new account.',
      )
    } else {
      router.push('/interview')
    }
  }
  return <Button onClick={handleCTAClick}>Start an Interview</Button>
}

export default CTA
