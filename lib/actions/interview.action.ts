'use server'

import { generateObject, generateText } from 'ai'
import { google } from '@ai-sdk/google'

import { feedbackSchema } from '@/constants'
import { fixMarkdownJSON } from '../utils'
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
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Generate a list of unique and versatile job interview questions for a voice-based mock interview.

Input:
- Role: ${role}
- Experience Level: ${level}
- Tech Stack: ${techstack}
- Question Focus: ${type} (behavioral, technical, or both)
- Number of Questions: ${amount}

Requirements:
- All questions must be answerable verbally — no written code, no whiteboarding.
- Focus on reasoning, explanation, practical judgment, and real-world scenarios.
- Make each question sound natural for a spoken interview.
- Avoid templates or repetitions across multiple runs — introduce randomness and variation.
- Do not include any formatting like bullet points, numbering, or markdown.
- Do **not** include special characters like / or * that might break a voice assistant.

Output:
- Output must be a **raw JSON array of strings**.
- Do not include any extra text or explanation outside the JSON array.
- Return the result as a plain JSON array of strings, like this:
  ["Question 1", "Question 2", "Question 3"]
- Do **not** include any explanation, introduction, or text outside the array.
`,
    })

    const rawJson = fixMarkdownJSON(text)
    const questions = JSON.parse(rawJson)

    const interview = {
      role,
      type,
      level,
      techstack,
      questions,
      userId,
      finalized: true,
      takenCount: 0,
      createdAt: new Date().toISOString(),
    }

    const interviewRef = await db.collection('interviews').add(interview)

    await updateUser({
      userId,
      incrementCreatedInterview: 1,
    })

    return { success: true, interviewId: interviewRef.id }
  } catch (error) {
    console.error('Creating interview error: ', error)

    return { success: false }
  }
}

export const createFeedback = async (params: CreateFeedbackParams) => {
  const { interviewId, userId, transcript } = params

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
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
Transcript:
${formattedTranscript}

Instructions:
1. Return **only** the following 5 evaluation categories in your final JSON:
   - Communication Skills
   - Technical Knowledge
   - Problem Solving
   - Cultural Fit
   - Confidence and Clarity
2. Each category must have:
   - name (string)
   - score (number between 0 and 100)
   - comment (string explanation, minimum 1 sentence)
3. You must also return:
   - totalScore (number, average of all category scores)
   - strengths (array of strings, based only on positive observations from the transcript)
   - areasForImprovement (array of strings, based only on issues actually mentioned)
   - finalAssessment (string, short summary of performance and fit)

Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
- **Communication Skills**: Clarity, articulation, structured responses.
- **Technical Knowledge**: Understanding of key concepts for the role.
- **Problem-Solving**: Ability to analyze problems and propose solutions.
- **Cultural & Role Fit**: Alignment with company values and job role.
- **Confidence & Clarity**: Confidence in responses, engagement, and clarity.

Scoring rules:
- Give 0 if the candidate gave **no answer**.
- Give <30 if the answer was vague, incorrect, or unclear.
- Only give scores >70 if the answer was structured, clear, and showed understanding.
- Do **not** invent positive traits unless explicitly present in the transcript.
- If a score is low due to missing data, explain that it was due to insufficient input.

Be honest, strict, and never assume. Focus only on what the candidate actually said.`,
      system:
        'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
    })

    const newFeedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    }

    const feedback = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .get()
    console.log('feedback: ', feedback.docs)
    const feedbackId = feedback.docs[0]?.id

    const feedbackRef = feedbackId
      ? db.collection('feedback').doc(feedbackId)
      : db.collection('feedback').doc()

    await feedbackRef.set(newFeedback)
    await updateInterview({
      interviewId,
      incrementTakenCount: 1,
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
      success: true,
    }
  } catch (error) {
    console.error('Error updating user interview limit: ', error)

    return {
      success: false,
    }
  }
}

export const updateInterview = async ({
  interviewId,
  incrementTakenCount,
}: UpdateInterviewParams) => {
  try {
    const interviewRef = db.collection('interviews').doc(interviewId)

    await interviewRef.update({
      takenCount: FieldValue.increment(incrementTakenCount),
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error updating interview: ', error)

    return {
      success: false,
    }
  }
}
