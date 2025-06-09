'use server'

import { generateObject, generateText } from 'ai'
import { google } from '@ai-sdk/google'

import { feedbackSchema } from '@/constants'
import { db } from '@/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export const getInterviewsByUserId = async (
  userId: string,
): Promise<Interview[] | null> => {
  const interviews = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]
}

// GET INTERVIEWS BY OTHER USERS
//
// export const getLatestInterviews = async (
//   params: GetLatestInterviewsParams,
// ): Promise<Interview[] | null> => {
//   const { userId, limit = 20 } = params

//   const interviews = await db
//     .collection('interviews')
//     .orderBy('createdAt', 'desc')
//     .where('finalized', '==', true)
//     .where('userId', '!=', userId)
//     .limit(limit)
//     .get()

//   return interviews.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Interview[]
// }

export const getInterviewById = async (
  id: string,
): Promise<Interview | null> => {
  const interview = await db.collection('interviews').doc(id).get()

  return interview.data() as Interview | null
}

export const createInterview = async (params: InterviewFormProps) => {
  const { type, role, level, techstack, amount, userId } = params

  try {
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    })

    const interview = {
      role,
      type,
      level,
      techstack,
      questions: JSON.parse(questions),
      userId,
      finalized: true,
      createdAt: new Date().toISOString(),
    }

    await db.collection('interviews').add(interview)
    await updateUser({
      userId,
      incrementCreatedInterview: 1,
    })

    return { success: true }
  } catch (error) {
    console.error(error)

    return { success: false }
  }
}

export const createFeedback = async (params: CreateFeedbackParams) => {
  const { interviewId, userId, transcript, feedbackId } = params

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`,
      )
      .join('')

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
    })

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    }

    let feedbackRef

    if (feedbackId) {
      feedbackRef = db.collection('feedback').doc(feedbackId)
    } else {
      feedbackRef = db.collection('feedback').doc()
    }

    await feedbackRef.set(feedback)
    await updateUser({
      userId,
      incrementTakenInterview: 1,
    })

    return { success: true, feedbackId: feedbackRef.id }
  } catch (error) {
    console.error('Error saving feedback:', error)
    return { success: false }
  }
}

export const getFeedbackByInterviewId = async (
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> => {
  const { interviewId, userId } = params

  const feedback = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .limit(1)
    .get()

  if (feedback.empty) return null

  const feedbackDoc = feedback.docs[0]

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback
}

export const updateUser = async ({
  userId,
  incrementCreatedInterview,
  incrementTakenInterview,
}: UpdateUserParams) => {
  try {
    const userRef = db.collection('users').doc(userId)

    const updates: Record<string, any> = {}

    if (incrementCreatedInterview)
      updates.createdInterview = FieldValue.increment(incrementCreatedInterview)
    if (incrementTakenInterview)
      updates.takenInterview = FieldValue.increment(incrementTakenInterview)

    await userRef.update(updates)

    return {
      success: false,
    }
  } catch (error) {
    console.error('Error updating user interview limit: ', error)

    return {
      success: false,
    }
  }
}
