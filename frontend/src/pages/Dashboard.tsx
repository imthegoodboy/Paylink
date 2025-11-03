import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import QRCode from 'qrcode'
import { getSigner } from '../lib/web3'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export function Dashboard() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [wallet, setWallet] = useState('')
  const [token, setToken] = useState('')
  const [qr, setQr] = useState('')
  const [payments, setPayments] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const paymentLink = useMemo(() => `${window.location.origin}/pay/${slug || 'your-slug'}`, [slug])

  useEffect(() => {
    if (slug) QRCode.toDataURL(paymentLink).then(setQr)
  }, [slug, paymentLink])

  async function connectAndSignup() {
    const signer = await getSigner()
    const addr = await signer.getAddress()
    setWallet(addr)
    const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, { email, walletAddress: addr, name })
    setToken(res.data.token)
    // If user already had a slug, load it and hydrate UI
    try {
      const me = await axios.get(`${BACKEND_URL}/api/users/me`, { headers: { Authorization: `Bearer ${res.data.token}` } })
      if (me?.data?.user?.slug) {
        setSlug(me.data.user.slug)
        const link = `${window.location.origin}/pay/${me.data.user.slug}`
        QRCode.toDataURL(link).then(setQr)
        axios.get(`${BACKEND_URL}/api/payments/${me.data.user.slug}`).then(r => setPayments(r.data.payments))
        axios.get(`${BACKEND_URL}/api/payments/summary/${me.data.user.slug}`).then(r => setSummary(r.data))
      }
    } catch {}
  }

  async function saveSlug() {
    await axios.post(`${BACKEND_URL}/api/users/link`, { desiredSlug: slug }, { headers: { Authorization: `Bearer ${token}` } })
    if (slug) {
      QRCode.toDataURL(paymentLink).then(setQr)
      axios.get(`${BACKEND_URL}/api/payments/${slug}`).then(r => setPayments(r.data.payments))
      axios.get(`${BACKEND_URL}/api/payments/summary/${slug}`).then(r => setSummary(r.data))
    }
  }

  return (
    <div className="container">
      <h2 className="title">Dashboard</h2>
      <div className="row" style={{ alignItems: 'stretch' }}>
        <div className="col">
          <div className="glass pad">
            <h3 className="title">1) Sign up</h3>
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <button onClick={connectAndSignup} className="btn">Connect Wallet + Sign up</button>
            {wallet && <>
              <p className="muted" style={{ marginTop: 8 }}>Connected wallet (prefilled for payments)</p>
              <input className="input" value={wallet} readOnly />
            </>}
          </div>
        </div>
        <div className="col">
          <div className="glass pad">
            <h3 className="title">2) Your Payment Link</h3>
            <input className="input" placeholder="your-slug" value={slug} onChange={e => setSlug(e.target.value)} />
            <button disabled={!token || !slug} onClick={saveSlug} className="btn">Save Link</button>
            <p className="muted" style={{ marginTop: 8 }}>Link: {paymentLink}</p>
            {qr && <img src={qr} width={180} />}
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <div className="col">
          <div className="glass pad">
            <h3 className="title">Recent Payments</h3>
            {payments.length === 0 ? <p className="muted">No payments yet.</p> : (
              <div>
                {payments.slice(0, 8).map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
                    <span className="muted">{p.payer?.slice(0,6)}...{p.payer?.slice(-4)}</span>
                    <span>{Number(p.amount)} wei</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col">
          <div className="glass pad">
            <h3 className="title">Summary</h3>
            {summary ? (
              <div className="muted">
                <div>Total payments: {summary.totalCount}</div>
                <div>Total amount (wei): {summary.totalAmount}</div>
                <div>Last 7d: {summary.last7d.count} tx / {summary.last7d.amount} wei</div>
                <div>Last 30d: {summary.last30d.count} tx / {summary.last30d.amount} wei</div>
              </div>
            ) : <p className="muted">No summary yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const input: React.CSSProperties = { display: 'block', width: '100%', padding: 10, marginBottom: 8, borderRadius: 8, border: '1px solid #ddd' }
const btn: React.CSSProperties = { padding: '10px 14px', background: '#8247e5', color: '#fff', borderRadius: 8, border: 0 }


