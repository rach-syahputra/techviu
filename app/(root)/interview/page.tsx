import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/actions/auth.action'
import InterviewForm from '@/components/InterviewForm'

const InterviewPage = async () => {
  const user = await getCurrentUser()

  if ((user?.createdInterview || 0) >= 1) {
    redirect('/')
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-8 md:max-w-[556px]">
      <h3>Interview Generation</h3>

      <InterviewForm />
    </main>
  )
}

export default InterviewPage
