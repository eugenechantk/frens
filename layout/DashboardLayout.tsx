import React from 'react'
import NavBar from '../components/NavBar/NavBar'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <NavBar/>
      <main>{children}</main>
    </>
  )
}
