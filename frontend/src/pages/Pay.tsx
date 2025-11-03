import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { getSigner, getGateway } from '../lib/web3'
import { Alert } from '../components/Alert'
import { Navbar } from '../components/Navbar'

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
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${BACKEND_URL}/api/payments/${slug}`).then(r => setRecent(r.data.payments)),
      axios.get(`${BACKEND_URL}/api/users/by-slug/${slug}`).then(r => {
        setReceiver(r.data.walletAddress)
        setReceiverName(r.data.name || slug)
      }).catch(() => {
        setErr('User not found. Please check the payment link.')
      })
    ]).finally(() => setLoadingUser(false))
  }, [slug])

  async function pay() {
    setErr('')
    setOk('')
    setTxHash('')
    setLoading(true)

    try {
      const signer = await getSigner()
      const gateway = getGateway(GATEWAY_ADDRESS, signer)
      
      if (!GATEWAY_ADDRESS) {
        throw new Error('Payment contract not configured.')
      }

      const network = await signer.provider!.getNetwork()
      if (Number(network.chainId) !== 80002) {
        throw new Error('Please switch MetaMask network to Polygon Amoy (chainId 80002).')
      }

      if (!receiver || !/^0x[a-fA-F0-9]{40}$/.test(receiver)) {
        throw new Error('Invalid receiver address.')
      }

      const amt = Number(amount)
      if (!isFinite(amt) || amt <= 0) {
        throw new Error('Enter a valid positive amount.')
      }

      let code = '0x'
      try {
        code = await signer.provider!.getCode(receiver)
      } catch {}
      
      if (code && code !== '0x') {
        throw new Error('Receiver is a contract address. Please use a wallet (EOA).')
      }

      if (token === 'MATIC') {
        const value = ethers.parseEther(amount)
        const to = receiver || (recent[0]?.receiver || '')
        
        if (!to) {
          throw new Error('Receiver not found yet. Ask owner to create at least one payment or share wallet.')
        }

        const tx = await gateway.payNative(to, slug, memo || '', { value })
        setOk('⏳ Transaction submitted! Waiting for confirmation...')
        
        const receipt = await tx.wait()
        setTxHash(receipt.hash)
        setOk('✅ Payment successful! Transaction confirmed on-chain.')
        setAmount('')
        setMemo('')
        
        setTimeout(() => {
          axios.get(`${BACKEND_URL}/api/payments/${slug}`).then(r => setRecent(r.data.payments))
        }, 2000)
      } else {
        throw new Error('ERC20 payments coming soon. Please use MATIC for now.')
      }
    } catch (e: any) {
      setErr(e?.reason || e?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function formatAmount(wei: string): string {
    try {
      const eth = Number(wei) / 1e18
      return eth > 0.001 ? eth.toFixed(4) : eth.toExponential(2)
    } catch {
      return '0'
    }
  }

  if (loadingUser) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="glass pad" style={{ maxWidth: '600px', margin: '64px auto', textAlign: 'center' }}>
            <span className="loading" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></span>
            <p className="muted" style={{ marginTop: '16px' }}>Loading payment page...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass pad" style={{ marginTop: '32px', marginBottom: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '8px' }}>
              Pay {receiverName || slug}
            </h2>
            <p className="muted">Send MATIC payment securely on Polygon network</p>
          </div>

          {err && <Alert kind="error">{err}</Alert>}
          {ok && <Alert kind="success">{ok}</Alert>}

          {txHash && (
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <a 
                href={`https://amoy.polygonscan.com/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-accent"
                style={{ fontSize: '14px', padding: '10px 20px' }}
              >
                🔍 View on PolygonScan
              </a>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
              Recipient Wallet
            </label>
            <input 
              className="input" 
              placeholder="Receiver wallet (0x...)" 
              value={receiver} 
              readOnly 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
            />
            <p className="muted" style={{ marginTop: '4px', fontSize: '12px' }}>
              ✓ Verified wallet address from payment link
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
              Amount
            </label>
            <input 
              className="input" 
              placeholder="0.00" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              type="number"
              step="0.001"
              min="0"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
              Token
            </label>
            <select 
              className="input" 
              value={token} 
              onChange={e => setToken(e.target.value as any)}
            >
              <option value="MATIC">MATIC (Native Token)</option>
              <option value="ERC20">USDC (Coming Soon)</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
              Memo (Optional)
            </label>
            <input 
              className="input" 
              placeholder="Add a note for this payment..." 
              value={memo} 
              onChange={e => setMemo(e.target.value)} 
              maxLength={100}
            />
          </div>

          <button 
            onClick={pay} 
            className="btn btn-success" 
            disabled={loading || !amount || !receiver}
            style={{ width: '100%', fontSize: '16px', padding: '16px' }}
          >
            {loading ? (
              <>
                <span className="loading"></span> Processing Payment...
              </>
            ) : (
              <>💰 Pay {amount || '0'} MATIC Now</>
            )}
          </button>

          <p className="muted" style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px' }}>
            🔒 Secure transaction powered by Polygon smart contracts
          </p>
        </div>

        {recent.length > 0 && (
          <div className="glass pad">
            <h3 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>
              📊 Recent Payments to {receiverName}
            </h3>
            <div>
              {recent.slice(0, 5).map((p, i) => (
                <div key={i} className="payment-row">
                  <div>
                    <div className="badge badge-success">✓ Confirmed</div>
                    {p.memo && <p className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>"{p.memo}"</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                      {formatAmount(p.amount)} MATIC
                    </div>
                    {p.timestamp && (
                      <div className="muted" style={{ fontSize: '12px' }}>
                        {new Date(p.timestamp * 1000).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
