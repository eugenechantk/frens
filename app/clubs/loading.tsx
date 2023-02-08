import Link from 'next/link'
import React from 'react'
import { Button } from '../../components/Button/Button'
import LoadingClubCard from './(ClubCard)/LoadingClubCard'

export default function Loading() {
  return (
    <div className="h-full w-full">
        <div className="flex flex-col gap-6 md:gap-8 max-w-[1000px] mx-auto">
          {/* Title and create button for desktop */}
          <div className="flex flex-row items-start justify-between w-full">
            <h1>My clubs</h1>
            <Link href="/create">
              <Button className="w-[218px] hidden md:block">
                <h3>Create new club</h3>
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-items-center">
            <LoadingClubCard />
            <LoadingClubCard />
            <Link href="/create">
              <Button className="w-[218px] md:hidden">
                <h3>Create new club</h3>
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}
