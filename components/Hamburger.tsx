import { AlignJustify } from 'lucide-react'

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import LogoutButton from './LogoutButton'
import Logo from './Logo'

interface HamburgerProps {
  email: string
}

const Hamburger = ({ email }: HamburgerProps) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="cursor-pointer md:hidden">
        <AlignJustify size={32} className="text-light-100" />
      </DrawerTrigger>
      <DrawerContent className="bg-s-100/95 h-svh">
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex items-center gap-3">
              <Logo className="h-[27,79px] w-[32px]" />
              <h2 className="text-light-100 text-2xl">Techviu</h2>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 px-4">
          <p>{email}</p>
        </div>
        <DrawerFooter>
          <LogoutButton className="w-full" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default Hamburger
