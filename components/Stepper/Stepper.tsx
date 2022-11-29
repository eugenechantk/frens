import React from 'react'

export default function Stepper({children}:{children: React.ReactNode}) {
  return (
    <div className='flex flex-row items-center'>
      {children}
    </div>
  )
}
