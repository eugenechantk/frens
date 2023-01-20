import React, { useEffect, useState } from "react";
import defaultIcon from "../../public/default_avatar.png";
import Image from "next/image";
import _ from "lodash";
import { BigNumber, ethers } from "ethers";
import { THoldingsData } from "../../pages/clubs/[id]";
import axios from "axios";
import { getUsdPrice } from "../../lib/ethereum";

export default function Holding({ data }: { data: THoldingsData }) {
  const [usd, setUsd] = useState("...");
  const [icon, setIcon] = useState();
  useEffect(() => {
    const getPrice = async () => {
      const price = await getUsdPrice(data.token_address);
      return price;
    };
    getPrice().then((usdPrice) => {
      setUsd(
        String(
          (
            usdPrice *
            Number(
              ethers.utils.formatUnits(
                BigNumber.from(data.balance),
                data.decimals
              )
            )
          ).toFixed(2)
        )
      );
    });
  }, []);
  return (
    <div className="flex flex-row items-start pt-6 gap-3 w-full">
      {/* Icon */}
      <div className=" w-10 h-10 border border-secondary-300 rounded-8 flex flex-col items-center">
        <Image
          src={`https://coinicons-api.vercel.app/api/icon/${data.symbol.toLowerCase()}`}
          alt={`${data.name} icon`}
          width={24}
          height={24}
          className="mx-auto my-auto"
          style={{ objectFit: "cover" }}
        />
      </div>
      {/* Holding details */}
      <div className="flex flex-col items-start pb-5 grow gap-1 border-b border-b-secondary-300">
        {/* First line */}
        <div className="flex flex-row justify-between items-start w-full">
          {/* Token full name */}
          <h5>{_.upperFirst(data.name)}</h5>
          {/* USD value */}
          <div className="flex flex-row items-start gap-1">
            <h5>
              {String(usd)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h5>
            <h5 className="text-gray-400">US$</h5>
          </div>
        </div>
        {/* Second line */}
        <div className="flex flex-row justify-between items-start w-full">
          {/* Token symbol */}
          <p className="text-sm font-medium text-gray-400">
            {_.upperCase(data.symbol)}
          </p>
          {/* Balance */}
          <div className="flex flex-row items-start gap-1">
            <p className="text-sm font-medium text-gray-400">
              {Number(
                ethers.utils.formatUnits(
                  BigNumber.from(data.balance),
                  data.decimals
                )
              ).toFixed(5)}
            </p>
            <p className="text-sm font-medium text-gray-400">
              {_.upperCase(data.symbol)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
