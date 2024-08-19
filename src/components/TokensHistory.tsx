import styled from 'styled-components'
import { useCallback } from 'react'
import { TokenTransfer } from '../hooks/useTokenHistory'
import { ethers } from 'ethers'
import { shortenAddress } from '../utils'

const Container = styled.div``
const Title = styled.h3``

const Items = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
`
const Item = styled.div`
  font-size: 14px;
  width: 400px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #FFFFFF30;

  &:not(:last-child) {
    margin-bottom: 12px;
  }
`

const Left = styled.div``
const Right = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
`

const Bottom = styled.div`
  display: flex;
  /* justify-content: space-between; */
`

const Link = styled.a`
  margin-left: 10px;
  opacity: .7;
`

const Addresses = styled.div`
  opacity: .5;
  width: 280px;
  display: flex;
  justify-content: space-between;
  div:not(:last-child) {
    margin-right: 12px;
  }
`

const Symbol = styled.span`
  font-size: 12px;
`

const Green = styled.span`
  color: #46c065;
`

const Red = styled.span`
  color: #94405c;
`




export default function TokensHistory({ transfers, owner, symbol }: {
  transfers: TokenTransfer[],
  owner: string,
  symbol: string
}) {

  const isOut = useCallback((transfer: TokenTransfer) => {
    return transfer.from.toLocaleLowerCase() === owner.toLocaleLowerCase()
  }, [])

  const addresses = useCallback((transfer: TokenTransfer): [string, string] => {
    if (isOut(transfer)) {
      return [transfer.from, transfer.to]
    }
    return [transfer.to, transfer.from]
  }, [])

  return (
    <Container>
      <Title>Token Transfers</Title>
      <Items>
        {transfers.map((transfer) => (
          <Item id={transfer.txHash}>
            <Left>
              <Addresses>
                <div>{ shortenAddress(addresses(transfer)[0]) }</div>
                <div>{ isOut(transfer) ? '->' : '<-'}</div>
                <div>{ shortenAddress(addresses(transfer)[1]) }</div>
              </Addresses>
              <Bottom>
                <div>
                  {new Date(transfer.timestamp * 1000).toLocaleString()}
                </div>
                <Link href={`https://optimistic.etherscan.io/tx/${transfer.txHash}`} target="_blank" rel="noreferrer">
                  link
                </Link>
              </Bottom>
              
            </Left>
            <Right>
              {/* {transfer.amount} EMTG */}
              { transfer.from.toLocaleLowerCase() === owner?.toLocaleLowerCase() && <Red>{ethers.formatUnits(transfer.amount, 18)} <Symbol>{symbol}</Symbol></Red> }
              { transfer.to.toLocaleLowerCase()   === owner?.toLocaleLowerCase() && <Green>{ethers.formatUnits(transfer.amount, 18)} <Symbol>{symbol}</Symbol></Green> }
            </Right>
          </Item>
        ))}
      </Items>
    </Container>
    
  )
}