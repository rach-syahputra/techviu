import Image from 'next/image'

import { cn } from '@/lib/utils'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

const Logo = ({ width = 48, height = 42, className }: LogoProps) => {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={width}
      height={height}
      className={cn('aspect-auto h-[33,20px] w-[38px]', className)}
    />
  )
}

export default Logo
