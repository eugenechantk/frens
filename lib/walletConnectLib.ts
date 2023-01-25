import SignClient from "@walletconnect/sign-client";
import LegacySignClient from "@walletconnect/client";
import { IWalletConnectSession } from "@walletconnect/legacy-types";
import ModalStore from "../components/WalletConnectModals/ModalStore";
import { EIP155_SIGNING_METHODS } from "./ethereum";
import { IClubWallet } from "../components/Widgets/WalletConnect";
import { useCallback, useEffect } from "react";
import { SignClientTypes } from "@walletconnect/types";
import { IClubInfo } from "../pages/clubs/[id]";

export let signClient: SignClient;
export let legacySignClient: LegacySignClient;
export let signClientInitialized: boolean;
let clubWallet: IClubWallet;

// For sign client
export async function createSignClient(data: IClubInfo) {
  signClient = await SignClient.init({
    logger: "debug",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  });
  signClientInitialized = true;
  clubWallet = {
    club_wallet_address: data?.club_wallet_address!,
    club_wallet_mnemonic: data?.club_wallet_mnemonic!,
  };
}

// For legacy sign client
export function createLegacySignClient({
  uri,
  clubWallet,
  setLegacySession,
}: {
  uri?: string;
  clubWallet: IClubWallet;
  setLegacySession: (session: any) => void;
}) {
  // If URI is passed always create a new session,
  // otherwise fall back to cached session if client isn't already instantiated.
  if (uri) {
    deleteCachedLegacySession();
    legacySignClient = new LegacySignClient({ uri });
  } else if (!legacySignClient && getCachedLegacySession()) {
    const session = getCachedLegacySession();
    legacySignClient = new LegacySignClient({ session });
  } else {
    return;
  }

  legacySignClient.on("session_request", (error, payload) => {
    if (error) {
      throw new Error(`legacySignClient > session_request failed: ${error}`);
    }
    console.log("session requesting...", payload);
    ModalStore.open(
      "LegacySessionProposalModal",
      { legacyProposal: payload },
      clubWallet
    );
  });

  legacySignClient.on("connect", () => {
    console.log("legacySignClient > connect");
    setLegacySession(legacySignClient.session);
  });

  legacySignClient.on("error", (error) => {
    throw new Error(`legacySignClient > on error: ${error}`);
  });

  legacySignClient.on("call_request", (error, payload) => {
    if (error) {
      throw new Error(`legacySignClient > call_request failed: ${error}`);
    }
    onLegacyCallRequest(payload);
  });

  legacySignClient.on("disconnect", async () => {
    setLegacySession(undefined);
    deleteCachedLegacySession();
  });

  return legacySignClient;
}

function getCachedLegacySession(): IWalletConnectSession | undefined {
  if (typeof window === "undefined") return;

  const local = window.localStorage
    ? window.localStorage.getItem("walletconnect")
    : null;

  let session = null;
  if (local) {
    try {
      session = JSON.parse(local);
    } catch (error) {
      throw error;
    }
  }
  return session;
}

function deleteCachedLegacySession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("walletconnect");
}

const onLegacyCallRequest = async (payload: {
  id: number;
  method: string;
  params: any[];
}) => {
  switch (payload.method) {
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      // return ModalStore.open('LegacySessionSignModal', {
      //   legacyCallRequestEvent: payload,
      //   legacyRequestSession: legacySignClient.session
      // })
      console.log("request sign on");

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      // return ModalStore.open('LegacySessionSignTypedDataModal', {
      //   legacyCallRequestEvent: payload,
      //   legacyRequestSession: legacySignClient.session
      // })
      console.log("request typed data signing");

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      // return ModalStore.open('LegacySessionSendTransactionModal', {
      //   legacyCallRequestEvent: payload,
      //   legacyRequestSession: legacySignClient.session
      // })
      console.log("request transaction actions");

    default:
      alert(`${payload.method} is not supported for WalletConnect v1`);
  }
};
