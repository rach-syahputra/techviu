import { ReactNode } from 'react'
import Link from 'next/link'

import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import SignInButton from '@/components/SignInButton'
import LogoutButton from '@/components/LogoutButton'
import Logo from '@/components/Logo'
import Hamburger from '@/components/Hamburger'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser()
  const isUserAuthenticated = await isAuthenticated()

  return (
    <div className="root-layout">
      <nav className="flex w-full items-center justify-between gap-4">
        <Link href="/" className="flex w-fit items-center gap-3">
          <Logo />
          <h2 className="dark:text-primary-100">Techviu</h2>
        </Link>

        <SignInButton />

        {isUserAuthenticated && (
          <>
            <div className="flex items-center gap-4 max-md:hidden">
              <p className="max-md:hidden">{user?.email}</p>

              <LogoutButton />
            </div>

            <Hamburger email={user?.email || ''} />
          </>
        )}
      </nav>

      {children}
    </div>
  )
}

export default RootLayout
