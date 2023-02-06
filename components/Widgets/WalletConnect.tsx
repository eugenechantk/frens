import React, { Dispatch, SetStateAction, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button/Button";
import { parseUri } from "@walletconnect/utils";

import {
  createLegacySignClient,
  legacySignClient,
  signClient,
} from "../../lib/walletConnectLib";
import { getSdkError } from "@walletconnect/utils";
import SessionCard from "../WalletConnectModals/Components/SessionCard";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import walletConnectIcon from "../../public/walletconnect.png";
import Image from "next/image";
import SimpleInputField from "../InputField/SimpleInputField";
import { SessionTypes } from "@walletconnect/types";
import { ILegacySession } from "./WidgetSection";
import { useRouter } from "next/router";
import { IClubInfo } from "../../lib/fetchers";

export interface IClubWallet {
  club_wallet_address: string;
  club_wallet_mnemonic: string;
}

export default function WalletConnect({
  data,
  sessions,
  setSessions,
  legacySession,
  setLegacySession,
}: {
  data: IClubInfo;
  sessions: SessionTypes.Struct[];
  setSessions: Dispatch<SetStateAction<SessionTypes.Struct[]>>;
  legacySession: ILegacySession;
  setLegacySession: Dispatch<SetStateAction<ILegacySession | undefined>>;
}) {
  const [uri, setUri] = useState("");
  const clubWallet: IClubWallet = {
    club_wallet_address: data.club_wallet_address!,
    club_wallet_mnemonic: data.club_wallet_mnemonic!,
  };
  const [showDesc, setShowDesc] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  const onConnect = async (uri: string) => {
    const { version } = parseUri(uri);
    try {
      if (version === 1) {
        // Only initalize the legacy sign client if the dApp only supports v1 protocol
        console.log("Connecting with legacy sign client...");
        createLegacySignClient({
          uri,
          clubWallet,
          setLegacySession,
          clubId: String(id),
        });
      } else {
        console.log("Connecting with new sign client...");
        await signClient?.pair({ uri });
      }
    } catch (err) {
      console.log(err);
    }
    setShowDesc(false);
  };

  return (
    <div className="w-full bg-white border border-secondary-300 rounded-10 flex flex-col gap-4 px-4 pt-4 pb-3">
      <div className="flex flex-row items-center justify-between w-full">
        <h3>Invest club asset</h3>
        <Button variant="secondary-outline" className=" hidden">
          <XMarkIcon className=" w-5" />
        </Button>
      </div>
      <p>Connect the club with any other apps to invest.</p>
      {/* Instruction accordian */}
      <div>
        <Button variant="text-only" onClick={() => setShowDesc(!showDesc)}>
          <ChevronDownIcon width={20} height={20} />
          <p>How to connect to other apps</p>
        </Button>
        {((sessions?.length === 0 && !legacySession) || showDesc) && (
          <div className="ml-3 mt-3">
            <div className="flex flex-row gap-[6px] mb-3">
              <p className="w-[13px] h-[28px]">1.</p>
              <p>
                Click{" "}
                <span className="bg-gray-300 py-[2px] px-2 rounded-[4px] font-semibold">
                  Connect Wallet
                </span>{" "}
                in the other app
              </p>
            </div>
            <div className="flex flex-row gap-[6px] mb-3">
              <p className="w-[13px]">2.</p>
              <div className="flex flex-row items-center">
                <p>Choose&nbsp;</p>
                <div className="bg-[#3B99FC] py-[2px] px-2 rounded-[4px] flex flex-row gap-1 items-center">
                  <Image
                    src={walletConnectIcon}
                    alt="WalletConnect Icon"
                    width={24}
                    height={15}
                  />
                  <p className="text-white font-semibold">WalletConnect</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-[6px] mb-3">
              <p className="w-[13px]">3.</p>
              <p>Click “Copy to clipboard in the bottom of the popup</p>
            </div>
          </div>
        )}
      </div>
      {/* URI input field and connect WC button */}
      <div className="flex flex-col gap-3">
        <SimpleInputField
          name="wcUri"
          type="text"
          label="WalletConnect link"
          placeholder="Paste the link copied here"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUri(e.target.value)
          }
        />
        <Button onClick={() => onConnect(uri)}>
          <h3>Connect to app</h3>
        </Button>
      </div>
      {/* Connected apps */}
      {(sessions?.length || legacySession) && (
        <div className="flex flex-col gap-2 border-t border-t-gray-300 max-h-[240px] overflow-y-scroll">
          <h4 className="mt-2">Connected session</h4>
          {legacySession && (
            <SessionCard
              logo={legacySession.peerMeta?.icons[0]}
              name={legacySession.peerMeta?.name}
              url={legacySession.peerMeta?.url}
              onDisconnect={() => {
                legacySignClient?.killSession();
                setLegacySession(undefined);
              }}
            />
          )}
          {sessions?.length !== 0 &&
            sessions?.map((session, key) => {
              console.log("Session connected: ", session);
              const { name, icons, url } = session.peer.metadata;
              return (
                <SessionCard
                  key={key}
                  name={name}
                  logo={icons[0]}
                  url={url}
                  onDisconnect={async () => {
                    const result = await signClient?.disconnect({
                      topic: session.topic,
                      reason: getSdkError("USER_DISCONNECTED"),
                    });
                    setSessions(signClient?.session.values!);
                  }}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
