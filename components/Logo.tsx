import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
}

const Logo = ({ width = 38, height = 32 }: LogoProps) => {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="Logo"
        width={width}
        height={height}
        className="dark:hidden"
      />

      <Image
        src="/logo.png"
        alt="Logo"
        width={width}
        height={height}
        className="hidden dark:block"
      />
    </>
  )
}

export default Logo
