import React, { useEffect, useState } from 'react'
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { getUsdPrice } from '../../lib/ethereum';

interface IFeeEstimateProps {
  eth: string;
  className?: string;
}

export default function FeeEstimate(props: IFeeEstimateProps) {
  const [ethUsd, setEthUsd] = useState<number>()
  useEffect(() => {
    const calcETHPrice = async () => {
      const ethUsd = await getUsdPrice()
      return ethUsd * parseFloat(props.eth)
    }
    calcETHPrice().then((ethUsd) => {
      setEthUsd(ethUsd)
    })
  })
  return (
    <div className={`flex flex-row items-start px-4 py-3 gap-4 bg-primary-200 border border-primary-300 rounded-8 ${props.className}`}>
          {/* Estimated fee icons and title */}
          <div className="flex flex-row items-center gap-2 grow">
            <WrenchScrewdriverIcon className="w-6 text-primary-800" />
            <p className="text-base leading-6 font-semibold text-primary-800">
              Estimated fees
            </p>
          </div>
          {/* Fee estimate display */}
          <div className="flex flex-row gap-2">
            {/* TODO: render the estimated ETH price and USD equivalent */}
            <p className="text-primary-800 text-base leading-6 font-semibold">
              {props.eth} ETH
            </p>
            <p className="text-primary-500 text-base leading-6 font-semibold">
              {ethUsd ? ethUsd.toFixed(2) : "..."} USD
            </p>
          </div>
        </div>
  )
}
