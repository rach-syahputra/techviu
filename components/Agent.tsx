'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User } from 'lucide-react'
import { toast } from 'sonner'

import { interviewer } from '@/constants'
import { cn } from '@/lib/utils'
import { vapi } from '@/lib/vapi'
import { createFeedback } from '@/lib/actions/interview.action'
import LoadingOverlay from './LoadingOverlay'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant'
  content: string
}

const Agent = ({
  userName,
  userId,
  type,
  questions,
  interviewId,
}: AgentProps) => {
  const router = useRouter()

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)

    if (type === 'generate') {
      vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
      )
    } else {
      let formattedQuestions = ''
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join('\n')
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      })
    }
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()
  }

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    setIsGeneratingFeedback(true)

    const { success, feedbackId } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    })

    if (success && feedbackId) {
      router.push(`/interview/${interviewId}/feedback`)
    } else {
      toast.error('Something went wrong when generating feedback')
      router.push('/')
    }

    setIsGeneratingFeedback(false)
  }

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript }

        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = (error: Error) => console.log('Error: ', error)

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  }, [])

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        router.push('/')
      } else {
        handleGenerateFeedback(messages)
      }
    }
  }, [messages, callStatus, type, userId])

  const lastMessage = messages[messages.length - 1]?.content
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

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
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <div className="user-image">
              <User size={80} className="dark:text-light-100 text-dark-200" />
            </div>
            <h3>{userName}</h3>
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
        {callStatus !== 'ACTIVE' ? (
          <button
            onClick={handleCall}
            disabled={!isCallInactiveOrFinished}
            className="btn-call relative"
          >
            <span
              className={cn('absolute animate-ping rounded-full opacity-75', {
                hidden: callStatus !== 'CONNECTING',
              })}
            />
            <span>{isCallInactiveOrFinished ? 'Call' : '...'}</span>
          </button>
        ) : (
          <button onClick={handleDisconnect} className="btn-disconnect">
            End
          </button>
        )}
      </div>

      <LoadingOverlay open={isGeneratingFeedback} />
    </>
  )
}

export default Agent
