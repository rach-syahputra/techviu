'use client'

import { auth } from '@/firebase/client'
import { Button } from './ui/button'
import { signOut } from 'firebase/auth'

const LogoutButton = () => {
  return (
    <Button onClick={() => signOut(auth)} className="btn">
      Logout
    </Button>
  )
}

export default LogoutButton
