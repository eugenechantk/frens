import { ThirdwebSDK, TokenDrop } from "@thirdweb-dev/sdk";
import { formatUnits } from "ethers/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getUsdPrice } from "../../../lib/ethereum";
import { provider } from "../../../lib/provider";
import { IClubInfo } from "../../../pages/clubs/[id]";
import LoadingWidget from "../LoadingWidget";
import DepositBuyIn from "./DepositBuyIn";
import InputBuyIn from "./InputBuyIn";

export default function BuyInWidgetWrapper({ data }: { data: IClubInfo }) {
  const [claimAmount, setClaimAmount] = useState(0);
  const [step, setStep] = useState(1);
  const [tokenContract, setTokenContract] = useState<TokenDrop>();
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  // const [userSdk, setUserSdk] = useState<ThirdwebSDK>();
  const userSdk = new ThirdwebSDK(provider?.getSigner()!);

  // useEffect(() => {
  //   const _userThirdWebSDK = new ThirdwebSDK(provider?.getSigner()!);
  //   setUserSdk(_userThirdWebSDK);
  // }, []);

  const getAllInfo = async (contract = tokenContract) => {
    setLoading(true);
    if (contract) {
      const getBalance = async () => {
        const userTokenCount = await contract!
          .balance()
          .then((balance) =>
            parseFloat(formatUnits(balance.value, balance.decimals))
          );
        setUserBalance(userTokenCount);
      };
      const getTotalSupply = async () => {
        const supply = await contract!
          .totalSupply()
          .then((supply) =>
            parseFloat(formatUnits(supply.value, supply.decimals))
          );
        setTotalSupply(supply);
      };
      const getEthPrice = async () => {
        const price = await getUsdPrice();
        setEthPrice(price);
      };
      await Promise.all([getBalance(), getTotalSupply(), getEthPrice()]);
    }
    setLoading(false);
  };
  useEffect(() => {
    const getContract = async () => {
      const contract = await userSdk.getContract(
        data.club_token_address!,
        "token-drop"
      );
      setTokenContract(contract);
      return contract;
    };
    getContract().then(async (contract) => await getAllInfo(contract));
  }, []);

  useEffect(() => {
    console.log(claimAmount, step);
  }, [claimAmount, step]);

  return (
    <>
      <h3 className="mt-[6px] ml-3 mb-2">Invest in club assets</h3>
      <div className="bg-white flex flex-col items-center p-3 gap-4 rounded-[16px] h-[408px] w-full border border-secondary-300">
        {loading ? (
          <LoadingWidget />
        ) : (
          <>
            <p className="w-full">
              Deposit ETH into the club to gain more ownership in club tokens
            </p>
            <div className="w-full h-full">
              {step === 1 && (
                <InputBuyIn
                  onClick={(buyTokenCount: number) => {
                    setStep(2);
                    setClaimAmount(buyTokenCount);
                  }}
                  data={data}
                  userBalance={userBalance}
                  totalSupply={totalSupply}
                  ethPrice={ethPrice}
                  key={resetKey}
                />
              )}
              {step === 2 && (
                <DepositBuyIn
                  tokenContract={tokenContract}
                  claimAmount={claimAmount}
                  onClick={async () => {
                    setStep(1);
                    await getAllInfo();
                    setResetKey(resetKey + 1);
                    setClaimAmount(0);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
