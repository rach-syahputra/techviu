import Image from 'next/image'

import { cn } from '@/lib/utils'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED
  const isSpeaking = true
  const messages = [
    'Whats your name?',
    'My name is John Doe, nice to meet you!',
  ]
  const lastMessage = messages.at(-1)

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>Ai Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="size-[120px] rounded-full object-cover"
            />
            <h3>Username</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                'opacity-0 transition-opacity duration-500',
                'aniamte-fadeIn opacity-100',
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex w-full justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call relative">
            <span
              className={cn('absokute animate-ping rounded-full opacity-75', {
                hidden: callStatus !== CallStatus.CONNECTING,
              })}
            />
            <span>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? 'Call'
                : '...'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  )
}

export default Agent
