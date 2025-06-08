import { redirect } from 'next/navigation'

import { getInterviewById } from '@/lib/actions/interview.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import DisplayTechIcons from '@/components/DisplayTechIcons'
import Agent from '@/components/Agent'

const InterviewSessionPage = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()

  const interview = await getInterviewById(id)

  if (!interview) redirect('/')

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row items-center gap-4 max-sm:flex-col">
          <h3 className="capitalize">{interview.role} Interview</h3>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="dark:bg-dark-200 bg-light-100 h-fit rounded-lg px-4 py-2 capitalize">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name || ''}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </>
  )
}

export default InterviewSessionPage
