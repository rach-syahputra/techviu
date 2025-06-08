import dayjs from 'dayjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, Star } from 'lucide-react'

import { getCurrentUser } from '@/lib/actions/auth.action'
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from '@/lib/actions/interview.action'
import { Button } from '@/components/ui/button'

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()

  const interview = await getInterviewById(id)
  if (!interview) redirect('/')

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id || '',
  })

  const hasReachedInterviewSessionLimit = (user?.createdInterview || 0) >= 1

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the <span className="capitalize">{interview.role}</span>{' '}
          Interview
        </h1>
      </div>

      <div className="flex flex-row sm:justify-center">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-row items-center gap-2">
            <Star size={20} className="text-dark-100 dark:text-light-100" />
            <p>
              Overall Impression:{' '}
              <span className="dark:text-primary-200 text-dark-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Calendar size={20} className="text-dark-100 dark:text-light-100" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} (<strong>{category.score}</strong>
              /100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="flex w-full gap-4 max-sm:flex-col max-sm:items-center md:grid md:grid-cols-2">
        <Button className="btn-secondary w-full flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-center text-sm font-semibold">Back to Home</p>
          </Link>
        </Button>

        {!hasReachedInterviewSessionLimit && (
          <Button className="btn-primary w-full flex-1">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center"
            >
              <p className="text-center text-sm font-semibold text-black">
                Retake Interview
              </p>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}

export default FeedbackPage
