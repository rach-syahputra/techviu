import LoadingSpinner from './LoadingSpinner'

interface LoadingOverlayProps {
  open: boolean
}

const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  return open ? (
    <div className="bg-dark-20 fixed top-0 left-0 flex h-full w-full items-center justify-center">
      <div className="card z-50 flex min-h-fit flex-col items-center justify-center gap-2 px-8 py-4">
        <LoadingSpinner />
        <p>Generating Feedback</p>
      </div>
      <div className="bg-dark-200 absolute top-0 left-0 z-40 h-full w-full opacity-40" />
    </div>
  ) : null
}

export default LoadingOverlay
