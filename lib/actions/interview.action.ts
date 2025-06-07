import { db } from '@/firebase/admin'

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

export const getLatestInterviews = async (
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> => {
  const { userId, limit = 20 } = params

  const interviews = await db
    .collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finalized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get()

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]
}

export const getInterviewById = async (
  id: string,
): Promise<Interview | null> => {
  const interview = await db.collection('interviews').doc(id).get()

  return interview.data() as Interview | null
}
