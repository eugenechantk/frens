import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Button } from '../Button/Button'
import Holding from './Holding'

export type HoldingsData = {
  token_address: string,
  name: string,
  symbol: string,
  logo: string | null,
  thumbnail: string | null,
  decimals: number,
  balance: string,
}

const holdings: HoldingsData[] = [{"token_address":"0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6","name":"Wrapped Ether","symbol":"WETH","logo":null,"thumbnail":null,"decimals":18,"balance":"171094720864000"},{"token_address":"0xb0f885f3b8b0345f9d2744184f4cc390e17d8e1f","name":"New Testing 21","symbol":"NEWTEST21","logo":null,"thumbnail":null,"decimals":18,"balance":"4455123300000000"},{"token_address":"0xa4803bad3b05a50cff08f955e5c52868bfc664e3","name":"New Test 22","symbol":"NEWTEST22","logo":null,"thumbnail":null,"decimals":18,"balance":"35850283800000000"},{"token_address":"","name":"Ethereum","symbol":"ETH","logo":null,"thumbnail":null,"decimals":18,"balance":"56804361701176687"}]

export default function Portfolio() {
  return (
    <div className='w-full flex flex-col items-start gap-3'>
      {/* Title */}
      <div className='flex flex-row justify-between items-center w-full'>
        <h2>Portfolio</h2>
        <Button variant="text-only" size='sm'>
          <p className='!text-gray-500 !font-sans'>View activity</p>
          <ArrowTopRightOnSquareIcon className='w-5 !text-gray-500'/>
        </Button>
      </div>
      {/* Holdings table */}
      {holdings.map((holding, index) => {
        return (
          <Holding key={index} data={holding}/>
        )
      })}
    </div>
  )
}
