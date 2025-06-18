import Image from 'next/image'

import {
  INTERVIEW_GENERATION_LIMIT,
  INTERVIEW_SESSION_LIMIT,
} from '@/constants'
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
        <div className="flex w-full flex-col justify-between gap-8 max-lg:items-center md:grid md:grid-cols-5 lg:gap-6">
          <div className="flex flex-col gap-6 md:col-span-3">
            <h2 className="text-4xl font-bold">AI-Powered Tech Interview</h2>
            <p className="text-lg">
              Practice real interview questions tailored to your role,
              experience level, and tech stack. Get immediate, AI-powered
              feedback to improve faster and build interview confidence.
            </p>

            <CTA
              isAuthenticated={!!user}
              hasReachedInterviewGenerationLimit={
                (user?.createdInterview || 0) >= INTERVIEW_GENERATION_LIMIT
              }
            />
          </div>

          <Image
            src="/robot-2.png"
            alt="robot"
            width={600}
            height={620.45}
            className="aspect-auto w-[280px] place-self-center object-cover pt-4 md:col-span-2 lg:place-self-end"
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
                  (interview.takenCount || 0) >= INTERVIEW_SESSION_LIMIT
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
