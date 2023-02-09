import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import CoinBlue3d from '../../public/Coin_Blue_3d.png'
import Mail from '../../public/Mail_3d.png'
import { Button } from '../Button/Button'
import SimpleInputField from '../InputField/SimpleInputField'

export default function NoClub() {
  const router = useRouter();
  return (
    <div className="h-full w-full px-4 flex flex-col gap-8 items-center justify-center md:flex-row">
      {/* Create club section */}
      <div className='flex flex-col items-center gap-4 md:w-[328px]'>
        <Image src={CoinBlue3d} alt='create new club' height={86} />
        <div className='flex flex-col items-center gap-2'>
          <h3 className='text-center'>Create new club</h3>
          <p className='text-center'>Start create a new club, and invest in digital assets with your friends</p>
        </div>
        <Link href="/create" className='w-[220px]'>
          <Button className='w-full'>
            <h5>Create a new club</h5>
          </Button>
        </Link>
      </div>
      <div className='h-[1px] md:h-[280px] md:w-[1px] bg-secondary-300 w-[60vw]'></div>
      {/* Create club section */}
      <div className='flex flex-col items-center gap-4 md:w-[328px]'>
        <Image src={Mail} alt='create new club' height={86} />
        <div className='flex flex-col items-center gap-2'>
          <h3 className='text-center'>Join a club</h3>
          <p className='text-center'>If you have an invite link, you can enter below to join a club</p>
        </div>
        <SimpleInputField
          name="invitLink"
          type="text"
          placeholder="Paste the club invite link here"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            router.push(e.target.value)
          }
        />
      </div>
    </div>
  )
}
