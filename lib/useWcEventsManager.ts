import { useCallback, useEffect } from "react";
import { SignClientTypes } from '@walletconnect/types'
import { IClubWallet } from "../components/Widgets/WalletConnect";
import ModalStore from "../components/WalletConnectModals/ModalStore";
import { signClient } from "./walletConnectLib";
import { EIP155_SIGNING_METHODS } from "./ethereum";

export function useSignClientEventsManager(initialized: boolean, clubWallet: IClubWallet) {
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      console.log("Proposal params: ", proposal.params);
      ModalStore.open("SessionProposalModal", { proposal }, clubWallet);
    },
    []
  );

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
      console.log("session_request", requestEvent);
      const { topic, params } = requestEvent;
      const { request } = params;
      const requestSession = signClient.session.get(topic);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          return ModalStore.open(
            "SessionSignModal",
            { requestEvent, requestSession },
            clubWallet
          );

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          return ModalStore.open(
            "SessionSignTypedDataModal",
            { requestEvent, requestSession },
            clubWallet
          );

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          return ModalStore.open(
            "SessionSendTransactionModal",
            { requestEvent, requestSession },
            clubWallet
          );

        default:
          return ModalStore.open(
            "SessionUnsuportedMethodModal",
            { requestEvent, requestSession },
            clubWallet
          );
      }
    },
    []
  );
  useEffect(() => {
    if (initialized) {
      signClient.on("session_proposal", onSessionProposal);
      signClient.on("session_request", onSessionRequest);
    }
  }, [initialized,onSessionProposal, onSessionRequest]);
}