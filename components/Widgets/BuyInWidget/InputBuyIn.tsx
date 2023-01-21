import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getUsdPrice } from "../../../lib/ethereum";
import { Button } from "../../Button/Button";

export default function InputBuyIn(props:{onClick: (buyInEth: number) => void}) {
  const [buyInUsd, setBuyInUsd] = useState(0);
  const [buyInEth, setBuyInEth] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    const getEthPrice = async () => {
      const price = await getUsdPrice();
      return price;
    };
    getEthPrice().then((price) => {
      setEthPrice(price);
    });
  }, []);

  useEffect(() => {
    if (ethPrice === 0) {
      setBuyInEth(0);
    } else {
      setBuyInEth(buyInUsd / ethPrice);
    }
  }, [buyInUsd]);
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="relative w-full">
        {/* USD value input */}
        <div className="flex flex-col pl-4 pr-3 pt-4 pb-3 w-full border border-secondary-300 rounded-8 gap-[2px] mb-3">
          <div className="flex flex-row gap-1 justify-center">
            <input
              type="number"
              className="h-10 w-full text-4xl focus:outline-none"
              placeholder={String(buyInUsd)}
              onChange={(e) => {
                if (!e.target.value) {
                  setBuyInUsd(0);
                } else {
                  setBuyInUsd(parseFloat(e.target.value));
                }
              }}
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
            Your share
          </p>
          <div className="flex flex-row gap-2 items-end w-full">
            <div className="flex flex-row gap-2 grow items-end">
              <h1 className="font-normal text-secondary-500">12,675</h1>
              <p className="text-lg font-semibold text-secondary-500">
                SATOSHI
              </p>
            </div>
            <p className="text-lg text-secondary-400">+5760</p>
          </div>
          <div className="flex flex-row items-end gap-8 w-full">
            <p className="grow text-lg font-semibold text-secondary-400">
              37.51%
            </p>
            <p className="text-lg text-secondary-400">+2.31%</p>
          </div>
        </div>
        {/* Center arrow */}
        <div className="absolute border-4 rounded-10 border-primary-100 bg-primary-200 w-12 h-12 flex flex-row justify-center left-[calc(50%-48px/2)] top-[calc(50%-40px/2-32px)]">
          <ArrowSmallDownIcon className=" w-6 text-primary-600" />
        </div>
        {/* Processing fee estimation */}
        <div className="flex flex-row justify-between px-4">
          <p className="text-sm text-gray-400">Processing fee</p>
          <p className="text-sm text-gray-400">~0.000265 ETH</p>
        </div>
      </div>
      <Button className="w-[218px]" onClick={() => props.onClick(buyInEth)}>
        <h3>Deposit and buy in</h3>
      </Button>
    </div>
  );
}