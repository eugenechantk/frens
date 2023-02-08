'use client';

import { IClientMeta } from "@walletconnect/legacy-types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { lazy, useState, Suspense, useEffect } from "react";
import { IClubInfo } from "../../lib/fetchers";
import { useSignClientEventsManager } from "../../lib/useWcEventsManager";
import useWcinit from "../../lib/useWcInit";
import {
  createLegacySignClient,
  legacySignClient,
  signClient,
} from "../../lib/walletConnectLib";
import { Button } from "../Button/Button";
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

export default function WidgetSection({ data, id }: { data: IClubInfo, id: string }) {
  const [selected, setSelected] = useState("invest");
  const [sessions, setSessions] = useState(signClient?.session?.values!);
  const [legacySession, setLegacySession] = useState<ILegacySession | undefined>(legacySignClient?.session!);
  const clubWallet: IClubWallet = {
    club_wallet_address: data.club_wallet_address!,
    club_wallet_mnemonic: data.club_wallet_mnemonic!,
  };
  const router = useRouter()

  // Initialize the WalletConnect Sign Client
  const initalized = useWcinit(data);
  useSignClientEventsManager(initalized, clubWallet, setSessions);
  createLegacySignClient({ clubWallet, setLegacySession, clubId: String(id) });

  return (
    <div className="flex flex-col items-start gap-2">
      <WidgetToggle selected={selected} setSelected={setSelected} />
      <div className="w-full h-min-[408px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-start gap-2">
        {selected === "invest" && (
          <WalletConnect
            data={data}
            sessions={sessions!}
            setSessions={setSessions}
            legacySession={legacySession!}
            setLegacySession={setLegacySession}
            id={id}
          />
        )}
        {selected === "buyin" && <BuyInWidgetWrapper data={data} />}
      </div>
      <Button variant="secondary-outline" onClick={() => router.push(`/clubs/${id}/close`)} className="w-full"><h3>Close club and distribute</h3></Button>
    </div>
  );
}
