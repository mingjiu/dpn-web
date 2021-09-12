import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex} from '@pancakeswap/uikit'

const ApyLabelContainer = styled(Flex)`
`

export interface ApyLabelProps {
  variant: 'text' 
  pid: number
  lpSymbol: string
  lpLabel?: string
  multiplier: string
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
}

const ApyLabel: React.FC<ApyLabelProps> = ({
  variant,
  pid,
  lpLabel,
  lpSymbol,
  cakePrice,
  apr,
  multiplier,
  displayApr,
  addLiquidityUrl,
}) => { 

  return (
    <ApyLabelContainer>
      {displayApr}%
    </ApyLabelContainer>
  )
}

export default ApyLabel
