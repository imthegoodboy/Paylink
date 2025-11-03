import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { getSigner, getGateway } from '../lib/web3'
import { Alert } from '../components/Alert'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
const GATEWAY_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''

export function Pay() {
  const { slug = '' } = useParams()
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState<'MATIC' | 'ERC20'>('MATIC')
  const [receiver, setReceiver] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [memo, setMemo] = useState('')
  const [recent, setRecent] = useState<any[]>([])
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/payments/${slug}`).then(r => setRecent(r.data.payments))
    axios.get(`${BACKEND_URL}/api/users/by-slug/${slug}`).then(r => {
      setReceiver(r.data.walletAddress)
      setReceiverName(r.data.name || slug)
    }).catch(() => {})
  }, [slug])

  async function pay() {
    setErr(''); setOk('')
    const signer = await getSigner()
    const gateway = getGateway(GATEWAY_ADDRESS, signer)
    if (!GATEWAY_ADDRESS) return alert('Payment contract not configured.')

    // Ensure Polygon Amoy network (80002)
    const network = await signer.provider!.getNetwork()
    if (Number(network.chainId) !== 80002) {
      return alert('Please switch MetaMask network to Polygon Amoy (chainId 80002).')
    }

    // Basic validations
    if (!receiver || !/^0x[a-fA-F0-9]{40}$/.test(receiver)) {
      return alert('Invalid receiver address.')
    }
    const amt = Number(amount)
    if (!isFinite(amt) || amt <= 0) {
      return alert('Enter a valid positive amount.')
    }
    // Block sending to contract addresses to avoid reverts when forwarding native MATIC
    let code = '0x'
    try {
      code = await signer.provider!.getCode(receiver)
    } catch {}
    if (code && code !== '0x') {
      return alert('Receiver is a contract address. Please use a wallet (EOA).')
    }
    if (token === 'MATIC') {
      const value = ethers.parseEther(amount)
      const to = receiver || (recent[0]?.receiver || '')
      if (!to) return alert('Receiver not found yet. Ask owner to create at least one payment or share wallet.')
      try {
        const tx = await gateway.payNative(to, slug, memo, { value })
        const receipt = await tx.wait()
        setOk(`Success! Tx: ${receipt.hash}`)
      } catch (e: any) {
        setErr(e?.reason || e?.message || 'Payment failed')
      }
    } else {
      alert('ERC20 demo: add token address + approval flow later')
    }
  }

  return (
    <div className="container">
      <div className="glass pad" style={{ maxWidth: 560, margin: '32px auto' }}>
        <h2 className="title">Send payment to {receiverName || slug}</h2>
        {err && <Alert kind="error">{err}</Alert>}
        {ok && <Alert kind="success">{ok}</Alert>}
        <input className="input" placeholder="Receiver wallet (0x...)" value={receiver} readOnly />
        <p className="muted" style={{ marginTop: 4 }}>Prefilled from the creator's connected wallet</p>
        <input className="input" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <select className="input" value={token} onChange={e => setToken(e.target.value as any)}>
        <option value="MATIC">MATIC</option>
        <option value="ERC20">USDC (demo)</option>
      </select>
        <input className="input" placeholder="Memo (optional)" value={memo} onChange={e => setMemo(e.target.value)} />
        <button onClick={pay} className="btn">Pay Now</button>
        <p className="muted" style={{ marginTop: 12 }}>After payment, you’ll see it on the dashboard within seconds.</p>
      </div>
    </div>
  )
}

const input: React.CSSProperties = { display: 'block', width: '100%', padding: 10, marginBottom: 8, borderRadius: 8, border: '1px solid #ddd' }
const btn: React.CSSProperties = { padding: '10px 14px', background: '#0ea5e9', color: '#fff', borderRadius: 8, border: 0 }


