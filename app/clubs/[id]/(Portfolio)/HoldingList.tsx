import React from "react";
import { fetchPortfolio, IHoldingsData } from "../../../../lib/ethereum";
import Holding from "./Holding";

async function getPortfolio(club_wallet_address: string) {
  const balance: IHoldingsData[] = await fetchPortfolio(club_wallet_address);
  return balance;
}

export default async function HoldingList(club_wallet_address: {club_wallet_address: string}) {
  const balance = await getPortfolio(club_wallet_address.club_wallet_address);
  return (
    <>
      {/* Holdings table */}
      {balance.map((holding, index) => {
        return <Holding key={index} data={holding} />;
      })}
    </>
  );
}
