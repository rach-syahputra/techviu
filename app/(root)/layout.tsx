import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import LogoutButton from '@/components/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser()
  const isUserAuthenticated = await isAuthenticated()

  if (!isUserAuthenticated) redirect('/sign-in')

  return (
    <div className="root-layout">
      <nav className="flex w-full items-center justify-between gap-4">
        <Link href="/" className="flex w-fit items-center gap-3">
          <Logo />
          <h2 className="dark:text-primary-100">Techviu</h2>
        </Link>

        <div className="flex items-center gap-4">
          <p>{user?.email}</p>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      {children}
    </div>
  )
}

export default RootLayout
