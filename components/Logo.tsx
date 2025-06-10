import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
}

const Logo = ({ width = 48, height = 42 }: LogoProps) => {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={width}
      height={height}
      className="aspect-auto h-[33,20px] w-[38px]"
    />
  )
}

export default Logo
