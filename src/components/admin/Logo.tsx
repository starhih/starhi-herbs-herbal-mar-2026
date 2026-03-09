import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <Image
        src="https://ik.imagekit.io/pon54xoks/starhi-herbs%20-white-02.svg"
        alt="Star Hi Herbs Logo"
        width={193}
        height={43.5}
        unoptimized
        priority
      />
    </div>
  )
}
