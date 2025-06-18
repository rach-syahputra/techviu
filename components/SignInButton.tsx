import Link from 'next/link'

import { Button } from './ui/button'

const SignInButton = () => {
  return (
    <Button asChild>
      <Link href="/sign-in">Sign In</Link>
    </Button>
  )
}

export default SignInButton
