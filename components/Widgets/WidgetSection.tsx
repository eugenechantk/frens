import { IClientMeta } from "@walletconnect/legacy-types";
import { useRouter } from "next/router";
import React, { lazy, useState, Suspense, useEffect } from "react";
import { IClubInfo } from "../../lib/fetchers";
import { useSignClientEventsManager } from "../../lib/useWcEventsManager";
import useWcinit from "../../lib/useWcInit";
import {
  createLegacySignClient,
  legacySignClient,
  signClient,
} from "../../lib/walletConnectLib";
import BuyInWidgetWrapper from "./BuyInWidget/BuyInWidgetWrapper";
import WalletConnect, { IClubWallet } from "./WalletConnect";
import WidgetToggle from "./WidgetToggle";

export interface ILegacySession {
  connected: boolean;
  accounts: string[];
  chainId: number;
  bridge: string;
  key: string;
  clientId: string;
  clientMeta: IClientMeta | null;
  peerId: string;
  peerMeta: IClientMeta | null;
  handshakeId: number;
  handshakeTopic: string;
}

export default function WidgetSection({ data }: { data: IClubInfo }) {
  const [selected, setSelected] = useState("invest");
  const [sessions, setSessions] = useState(signClient?.session?.values!);
  const [legacySession, setLegacySession] = useState(legacySignClient?.session!);
  const clubWallet: IClubWallet = {
    club_wallet_address: data.club_wallet_address!,
    club_wallet_mnemonic: data.club_wallet_mnemonic!,
  };
  const router = useRouter();
  const { id } = router.query;

  // Initialize the WalletConnect Sign Client
  const initalized = useWcinit(data);
  useSignClientEventsManager(initalized, clubWallet, setSessions);
  createLegacySignClient({ clubWallet, setLegacySession, clubId: String(id) });

  return (
    <div className="flex flex-col items-start gap-2">
      <WidgetToggle selected={selected} setSelected={setSelected} />
      <div className="w-full md:w-[376px] h-min-[408px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-start gap-2">
        {selected === "invest" && (
          <WalletConnect
            data={data}
            sessions={sessions!}
            setSessions={setSessions}
            legacySession={legacySession!}
            setLegacySession={setLegacySession}
          />
        )}
        {selected === "buyin" && <BuyInWidgetWrapper data={data} />}
      </div>
    </div>
  );
}
