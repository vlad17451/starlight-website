import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { optimism } from 'wagmi/chains'
import styled from 'styled-components'
import { useMemo } from 'react'
import { useTokenHistory } from './hooks/useTokenHistory'
import TokensHistory from './components/TokensHistory'
import { shortenAddress } from './utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

// const EMTG_ADDRESS = '0x570baDE252a629902D988b50b822D4f821e8b012'

const CHAIN_ID = 10

function App() {
  const account = useAccount()
  const { connectors, connect, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const owner = useMemo(() => account?.addresses?.[0], [account])

  const { tokenTransfers } = useTokenHistory({ owner: account?.addresses?.[0] })

  return (
    <Container>
      <div>
        <div>{error?.message}</div>

        <h2>Account</h2>

        { account.isConnected && account.chainId !== CHAIN_ID && (
          <button type="button" onClick={() => switchChain({ chainId: optimism.id })}>
            Switch Chain
          </button>
        )}
        
        <div>
          address: {shortenAddress(account?.addresses?.[0])}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <h2>Connect</h2>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          type="button"
        >
          {connector.name}
        </button>
      ))}
      {/* <div>{status}</div> */}

      { account.isConnected && owner &&  (
        <TokensHistory transfers={tokenTransfers} owner={owner} symbol='EMTG' />
      )}
      
    </Container>
  )
}

export default App
