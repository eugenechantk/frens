import { Modal as NextModal } from "@nextui-org/react";
import { useSnapshot } from "valtio";
import ModalStore from "./ModalStore";
import LegacySessionProposalModal from "./ModalViews/LegacySessionProposalModal";
import LegacySessionSignModal from "./ModalViews/LegacySessionSignModal";
import SessionProposalModal from "./ModalViews/SessionProposalModal";

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);

  return (
    <NextModal
      blur
      open={open}
      style={{ border: "1px solid rgba(139, 139, 139, 0.4)" }}
    >
      {view === "LegacySessionProposalModal" && <LegacySessionProposalModal />}
      {view === "SessionProposalModal" && <SessionProposalModal />}
      {view === "LegacySessionSignModal" && <LegacySessionSignModal />}
    </NextModal>
  );
}
