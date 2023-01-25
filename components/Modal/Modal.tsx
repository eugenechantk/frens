import { Modal as NextModal } from '@nextui-org/react'
import { useSnapshot } from 'valtio'
import ModalStore from '../WalletConnectModals/ModalStore'
import LegacySessionProposalModal from '../WalletConnectModals/ModalViews/LegacySessionProposalModal'

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state)

  return (
    <NextModal blur open={open} style={{ border: '1px solid rgba(139, 139, 139, 0.4)' }}>
      {view === 'LegacySessionProposalModal' && <LegacySessionProposalModal/>}
    </NextModal>
  )
}
