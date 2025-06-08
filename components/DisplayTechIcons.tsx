'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { cn, getTechLogos } from '@/lib/utils'

interface TechIcon {
  tech: string
  url: string
}

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<TechIcon[]>([])

  const getTechIcons = async () => {
    setTechIcons((await getTechLogos(techStack)) || [])
  }

  useEffect(() => {
    getTechIcons()
  }, [techStack])

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={index}
          className={cn(
            'group bg-dark-300 flex-center relative rounded-full p-2',
            {
              '-ml-3': index >= 1,
            },
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  )
}

export default DisplayTechIcons
