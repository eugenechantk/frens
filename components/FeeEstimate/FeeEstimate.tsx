import React from 'react'
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

interface IFeeEstimateProps {
  eth: string;
  usd?: number;
  className?: string;
}

export default function FeeEstimate(props: IFeeEstimateProps) {
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
              {props.usd ? props.usd : props.eth} USD
            </p>
          </div>
        </div>
  )
}
