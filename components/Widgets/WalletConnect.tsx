import React, {useState } from "react";
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
import { getSdkError } from '@walletconnect/utils'

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
    <>
      <input
        type="text"
        onChange={(e) => setUri(e.target.value)}
        placeholder="enter uri"
      ></input>
      <Button onClick={() => onConnect(uri)}>
        <h3>Connect</h3>
      </Button>
      {legacySession && (
        <div className="mt-2">
          <h5>{legacySession.peerMeta?.name}</h5>
          <p>{legacySession.peerMeta?.description}</p>
          <Button
            size="sm"
            variant="secondary-outline"
            className="mt-2"
            onClick={() => {
              legacySignClient?.killSession();
            }}
          >
            <h5>Disconnect</h5>
          </Button>
        </div>
      )}
      {sessions?.length &&
        sessions.map((session, key) => {
          console.log('Session connected: ', session)
          const { name, description } = session.peer.metadata;
          return (
            <div className="mt-2" key={key}>
              <h5>{name}</h5>
              <p>{description}</p>
              <Button
                size="sm"
                variant="secondary-outline"
                className="mt-2"
                onClick={async () => {
                  const result = await signClient.disconnect({topic: session.topic, reason: getSdkError('USER_DISCONNECTED')})
                  setSessions(signClient.session.values)
                }}
              >
                <h5>Disconnect</h5>
              </Button>
            </div>
          );
        })}
    </>
  );
}
