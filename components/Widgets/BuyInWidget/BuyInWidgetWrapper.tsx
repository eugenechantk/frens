import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getUsdPrice } from "../../../lib/ethereum";
import DepositBuyIn from "./DepositBuyIn";
import InputBuyIn from "./InputBuyIn";

export default function BuyInWidgetWrapper() {
  const [buyIn, setBuyIn] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log(buyIn, step)
  }, [buyIn, step])

  return (
    <>
      <h3 className="mt-[6px] ml-3 mb-2">Invest in club assets</h3>
      <div className="bg-white flex flex-col items-center p-3 gap-4 rounded-[16px] h-[408px] w-full">
        <p className="w-full">Deposit ETH into the club to gain more ownership in club tokens</p>
        <div className="w-full h-full">
          {step === 1 && <InputBuyIn onClick={(buyInEth: number) => {
            setStep(2);
            setBuyIn(buyInEth);
          }}/>}
          {step === 2 && <DepositBuyIn/>}
        </div>
      </div>
    </>
  );
}
