import InterviewForm from '@/components/InterviewForm'

const InterviewPage = async () => {
  return (
    <main className="mx-auto flex w-full flex-col gap-8 md:max-w-[556px]">
      <h3>Interview Generation</h3>

      <InterviewForm />
    </main>
  )
}

export default InterviewPage
