import React, { lazy, useState, Suspense } from "react";
import { useSignClientEventsManager } from "../../lib/useWcEventsManager";
import useWcinit from "../../lib/useWcInit";
import { signClient } from "../../lib/walletConnectLib";
import { IClubInfo } from "../../pages/clubs/[id]";
import BuyInWidgetWrapper from "./BuyInWidget/BuyInWidgetWrapper";
import WalletConnect, { IClubWallet } from "./WalletConnect";
import WidgetToggle from "./WidgetToggle";

export default function WidgetSection({ data }: { data: IClubInfo }) {
  const [selected, setSelected] = useState("invest");
  const [sessions, setSessions] = useState(signClient?.session?.values);
  const clubWallet: IClubWallet = {
    club_wallet_address: data.club_wallet_address!,
    club_wallet_mnemonic: data.club_wallet_mnemonic!,
  };
  // Initialize the WalletConnect Sign Client
  const initalized = useWcinit(data);
  useSignClientEventsManager(initalized, clubWallet, setSessions);
  return (
    <div className="flex flex-col items-start gap-2">
      <WidgetToggle selected={selected} setSelected={setSelected} />
      <div className="w-full md:w-[376px] h-min-[408px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-start gap-2">
        {selected === "invest" && (
          <WalletConnect
            data={data}
            sessions={sessions}
            setSessions={setSessions}
          />
        )}
        {selected === "buyin" && <BuyInWidgetWrapper data={data} />}
      </div>
    </div>
  );
}
