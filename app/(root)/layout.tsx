import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import LogoutButton from '@/components/LogoutButton'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser()
  const isUserAuthenticated = await isAuthenticated()

  if (!isUserAuthenticated) redirect('/sign-in')

  return (
    <div className="root-layout">
      <nav className="flex w-full items-center justify-between gap-4">
        <Link href="/" className="flex w-fit items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">Techviu</h2>
        </Link>

        <div className="flex items-center gap-4">
          <p>{user?.email}</p>
          <LogoutButton />
        </div>
      </nav>

      {children}
    </div>
  )
}

export default RootLayout
