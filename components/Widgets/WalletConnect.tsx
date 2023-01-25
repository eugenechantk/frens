import React, { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { parseUri } from "@walletconnect/utils";
import LoadingWidget from "./LoadingWidget";
import { IClubInfo } from "../../pages/clubs/[id]";
import { createLegacySignClient, createSignClient, legacySignClient, signClient } from "../../lib/walletconnect";

export interface IClubWallet {
  club_wallet_address: string;
  club_wallet_mnemonic: string;
}

export default function WalletConnect({ data }: { data: IClubInfo }) {
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(true);
  const clubWallet: IClubWallet = {
    club_wallet_address: data.club_wallet_address!,
    club_wallet_mnemonic: data.club_wallet_mnemonic!,
  };
  const [legacySession, setLegacySession] = useState(legacySignClient?.session)


  const initialize = async () => {
    await createSignClient();
  };

  const onConnect = async (uri: string) => {
    const { version } = parseUri(uri);
    try {
      if (version === 1) {
        console.log("Connecting with legacy sign client...");
        createLegacySignClient({ uri, clubWallet, setLegacySession});
      } else {
        console.log("Connecting with new sign client...");
        await signClient?.pair({ uri });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    initialize();
    setLoading(false);
  }, []);

  return loading ? (
    <LoadingWidget />
  ) : (
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
    </>
  );
}
