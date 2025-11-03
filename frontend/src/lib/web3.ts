import { ethers } from 'ethers'

export const PAYMENT_GATEWAY_ABI = [
  "function payNative(address receiver, string slug, string memo) payable",
  "function payERC20(address token, uint256 amount, address receiver, string slug, string memo)"
]

export function getProvider() {
  if ((window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum)
  }
  throw new Error('No injected provider found')
}

export async function getSigner() {
  const provider = getProvider()
  await provider.send('eth_requestAccounts', [])
  return await provider.getSigner()
}

export function getGateway(address: string, signerOrProvider: any) {
  return new ethers.Contract(address, PAYMENT_GATEWAY_ABI, signerOrProvider)
}


