import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CLIENT_BASE_URL, INTERVIEW_SESSION_LIMIT } from '@/constants'
import { getInterviewById } from '@/lib/actions/interview.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import DisplayTechIcons from '@/components/DisplayTechIcons'
import Agent from '@/components/Agent'

export const generateMetadata = async ({
  params,
}: RouteParams): Promise<Metadata> => {
  const { id } = await params
  const interview = await getInterviewById(id)
  const title = interview?.role ? `${interview?.role} Interview` : 'Interview'

  return {
    title,
    description:
      'AI-powered platform to practice and perfect your mock interviews.',
    openGraph: {
      title,
      description:
        'AI-powered platform to practice and perfect your mock interviews.',

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
}

const InterviewSessionPage = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()

  const interview = await getInterviewById(id)

  if (!interview || (interview?.takenCount || 0) >= INTERVIEW_SESSION_LIMIT)
    redirect('/')

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row items-center gap-4 max-sm:flex-col">
          <h3 className="capitalize">{interview.role} Interview</h3>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="text-p-300 h-fit rounded-lg px-4 py-2 font-semibold uppercase">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name || ''}
        userId={user?.id}
        interviewId={id}
        questions={interview.questions}
      />
    </>
  )
}

export default InterviewSessionPage
