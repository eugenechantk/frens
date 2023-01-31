import { Col, Divider, Row, Text } from '@nextui-org/react'
import { Fragment } from 'react'
import { EIP155_CHAINS, TEIP155Chain } from '../../../lib/chains'

/**
 * Types
 */
interface IProps {
  chains: string[]
  protocol: string
}

/**
 * Component
 */
export default function RequestDetailsCard({ chains, protocol }: IProps) {
  return (
    <Fragment>
      <Row>
        <Col>
          <Text h5>Blockchain(s)</Text>
          <Text color="$gray700">
            {chains
              .map(
                chain =>
                  EIP155_CHAINS[chain as TEIP155Chain]?.name ??
                  chain
              )
              .join(', ')}
          </Text>
        </Col>
      </Row>
    </Fragment>
  )
}
