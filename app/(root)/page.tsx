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
        <div className="flex w-full flex-col justify-between gap-8 max-lg:items-center lg:flex-row lg:gap-6">
          <div className="flex max-w-lg flex-col gap-6">
            <h2>Smarter Tech Interviews with AI</h2>
            <p className="text-lg">
              Practice real interview questions tailored to your role,
              experience level, and tech stack. Get immediate, AI-powered
              feedback to improve faster and build interview confidence.
            </p>

            <CTA
              isAuthenticated={!!user}
              hasReachedInterviewGenerationLimit={
                (user?.createdInterview || 0) >= 1
              }
            />
          </div>

          <Image
            src="/hero.png"
            alt="tech-interview"
            width={600}
            height={620.45}
            className="aspect-auto w-[300px] object-cover"
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
                  (user?.takenInterview || 0) >= 2
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
