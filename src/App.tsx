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
  /* align-items: center; */

  width: 100%;
  max-width: 370px;
  margin: 0 auto;
`

// const EMTG_ADDRESS = '0x570baDE252a629902D988b50b822D4f821e8b012'

const CHAIN_ID = 10

const Wallet = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 20px;
`

const Connect = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const Button = styled.button`
  height: 25px;
  width: 100px;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`

function App() {
  const account = useAccount()
  const { connectors, connect, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const owner = useMemo(() => account?.addresses?.[0], [account])

  const { tokenTransfers } = useTokenHistory({ owner: account?.addresses?.[0] })

  return (
    <Container>
      <div>{error?.message}</div>
        {account.isConnected && (
          <>
            <h3>Wallet</h3>
            <Wallet>
              <div>
                {shortenAddress(account?.addresses?.[0])}
                <br />
                {account?.chain?.name}
              </div>
              <Button type="button" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </Wallet>
            { account.chainId !== CHAIN_ID && (
              <button type="button" onClick={() => switchChain({ chainId: optimism.id })}>
                Switch Chain
              </button>
            )}
          </>
        )}


      { !account.isConnected && (<Connect>
        <h2>Connect</h2>
        { connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </Button>
        ))}
      </Connect>)}

      { account.isConnected && owner &&  (
        <TokensHistory transfers={tokenTransfers} owner={owner} symbol='EMTG' />
      )}
      
    </Container>
  )
}

export default App
