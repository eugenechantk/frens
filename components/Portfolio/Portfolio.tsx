import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { IHoldingsData } from '../../lib/ethereum'
import { Button } from '../Button/Button'
import Holding from './Holding'

export default function Portfolio({data, clubWalletAddress}: {data: IHoldingsData[], clubWalletAddress: string}) {
  return (
    <div className='w-full flex flex-col items-start gap-3'>
      {/* Title */}
      <div className='flex flex-row justify-between items-center w-full'>
        <h2>Portfolio</h2>
        <Button variant="text-only" size='sm' onClick={() => {
          window.open(`https://etherscan.io/address/${clubWalletAddress}`)
        }}>
          <p className='!text-gray-500 !font-sans'>View activity</p>
          <ArrowTopRightOnSquareIcon className='w-5 !text-gray-500'/>
        </Button>
      </div>
      {/* Holdings table */}
      {data.map((holding, index) => {
        return (
          <Holding key={index} data={holding}/>
        )
      })}
    </div>
  )
}
