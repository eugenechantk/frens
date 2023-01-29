import React, { useState } from "react";
import { Button } from "../Button/Button";
import { parseUri } from "@walletconnect/utils";
import LoadingWidget from "./LoadingWidget";
import { IClubInfo } from "../../pages/clubs/[id]";
import {
  createLegacySignClient,
  legacySignClient,
  signClient,
} from "../../lib/walletConnectLib";
import useWcinit from "../../lib/useWcInit";
import { useSignClientEventsManager } from "../../lib/useWcEventsManager";
import { getSdkError } from "@walletconnect/utils";
import SessionCard from "../WalletConnectModals/Components/SessionCard";

export interface IClubWallet {
  club_wallet_address: string;
  club_wallet_mnemonic: string;
}

export default function WalletConnect({ data }: { data: IClubInfo }) {
  const [uri, setUri] = useState("");
  const clubWallet: IClubWallet = {
    club_wallet_address: data.club_wallet_address!,
    club_wallet_mnemonic: data.club_wallet_mnemonic!,
  };
  const [legacySession, setLegacySession] = useState(legacySignClient?.session);
  const [sessions, setSessions] = useState(signClient?.session?.values);

  // Initialize the WalletConnect Sign Client
  const initalized = useWcinit(data);
  useSignClientEventsManager(initalized, clubWallet, setSessions);

  const onConnect = async (uri: string) => {
    const { version } = parseUri(uri);
    try {
      if (version === 1) {
        // Only initalize the legacy sign client if the dApp only supports v1 protocol
        console.log("Connecting with legacy sign client...");
        createLegacySignClient({ uri, clubWallet, setLegacySession });
      } else {
        console.log("Connecting with new sign client...");
        await signClient?.pair({ uri });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        onChange={(e) => setUri(e.target.value)}
        placeholder="enter uri"
      ></input>
      <Button onClick={() => onConnect(uri)}>
        <h3>Connect</h3>
      </Button>
      {legacySession && (
        <SessionCard
          logo={legacySession.peerMeta?.icons[0]}
          name={legacySession.peerMeta?.name}
          url={legacySession.peerMeta?.url}
          onDisconnect={() => legacySignClient?.killSession()}
        />
      )}
      {sessions?.length &&
        sessions.map((session, key) => {
          console.log("Session connected: ", session);
          const { name, icons, url } = session.peer.metadata;
          return (
            <SessionCard
              key={key}
              name={name}
              logo={icons[0]}
              url={url}
              onDisconnect={async () => {
                const result = await signClient.disconnect({
                  topic: session.topic,
                  reason: getSdkError("USER_DISCONNECTED"),
                });
                setSessions(signClient.session.values);
              }}
            />
          );
        })}
    </div>
  );
}
