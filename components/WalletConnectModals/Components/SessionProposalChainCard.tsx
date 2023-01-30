import { Col, Row, Text } from '@nextui-org/react'
import { ProposalTypes } from '@walletconnect/types'
import { Fragment } from 'react'
import ChainCard from './ChainCard'
/**
 * Types
 */
interface IProps {
  requiredNamespace: ProposalTypes.RequiredNamespace
}

/**
 * Component
 */
export default function SessionProposalChainCard({ requiredNamespace }: IProps) {
  return (
    <Fragment>
      {requiredNamespace.chains.map(chainId => {
        const extensionMethods: ProposalTypes.RequiredNamespace['methods'] = []
        const extensionEvents: ProposalTypes.RequiredNamespace['events'] = []

        requiredNamespace.extension?.map(({ chains, methods, events }) => {
          if (chains.includes(chainId)) {
            extensionMethods.push(...methods)
            extensionEvents.push(...events)
          }
        })

        const allMethods = [...requiredNamespace.methods, ...extensionMethods]
        const allEvents = [...requiredNamespace.events, ...extensionEvents]

        return (
          <ChainCard key={chainId} rgb={''} flexDirection="col" alignItems="flex-start">
            <Row>
              <Col>
                <Text h6>Methods</Text>
                <Text color="$gray700">{allMethods.length ? allMethods.join(', ') : '-'}</Text>
              </Col>
            </Row>
            <Row css={{ marginTop: '$5' }}>
              <Col>
                <Text h6>Events</Text>
                <Text color="$gray700">{allEvents.length ? allEvents.join(', ') : '-'}</Text>
              </Col>
            </Row>
          </ChainCard>
        )
      })}
    </Fragment>
  )
}
