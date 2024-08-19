import { useEffect, useState } from "react"

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/proxy/83308/emtg-opt/version/latest'

const fetchTokenHistory = async (owner: string) => {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        transfers(where: {
          or: [
            { from: "${owner}" },
            { to: "${owner}" },
          ]
        }, orderBy: timestamp, orderDirection: desc) {
          from
          to
          initializator
          timestamp
          txHash
          blockNumber
          amount
        }
      }`,
    }),
  }).then((res) => res.json())
  return res.data
}

export type TokenTransfer = {
  from: string
  to: string
  initializator: string
  timestamp: number
  txHash: string
  blockNumber: number
  amount: string
}

const useTokenHistory = ({ owner }: { owner: string | undefined }) => {

  const [tokenTransfers, setTokenTransfers] = useState<TokenTransfer[]>([])

  useEffect(() => {
    if (owner) {
      fetchTokenHistory(owner).then((data) => {
        console.log(123, data)
        setTokenTransfers(data.transfers)
      })
    } else {
      setTokenTransfers([])
    }
  }, [owner])

  return { tokenTransfers }
  
}

export { useTokenHistory }