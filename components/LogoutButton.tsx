import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth.action'
import { Button } from './ui/button'

interface LogoutButtonProps {
  className?: string
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  return (
    <Button onClick={signOut} className={cn('btn', className)}>
      Logout
    </Button>
  )
}

export default LogoutButton
