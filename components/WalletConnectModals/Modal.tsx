import { Modal as NextModal } from "@nextui-org/react";
import { useSnapshot } from "valtio";
import ModalStore from "./ModalStore";
import LegacySessionProposalModal from "./ModalViews/LegacySessionProposalModal";
import LegacySessionSendTransactionModal from "./ModalViews/LegacySessionSendTransactionModal";
import LegacySessionSignModal from "./ModalViews/LegacySessionSignModal";
import LegacySessionSignTypedDataModal from "./ModalViews/LegacySessionSignTypedDataModal";
import SessionProposalModal from "./ModalViews/SessionProposalModal";
import SessionSignModal from "./ModalViews/SessionSignModal";
import SessionSignTypedDataModal from "./ModalViews/SessionSignTypedDataModal";

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);

  return (
    <NextModal
      blur
      open={open}
      style={{ border: "1px solid rgba(139, 139, 139, 0.4)" }}
    >
      {view === "SessionProposalModal" && <SessionProposalModal />}
      {view === 'SessionSignModal' && <SessionSignModal />}
      {view === 'SessionSignTypedDataModal' && <SessionSignTypedDataModal />}
      {/* Modals for Legacy WC sign clients */}
      {view === "LegacySessionProposalModal" && <LegacySessionProposalModal />}
      {view === "LegacySessionSignModal" && <LegacySessionSignModal />}
      {view === 'LegacySessionSignTypedDataModal' && <LegacySessionSignTypedDataModal />}
      {view === 'LegacySessionSendTransactionModal' && <LegacySessionSendTransactionModal/>}
    </NextModal>
  );
}
