import React from 'react'
import AssetStatus from "./AssetStatus";
import Toggle from './Toggle';

export default function ClubBalance() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 w-full">
          <div className="flex flex-row items-start gap-2 w-full order-2 md:order-1">
            <AssetStatus variant="change" value={7531.21} className="grow" />
            <AssetStatus variant="total" value={2347682.12} className="grow" />
          </div>
          <div className=" order-1 md:order-2 shrink-0 md:w-[150px]">
            <Toggle/>
          </div>
        </div>
  )
}
