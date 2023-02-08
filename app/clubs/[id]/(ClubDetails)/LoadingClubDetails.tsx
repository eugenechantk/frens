import React from 'react'

export default function LoadingClubDetails() {
  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <div className="w-[60px] md:w-[52px] h-[60px] md:h-[52px] relative rounded-10 bg-secondary-200">
      </div>
      {/* Club name and settings button */}
      <div className="flex flex-row items-center gap-3">
        <div className='w-56 h-10 bg-secondary-200 rounded-8'></div>
      </div>
      {/* Club description */}
      <div className='flex flex-col gap-2 w-full'>
        <div className='w-full h-5 bg-secondary-200 rounded-8'></div>
        <div className='w-72 h-5 bg-secondary-200 rounded-8'></div>
      </div>
    </div>
  )
}
