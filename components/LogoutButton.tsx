import { signOut } from '@/lib/actions/auth.action'
import { Button } from './ui/button'

const LogoutButton = () => {
  return (
    <Button onClick={signOut} className="btn">
      Logout
    </Button>
  )
}

export default LogoutButton
