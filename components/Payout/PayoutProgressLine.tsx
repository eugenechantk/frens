import React from 'react'
import PayoutItem from './PayoutItem'

export default function PayoutProgressLine() {
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
