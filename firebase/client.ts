import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDDtwrjmd6JZJEuF-EtUQv3gLKe0M1hC2c',
  authDomain: 'intervium-92100.firebaseapp.com',
  projectId: 'intervium-92100',
  storageBucket: 'intervium-92100.firebasestorage.app',
  messagingSenderId: '848356695438',
  appId: '1:848356695438:web:82d9b69f28b0de8baf58df',
  measurementId: 'G-PMBXYZ81NM',
}

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
