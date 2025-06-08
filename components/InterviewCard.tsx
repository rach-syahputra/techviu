'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { Calendar, Star } from 'lucide-react'

import { getFeedbackByInterviewId } from '@/lib/actions/interview.action'
import { Button } from './ui/button'
import DisplayTechIcons from './DisplayTechIcons'
import InterviewCardSkeleton from './InterviewCardSkeleton'

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
  hasReachedInterviewSessionLimit,
}: InterviewCardProps) => {
  const router = useRouter()
  const { theme } = useTheme()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [date, setDate] = useState<string>('')

  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type

  const getFeedback = async () => {
    setFeedback(
      userId && id
        ? await getFeedbackByInterviewId({ interviewId: id, userId })
        : null,
    )
    setDate(
      dayjs(feedback?.createdAt || createdAt || Date.now()).format(
        'MMM D, YYYY',
      ),
    )
    setIsLoading(false)
  }

  const handleInterviewClick = () => {
    if (!feedback && hasReachedInterviewSessionLimit) {
      toast.error(
        'You have reached interview session limit. Please create a new account.',
      )
    } else {
      router.push(feedback ? `/interview/${id}/feedback` : `/interview/${id}`)
    }
  }

  useEffect(() => {
    getFeedback()
  }, [])

  return !isLoading ? (
    <div className="card-border min-h-96 w-[360px] max-sm:w-full">
      <div className="card-interview">
        <div>
          <div className="bg-light-100 absolute top-0 right-0 w-fit rounded-bl-lg px-4 py-2">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={theme === 'light' ? '/logo-light.png' : '/logo.png'}
            alt="cover image"
            width={90}
            height={86}
            className="aspect-auto w-[90px]"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="mt-3 flex flex-row gap-5">
            <div className="flex flex-row items-center gap-2">
              <Calendar
                size={22}
                className="text-dark-100 dark:text-light-100"
              />

              <p>{date}</p>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Star size={22} className="text-dark-100 dark:text-light-100" />

              <p>{feedback?.totalScore || '---'}/100</p>
            </div>
          </div>

          <p className="mt-5 line-clamp-2">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button onClick={handleInterviewClick} className="btn-primary">
            {feedback ? 'View Feedback' : 'Start Interview'}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <InterviewCardSkeleton />
  )
}

export default InterviewCard
