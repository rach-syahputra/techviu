import Image from 'next/image'

import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId } from '@/lib/actions/interview.action'
import InterviewCard from '@/components/InterviewCard'
import CTA from '@/components/CTA'

const HomePage = async () => {
  const user = await getCurrentUser()

  const userInterviews = await getInterviewsByUserId(user?.id || '')

  const hasInterviews = (userInterviews?.length || 0) > 0

  return (
    <>
      <section className="card-cta">
        <div className="flex max-w-lg flex-col gap-6">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>

          <CTA
            hasReachedInterviewSessionLimit={(user?.createdInterview || 0) >= 1}
          />

          <Image
            src="/robot.png"
            alt="robo-dude"
            width={400}
            height={400}
            className="max-sm:hidden"
          />
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                {...interview}
                hasReachedInterviewSessionLimit={
                  (user?.createdInterview || 0) >= 1
                }
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
    </>
  )
}

export default HomePage
