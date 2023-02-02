import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IClubInfo } from "../../../lib/fetchers";
import { Button } from "../../Button/Button";

export default function InputBuyIn({
  data,
  onClick,
  userBalance,
  totalSupply,
  ethPrice,
}: {
  onClick: (buyInEth: number) => void;
  data: IClubInfo;
  userBalance: number;
  totalSupply: number;
  ethPrice: number;
}) {
  const [buyInUsd, setBuyInUsd] = useState(0);
  const [buyInEth, setBuyInEth] = useState(0);
  const [buyTokenCount, setBuyTokenCount] = useState(0);
  const [newUserBalance, setNewUserBalance] = useState(userBalance);
  const [newTotalSupply, setNewTotalSupply] = useState(totalSupply);
  // console.log(userBalance, totalSupply)

  const calcTokenCount = (buyInUsd: number, ethPrice: number) => {
    return (
      buyInUsd / ethPrice / parseFloat(process.env.NEXT_PUBLIC_CLAIM_ETH_PRICE!)
    );
  };
  useEffect(() => {
    // Display buy in value in ETH
    setBuyInEth(buyInUsd / ethPrice);
    // Calculate token count
    setBuyTokenCount(calcTokenCount(buyInUsd, ethPrice));
    setNewUserBalance(userBalance + calcTokenCount(buyInUsd, ethPrice));
    setNewTotalSupply(totalSupply + calcTokenCount(buyInUsd, ethPrice));
  }, [buyInUsd]);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      // Reset all states when the input is emptied
      setBuyInUsd(0);
      setBuyInEth(0);
      setBuyTokenCount(0);
    } else {
      setBuyInUsd(parseInt(e.target.value));
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center grow w-full">
      <div className="flex flex-col grow justify-center w-full">
        <div className="relative">
          {/* USD value input */}
          <div className="flex flex-col pl-4 pr-3 pt-4 pb-3 w-full border border-secondary-300 rounded-8 gap-[2px] mb-3">
            <div className="flex flex-row gap-1 justify-center w-full">
              <input
                type="number"
                className="h-10 text-4xl focus:outline-none w-full"
                placeholder={String(buyInUsd)}
                onChange={(e) => handleOnChange(e)}
              ></input>
              <div className="flex flex-row justify-center items-center gap-1 px-2">
                <Image
                  src={"https://coinicons-api.vercel.app/api/icon/usd"}
                  alt="ETH"
                  width={24}
                  height={24}
                />
                <p className="text-lg text-gray-700">USD</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">~{buyInEth.toFixed(8)} ETH</p>
          </div>
          {/* Live share changes display */}
          <div className="flex flex-col items-start p-4 border border-secondary-300 bg-secondary-100 rounded-10 w-full mb-3">
            <p className=" text-xs uppercase font-bold text-secondary-500">
              Your new share
            </p>
            <div className="flex flex-row gap-2 items-end w-full">
              <div className="flex flex-row gap-2 grow items-end">
                <h1 className="font-normal text-secondary-500">
                  {newUserBalance.toFixed(2)}
                </h1>
                <p className="text-lg font-semibold text-secondary-500">
                  {data.club_token_sym}
                </p>
              </div>
              <p className="text-lg text-secondary-400">
                +{(newUserBalance - userBalance).toFixed(2)}
              </p>
            </div>
            <div className="flex flex-row items-end gap-8 w-full">
              <p className="grow text-lg font-semibold text-secondary-400">
                {newTotalSupply === 0 || newUserBalance === 0
                  ? "0"
                  : ((newUserBalance / newTotalSupply) * 100).toFixed(2)}
                %
              </p>
              <p className="text-lg text-secondary-400">
                +
                {(
                  (newUserBalance / newTotalSupply -
                    userBalance / totalSupply) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          </div>
          {/* Center arrow */}
          <div className="absolute border-4 rounded-10 border-primary-100 bg-primary-200 w-12 h-12 flex flex-row justify-center left-[calc(50%-48px/2)] top-[calc(50%-40px/2-20px)]">
            <ArrowSmallDownIcon className=" w-6 text-primary-600" />
          </div>
        </div>
      </div>
      <Button className="w-[218px]" onClick={() => onClick(buyTokenCount)}>
        <h3>Deposit and buy in</h3>
      </Button>
    </div>
  );
}
