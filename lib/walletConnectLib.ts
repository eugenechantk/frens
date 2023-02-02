import SignClient from "@walletconnect/sign-client";
import LegacySignClient from "@walletconnect/client";
import { IWalletConnectSession } from "@walletconnect/legacy-types";
import ModalStore from "../components/WalletConnectModals/ModalStore";
import { EIP155_SIGNING_METHODS, initWallet } from "./ethereum";
import { IClubWallet } from "../components/Widgets/WalletConnect";
import { getSdkError } from "@walletconnect/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getChainData } from "./chains";
import { ethers } from "ethers";
import { getSignParamsMessage, getSignTypedDataParamsData } from "./HelperUtil";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { IClubInfo } from "./fetchers";

export let signClient: SignClient | undefined;
export let legacySignClient: LegacySignClient | undefined;
export let signClientInitialized: boolean;
let clubWallet: IClubWallet;

export async function clearSignClients() {
  // Kill all legacySign sessions
  legacySignClient?.killSession();
  // Kill all signClient sessions
  if (signClient?.session.values) {
    for await (const session of signClient?.session.values) {
      console.log("Disconnecting: ", session);
      await signClient?.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
  }
  signClient = undefined;
  legacySignClient = undefined;
  deleteCachedLegacySession();
}

// For sign client
export async function createSignClient(data: IClubInfo) {
  try {
    signClient = await SignClient.init({
      logger: "debug",
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      metadata: {
        name: `${data.club_name} wallet`,
        description: `frens club wallet for ${data.club_name}`,
        url: 'https://joinfrens.xyz/',
        icons: [data.club_image!]
      }
    });
    signClientInitialized = true;
    clubWallet = {
      club_wallet_address: data?.club_wallet_address!,
      club_wallet_mnemonic: data?.club_wallet_mnemonic!,
    };
  } catch (err) {
    console.log(err);
    return false;
  }
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
  clubId: string;
}) {
  // If URI is passed always create a new session,
  // otherwise fall back to cached session if client isn't already instantiated.
  if (uri) {
    legacySignClient = new LegacySignClient({ uri });
  } else if (!legacySignClient && getCachedLegacySession()) {
    const session = getCachedLegacySession();
    legacySignClient = new LegacySignClient({ session });
    setLegacySession(session);
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
    setLegacySession(legacySignClient?.session);
  });

  legacySignClient.on("error", (error) => {
    throw new Error(`legacySignClient > on error: ${error}`);
  });

  legacySignClient.on("call_request", (error, payload) => {
    console.log("Received call requests...", payload);
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

export function deleteCachedLegacySession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`walletconnect`);
}

const onLegacyCallRequest = async (payload: {
  id: number;
  method: string;
  params: any[];
}) => {
  switch (payload.method) {
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      return ModalStore.open(
        "LegacySessionSignModal",
        {
          legacyCallRequestEvent: payload,
          legacyRequestSession: legacySignClient?.session,
        },
        clubWallet
      );

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      return ModalStore.open(
        "LegacySessionSignTypedDataModal",
        {
          legacyCallRequestEvent: payload,
          legacyRequestSession: legacySignClient?.session,
        },
        clubWallet
      );

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      return ModalStore.open(
        "LegacySessionSendTransactionModal",
        {
          legacyCallRequestEvent: payload,
          legacyRequestSession: legacySignClient?.session,
        },
        clubWallet
      );

    default:
      alert(`${payload.method} is not supported for WalletConnect v1`);
  }
};

/*
For WC 1.0 sign client
Handle session requests from legacy sign client requests
*/
export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments["session_request"],
  clubWalletMnemonic: string
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const wallet = initWallet(clubWalletMnemonic);
  const rpcUrl = getChainData(
    parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
  ).rpc_url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      const signedMessage = await wallet.signMessage(message);
      return formatJsonRpcResult(id, signedMessage);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const {
        domain,
        types,
        message: data,
      } = getSignTypedDataParamsData(request.params);
      // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      delete types.EIP712Domain;
      const signedData = await wallet._signTypedData(domain, types, data);
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const sendTransaction = request.params[0];
      const connectedWallet = wallet.connect(provider);
      const { hash } = await connectedWallet.sendTransaction(sendTransaction);
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      const signature = await wallet.signTransaction(signTransaction);
      return formatJsonRpcResult(id, signature);

    default:
      throw new Error(getSdkError("INVALID_METHOD").message);
  }
}

export function rejectEIP155Request(
  request: SignClientTypes.EventArguments["session_request"]
) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError("USER_REJECTED_METHODS").message);
}
