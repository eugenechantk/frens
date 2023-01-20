import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getUsdPrice } from "../../lib/ethereum";

export default function BuyInWidget() {
  const [buyInUsd, setBuyInUsd] = useState(0);
  const [buyInEth, setBuyInEth] = useState(0);
  const [ethPrice, setEthPrice] = useState(0)

  useEffect(() => {
    const getEthPrice = async () => {
      const price = await getUsdPrice();
      return price
    }
    getEthPrice().then(price => {
      setEthPrice(price)
    })
  }, [])

  useEffect(() => {
    if (ethPrice === 0) {
      setBuyInEth(0)
    } else {
      setBuyInEth(buyInUsd/ethPrice)
    }
  }, [buyInUsd])
  return (
    <>
      <h3 className="mt-[6px] ml-3 mb-2">Invest in club assets</h3>
      <div className="bg-white flex flex-col items-center p-3 gap-4 rounded-[16px]">
        <p>Deposit ETH into the club to gain more ownership in club tokens</p>
        <div className="w-full">
          <div className="flex flex-col pl-4 pr-3 py-4 w-full border border-secondary-300 rounded-8 gap-[2px]">
            <div className="flex flex-row gap-1 justify-center">
              <input
                type="number"
                className="h-10 w-full text-4xl focus:outline-none"
                placeholder={String(buyInUsd)}
                onChange={(e) => {
                  if (!e.target.value){
                    setBuyInUsd(0)
                  } else {
                    setBuyInUsd(parseFloat(e.target.value));
                  }
                }}
              ></input>
              <div className="flex flex-row justify-center items-center gap-1 px-2">
                <Image src={'https://coinicons-api.vercel.app/api/icon/usd'} alt='ETH' width={24} height={24}/>
                <p className="text-lg text-gray-700">USD</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">~{buyInEth} ETH</p>
          </div>
        </div>
      </div>
    </>
  );
}
