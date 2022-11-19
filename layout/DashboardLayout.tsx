import React from 'react'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className='bg-secondary-200 p-6 w-full'></div>
      <main>{children}</main>
    </>
  )
}
