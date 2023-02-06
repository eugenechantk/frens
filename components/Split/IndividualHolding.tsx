import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import React from "react";
import { IHoldingsData } from "../../lib/ethereum";

export default function IndividualHolding({share, token}: {share: number, token: IHoldingsData}) {
  console.log(token, share)
  const memberBalance = BigNumber.from(token.balance).mul(BigNumber.from(share)).div(BigNumber.from(10000));
  return (
    <div className="flex flex-row gap-2">
      {/* Token name */}
      <p className="text-gray-500 grow font-semibold text-sm">{token.name}</p>
      {/* Token amount */}
      <p className=" inline-block text-gray-500 font-semibold text-sm">{formatUnits(memberBalance, token.decimals).match(/^-?\d*\.?0*\d{0,5}/)}</p>
      <p className=" inline-block text-gray-400 text-sm">{token.symbol}</p>
    </div>
  );
}
