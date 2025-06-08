import { Skeleton } from './ui/skeleton'

const InterviewCardSkeleton = () => {
  return (
    <div className="card-border min-h-96 w-[360px] max-sm:w-full">
      <div className="card-interview">
        <div className="flex h-full min-h-72 w-full flex-col gap-4">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex w-1/2 items-center gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  )
}

export default InterviewCardSkeleton
