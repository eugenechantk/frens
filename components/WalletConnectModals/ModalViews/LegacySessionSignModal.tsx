
import { Button, Col, Divider, Modal, Row, Text } from '@nextui-org/react'
import { Fragment } from 'react'
import { getSignParamsMessage } from '../../../lib/HelperUtil'
import { approveEIP155Request, legacySignClient, rejectEIP155Request } from '../../../lib/walletConnectLib'
import ProjectInfoCard from '../Components/ProjectInfoCard'
import RequestDetailsCard from '../Components/RequestDetailsCard'
import RequestMethodCard from '../Components/RequestMethodCard'
import RequestModalContainer from '../Components/RequestModalContainer'
import ModalStore from '../ModalStore'

export default function LegacySessionSignModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent
  const requestSession = ModalStore.state.data?.legacyRequestSession

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>
  }

  // Get required request data
  const { id, method, params } = requestEvent

  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(params)

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {
      const { result } = await approveEIP155Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '1' }
      }, ModalStore.state.clubWallet?.club_wallet_mnemonic!)

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
      <RequestModalContainer title="Sign Message">
        <ProjectInfoCard metadata={requestSession.peerMeta!} />

        <Divider y={2} />

        <RequestDetailsCard
          chains={['eip155:' + legacySignClient.chainId]}
          protocol={legacySignClient.protocol}
        />

        <Divider y={2} />

        <Row>
          <Col>
            <Text h5>Message</Text>
            <Text color="$gray400">{message}</Text>
          </Col>
        </Row>

        <Divider y={2} />

        <RequestMethodCard methods={[method]} />
      </RequestModalContainer>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject}>
          Reject
        </Button>
        <Button auto flat color="success" onClick={onApprove}>
          Approve
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
