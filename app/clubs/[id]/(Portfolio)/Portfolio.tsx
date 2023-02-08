import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import React from "react";
import { fetchPortfolio, IHoldingsData } from "../../../../lib/ethereum";
import { Button } from "../../../../components/Button/Button";
import Holding from "./Holding";
import { redis } from "../../../../lib/redis";

async function getPortfolio(club_wallet_address: string) {
  console.log(club_wallet_address);
  const balance: IHoldingsData[] = await fetchPortfolio(club_wallet_address);
  return balance;
}

export default async function Portfolio(id: { id: string }) {
  const club_wallet_address = await redis.hget<string>(id.id, "wallet_address");
  const balance = await getPortfolio(club_wallet_address!);
  return (
    <>
      {/* Holdings table */}
      {balance.map((holding, index) => {
        return <Holding key={index} data={holding} />;
      })}
    </>
  );
}
