'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from './ui/button'

interface CTAProps {
  hasReachedInterviewSessionLimit: boolean
}

const CTA = ({ hasReachedInterviewSessionLimit }: CTAProps) => {
  const router = useRouter()

  const handleCTAClick = () => {
    if (hasReachedInterviewSessionLimit) {
      toast.error(
        'You have reached interview session limit. Please create a new account.',
      )
    } else {
      router.push('/interview')
    }
  }
  return (
    <Button onClick={handleCTAClick} className="btn-primary max-sm:w-full">
      Start an Interview
    </Button>
  )
}

export default CTA
