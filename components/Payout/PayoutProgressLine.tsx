import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import React, { Dispatch, SetStateAction } from 'react'
import { IHoldingsData } from '../../lib/ethereum'
import { IMemberInfoAndClaimPower } from '../../pages/clubs/[id]/close'
import PayoutItem from './PayoutItem'

export default function PayoutProgressLine({sdk, clubPorfolio, claimPower, setPayoutProgress}: {sdk: ThirdwebSDK, clubPorfolio: IHoldingsData[], claimPower:IMemberInfoAndClaimPower[], setPayoutProgress: Dispatch<SetStateAction<"not started" | "in progress" | "done">>}) {
  return (
    <div className='flex flex-col items-start gap-3 relative'>
      <PayoutItem title="Calculate members’ shares" txnStatus='done'/>
      <PayoutItem title="Initiate distribution" txnStatus='done'/>
      <PayoutItem title="Distribute Uniswap" txnStatus='done' txnUrl='abc'/>
      <PayoutItem title="Distribute Compound" txnStatus='done' txnUrl='abc'/>
      <PayoutItem title="Distribute USDC"/>
      <PayoutItem title="Distribute Ethereum" txnStatus='pending'/>
      <PayoutItem title="Burn all club tokens and close club" txnStatus='pending'/>
      <div className='absolute w-[3px] bg-secondary-300 left-[10px] -z-10 h-[calc(100%-58px)]'>

      </div>
    </div>
  )
}
