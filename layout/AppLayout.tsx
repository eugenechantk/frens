import React from 'react'
import NavBar from '../components/NavBar/NavBar'

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='h-full w-full flex flex-col'>
      <NavBar/>
      <main className='grow overflow-scroll'>{children}</main>
    </div>
  )
}
