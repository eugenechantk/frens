import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { SessionTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'
import { Fragment } from 'react'
import { signClient } from '../../../lib/walletConnectLib'
import ProjectInfoCard from '../Components/ProjectInfoCard'
import RequestModalContainer from '../Components/RequestModalContainer'
import SessionProposalChainCard from '../Components/SessionProposalChainCard'
import ModalStore from '../ModalStore'

export default function SessionProposalModal() {
  // const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string[]>>({})
  // const hasSelected = Object.keys(selectedAccounts).length
  const clubWalletAddress = [ModalStore.state.clubWallet?.club_wallet_address!]

  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.proposal

  // Ensure proposal is defined
  if (!proposal) {
    return <Text>Missing proposal data</Text>
  }

  // Get required proposal data
  const { id, params } = proposal
  const { proposer, requiredNamespaces, relays } = params

  // // Add / remove address from EIP155 selection
  // function onSelectAccount(chain: string, account: string) {
  //   if (selectedAccounts[chain]?.includes(account)) {
  //     const newSelectedAccounts = selectedAccounts[chain]?.filter(a => a !== account)
  //     setSelectedAccounts(prev => ({
  //       ...prev,
  //       [chain]: newSelectedAccounts
  //     }))
  //   } else {
  //     const prevChainAddresses = selectedAccounts[chain] ?? []
  //     setSelectedAccounts(prev => ({
  //       ...prev,
  //       [chain]: [...prevChainAddresses, account]
  //     }))
  //   }
  // }

  // Hanlde approve action, construct session namespace
  async function onApprove() {
    if (proposal) {
      const namespaces: SessionTypes.Namespaces = {}
      console.log('RequiredNameSpaces: ', requiredNamespaces)
      Object.keys(requiredNamespaces).forEach(key => {
        const accounts: string[] = []
        requiredNamespaces[key].chains.map(chain => {
          accounts.push(`${chain}:${clubWalletAddress}`)
        })
        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events
        }
      })

      const { acknowledged } = await signClient!.approve({
        id,
        relayProtocol: relays[0].protocol,
        namespaces
      })
      await acknowledged()
      ModalStore.state.setSession!(signClient?.session.values)
    }
    ModalStore.close()
  }

  // Hanlde reject action
  async function onReject() {
    if (proposal) {
      await signClient?.reject({
        id,
        reason: getSdkError('USER_REJECTED_METHODS')
      })
    }
    ModalStore.close()
  }

  return (
    <Fragment>
      <RequestModalContainer title="Session Proposal">
        <ProjectInfoCard metadata={proposer.metadata} />

        {/* TODO(ilja) Relays selection */}

        <Divider y={2} />

        {Object.keys(requiredNamespaces).map(chain => {
          return (
            <Fragment key={chain}>
              <Text h4 css={{ marginBottom: '$5' }}>{`Review permissions`}</Text>
              <SessionProposalChainCard requiredNamespace={requiredNamespaces[chain]} />
              <Divider y={2} />
            </Fragment>
          )
        })}
      </RequestModalContainer>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject}>
          Reject
        </Button>

        <Button
          auto
          flat
          color="success"
          onClick={onApprove}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
