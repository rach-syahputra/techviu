import Image from 'next/image'
import Link from 'next/link'

import { getCurrentUser } from '@/lib/actions/auth.action'
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from '@/lib/actions/interview.action'
import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'

const HomePage = async () => {
  const user = await getCurrentUser()

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id || ''),
    await getLatestInterviews({ userId: user?.id || '' }),
  ])

  const hasPastInterviews = (userInterviews?.length || 0) > 0
  const hasUpcomingInterviews = (latestInterviews?.length || 0) > 0

  return (
    <>
      <section className="card-cta">
        <div className="flex max-w-lg flex-col gap-6">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>

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
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no interviews available.</p>
          )}
        </div>
      </section>
    </>
  )
}

export default HomePage
