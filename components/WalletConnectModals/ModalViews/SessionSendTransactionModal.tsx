import { Button, Divider, Loading, Modal, Text } from '@nextui-org/react'
import { Fragment, useState } from 'react'
import { approveEIP155Request, rejectEIP155Request, signClient } from '../../../lib/walletConnectLib'
import ProjectInfoCard from '../Components/ProjectInfoCard'
import RequestDataCard from '../Components/RequestDataCard'
import RequestDetailsCard from '../Components/RequestDetailsCard'
import RequestMethodCard from '../Components/RequestMethodCard'
import RequestModalContainer from '../Components/RequestModalContainer'
import ModalStore from '../ModalStore'

export default function SessionSendTransactionModal() {
  const [loading, setLoading] = useState(false)

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent
  const requestSession = ModalStore.state.data?.requestSession
  const clubWalletMnemonic = ModalStore.state.clubWallet?.club_wallet_mnemonic!

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>
  }

  // Get required proposal data

  const { topic, params } = requestEvent
  const { request, chainId } = params
  const transaction = request.params[0]

  // Handle approve action
  async function onApprove() {
    if (requestEvent) {
      setLoading(true)
      const response = await approveEIP155Request(requestEvent, clubWalletMnemonic)
      await signClient?.respond({
        topic,
        response
      })
      ModalStore.close()
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const response = rejectEIP155Request(requestEvent)
      await signClient?.respond({
        topic,
        response
      })
      ModalStore.close()
    }
  }

  return (
    <Fragment>
      <RequestModalContainer title="Send / Sign Transaction">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <Divider y={2} />

        <RequestDataCard data={transaction} />

        <Divider y={2} />

        <RequestMethodCard methods={[request.method]} />
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
