import { ethers } from "ethers"

export function shortenAddress(address: string | undefined, chars = 5) {
  if (!address) return ''
  const prefix = address.slice(0, chars + 2) // Include '0x'
  const suffix = address.slice(-chars)
  return `${prefix}...${suffix}`
}

export const replaceZeroAddress = (address: string, replacer: string) => {
  return address === ethers.ZeroAddress ? replacer : address
}
