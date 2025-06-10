import { ReactNode } from 'react'

import Marker from './Marker'

interface ButtonProps {
  onClick: () => void
  children: ReactNode
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="g5 shadow-500 group relative w-fit cursor-pointer rounded-2xl p-0.5"
    >
      <span className="g4 inner-before relative flex min-h-[60px] items-center overflow-hidden rounded-2xl px-4 group-hover:before:opacity-100">
        <span className="absolute -left-[1px]">
          <Marker />
        </span>

        <span className="text-p-100 word-spacing-md relative z-2 ml-2 text-lg leading-6 font-bold tracking-wide subpixel-antialiased">
          {children}
        </span>
      </span>

      <span className="glow-before glow-after" />
    </button>
  )
}

export default Button
