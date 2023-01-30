import { Button, Divider, Loading, Modal, Text } from '@nextui-org/react'
import { Fragment, useState } from 'react'
import { approveEIP155Request, legacySignClient, rejectEIP155Request } from '../../../lib/walletConnectLib'
import ProjectInfoCard from '../Components/ProjectInfoCard'
import RequestDataCard from '../Components/RequestDataCard'
import RequestDetailsCard from '../Components/RequestDetailsCard'
import RequestMethodCard from '../Components/RequestMethodCard'
import RequestModalContainer from '../Components/RequestModalContainer'
import ModalStore from '../ModalStore'

export default function LegacySessionSendTransactionModal() {
  const [loading, setLoading] = useState(false)

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent
  const requestSession = ModalStore.state.data?.legacyRequestSession
  const clubWalletMnemonic = ModalStore.state.clubWallet?.club_wallet_mnemonic!

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>
  }

  // Get required proposal data

  const { id, method, params } = requestEvent
  const transaction = params[0]

  // // Remove unneeded key coming from v1 sample dapp that throws Ethers.
  if (transaction['gas']) delete transaction['gas']

  // Handle approve action
  async function onApprove() {
    if (requestEvent) {
      const { result } = await approveEIP155Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '1' }
      }, clubWalletMnemonic)

      legacySignClient.approveRequest({
        id,
        result
      })
      ModalStore.close()
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const { error } = rejectEIP155Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '1' }
      })
      legacySignClient.rejectRequest({
        id,
        error
      })
      ModalStore.close()
    }
  }

  return (
    <Fragment>
      <RequestModalContainer title="Send / Sign Transaction">
        <ProjectInfoCard metadata={requestSession.peerMeta!} />

        <Divider y={2} />

        <RequestDataCard data={transaction} />

        <Divider y={2} />

        <RequestMethodCard methods={[method]} />
      </RequestModalContainer>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject} disabled={loading}>
          Reject
        </Button>
        <Button auto flat color="success" onClick={onApprove} disabled={loading}>
          {loading ? <Loading size="sm" color="success" /> : 'Approve'}
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
