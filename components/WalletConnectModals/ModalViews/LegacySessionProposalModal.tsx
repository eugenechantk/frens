import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { getSdkError } from '@walletconnect/utils'
import { Fragment, useState } from 'react'
import { legacySignClient } from '../../../lib/walletconnect'
import ProjectInfoCard from '../Components/ProjectInfoCard'
import ProposalSelectSection from '../Components/ProposalSelectSection'
import RequestModalContainer from '../Components/RequestModalContainer'
import ModalStore from '../ModalStore'

export default function LegacySessionProposalModal() {
  // const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string[]>>({})
  // const hasSelected = Object.keys(selectedAccounts).length
  const clubWalletAddress = [ModalStore.state.clubWallet?.club_wallet_address!]

  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.legacyProposal

  // Ensure proposal is defined
  if (!proposal) {
    return <Text>Missing proposal data</Text>
  }

  // Get required proposal data
  const { id, params } = proposal
  const [{ chainId, peerMeta }] = params

  // Add / remove address from EIP155 selection
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
      legacySignClient.approveSession({
        accounts: clubWalletAddress,
        chainId: parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!) ?? 1
      })
    }
    ModalStore.close()
  }

  // Handle reject action
  function onReject() {
    if (proposal) {
      legacySignClient.rejectSession(getSdkError('USER_REJECTED_METHODS'))
    }
    ModalStore.close()
  }

  // Render account selection checkboxes based on chain
  // function renderAccountSelection(chain: string) {
  //   if (isEIP155Chain(chain)) {
  //     return (
  //       <ProposalSelectSection
  //         addresses={eip155Addresses}
  //         selectedAddresses={selectedAccounts[chain]}
  //         onSelect={onSelectAccount}
  //         chain={chain}
  //       />
  //     )
  //   }
  // }

  return (
    <Fragment>
      <RequestModalContainer title="Session Proposal">
        <ProjectInfoCard metadata={peerMeta} />
        {/* <Divider y={2} />
        {renderAccountSelection('eip155')}
        <Divider y={2} /> */}
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
