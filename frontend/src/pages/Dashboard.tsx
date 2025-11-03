import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import QRCode from 'qrcode'
import { getSigner } from '../lib/web3'
import { Alert } from '../components/Alert'
import { Navbar } from '../components/Navbar'
import { generateInvoicePDF } from '../lib/pdfGenerator'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [paymentCount, setPaymentCount] = useState(0)
  const [showUpgrade, setShowUpgrade] = useState(false)
  
  const paymentLink = useMemo(() => `${window.location.origin}/pay/${slug || 'your-slug'}`, [slug])
  const isFreeTrial = paymentCount < 5
  const remainingFreePayments = Math.max(0, 5 - paymentCount)

  useEffect(() => {
    if (slug && slug !== 'your-slug') {
      QRCode.toDataURL(paymentLink, { width: 256, margin: 2, color: { dark: '#0a0e27', light: '#ffffff' } }).then(setQr)
    }
  }, [slug, paymentLink])

  async function connectAndSignup() {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const signer = await getSigner()
      const addr = await signer.getAddress()
      setWallet(addr)
      const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, { email, walletAddress: addr, name })
      setToken(res.data.token)
      setSuccess('✅ Wallet connected successfully!')
      
      try {
        const me = await axios.get(`${BACKEND_URL}/api/users/me`, { headers: { Authorization: `Bearer ${res.data.token}` } })
        if (me?.data?.user?.slug) {
          setSlug(me.data.user.slug)
          const link = `${window.location.origin}/pay/${me.data.user.slug}`
          QRCode.toDataURL(link, { width: 256, margin: 2 }).then(setQr)
          loadPaymentData(me.data.user.slug)
        }
      } catch {}
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  async function saveSlug() {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await axios.post(`${BACKEND_URL}/api/users/link`, { desiredSlug: slug }, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('✅ Payment link created successfully!')
      if (slug) {
        QRCode.toDataURL(paymentLink, { width: 256, margin: 2 }).then(setQr)
        loadPaymentData(slug)
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Slug already taken or invalid')
    } finally {
      setLoading(false)
    }
  }

  async function loadPaymentData(userSlug: string) {
    try {
      const [paymentsRes, summaryRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/payments/${userSlug}`),
        axios.get(`${BACKEND_URL}/api/payments/summary/${userSlug}`)
      ])
      setPayments(paymentsRes.data.payments)
      setSummary(summaryRes.data)
      setPaymentCount(paymentsRes.data.payments.length)
      if (paymentsRes.data.payments.length >= 5) {
        setShowUpgrade(true)
      }
    } catch (e) {
      console.error('Failed to load payment data:', e)
    }
  }

  function exportToPDF() {
    if (!slug || payments.length === 0) {
      setError('No payments to export')
      return
    }
    
    try {
      generateInvoicePDF({
        slug,
        name,
        walletAddress: wallet,
        payments
      })
      setSuccess('✅ Invoice PDF downloaded successfully!')
    } catch (e) {
      setError('Failed to generate PDF')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function formatAmount(wei: string): string {
    try {
      const eth = Number(wei) / 1e18
      return eth > 0.001 ? eth.toFixed(4) : eth.toExponential(2)
    } catch {
      return '0'
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {isFreeTrial && slug && (
          <div style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
            border: '1px solid var(--success)',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>🎁 Free Trial Active</div>
              <div className="muted" style={{ fontSize: '14px' }}>
                {remainingFreePayments} free payments remaining • Upgrade for unlimited access
              </div>
            </div>
            <button className="btn btn-accent" style={{ padding: '10px 20px' }} onClick={() => setShowUpgrade(true)}>
              Upgrade Now
            </button>
          </div>
        )}

        {showUpgrade && paymentCount >= 5 && (
          <div className="glass pad" style={{
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
            borderColor: 'var(--primary)'
          }}>
            <h3 className="title" style={{ fontSize: '20px', marginBottom: '12px' }}>🚀 Upgrade to Premium</h3>
            <p className="muted" style={{ marginBottom: '16px' }}>
              You've reached the free trial limit. Upgrade to unlock unlimited payments and premium features!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>✓ Unlimited Payments</div>
                <div className="muted" style={{ fontSize: '12px' }}>No monthly limits</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>✓ Custom Branding</div>
                <div className="muted" style={{ fontSize: '12px' }}>Personalize your page</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>✓ PDF Invoices</div>
                <div className="muted" style={{ fontSize: '12px' }}>Export anytime</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>✓ Priority Support</div>
                <div className="muted" style={{ fontSize: '12px' }}>24/7 assistance</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-success" style={{ flex: '1', minWidth: '200px' }}>
                Upgrade for 0.1 MATIC/month
              </button>
              <button className="btn" style={{ flex: '1', minWidth: '200px' }} onClick={() => setShowUpgrade(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        )}

        <header style={{ marginBottom: '32px' }}>
          <div>
            <h1 className="title" style={{ fontSize: '32px', margin: 0 }}>💳 PayLink Dashboard</h1>
            <p className="muted" style={{ marginTop: '8px' }}>Manage your payment links and track transactions</p>
          </div>
        </header>

      {error && <Alert kind="error">{error}</Alert>}
      {success && <Alert kind="success">{success}</Alert>}

      <div className="row" style={{ alignItems: 'stretch', marginBottom: '24px' }}>
        <div className="col">
          <div className="glass pad" style={{ height: '100%' }}>
            <h3 className="title" style={{ fontSize: '20px' }}>🔐 Connect Your Wallet</h3>
            <p className="muted" style={{ marginBottom: '16px' }}>Sign up or login with MetaMask to get started</p>
            <input 
              className="input" 
              placeholder="your@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email"
            />
            <input 
              className="input" 
              placeholder="Your Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <button onClick={connectAndSignup} className="btn" disabled={loading || !email} style={{ width: '100%' }}>
              {loading ? <><span className="loading"></span> Connecting...</> : '🦊 Connect Wallet + Sign Up'}
            </button>
            {wallet && (
              <div style={{ marginTop: '16px' }}>
                <p className="muted" style={{ marginBottom: '8px' }}>Connected Wallet</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" value={wallet} readOnly style={{ flex: 1 }} />
                  <button onClick={() => copyToClipboard(wallet)} className="copy-btn">
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col">
          <div className="glass pad" style={{ height: '100%' }}>
            <h3 className="title" style={{ fontSize: '20px' }}>🔗 Your Payment Link</h3>
            <p className="muted" style={{ marginBottom: '16px' }}>Create a unique slug for your payment page</p>
            <input 
              className="input" 
              placeholder="your-unique-slug" 
              value={slug} 
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
            />
            <button 
              disabled={!token || !slug || loading} 
              onClick={saveSlug} 
              className="btn btn-accent" 
              style={{ width: '100%' }}
            >
              {loading ? <><span className="loading"></span> Saving...</> : '💾 Save Payment Link'}
            </button>
            {slug && slug !== 'your-slug' && (
              <div style={{ marginTop: '16px' }}>
                <p className="muted" style={{ marginBottom: '8px' }}>Your Payment URL</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" value={paymentLink} readOnly style={{ flex: 1, fontSize: '13px' }} />
                  <button onClick={() => copyToClipboard(paymentLink)} className="copy-btn">
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
                {qr && (
                  <div className="qr-container" style={{ marginTop: '16px' }}>
                    <img src={qr} width={180} alt="QR Code" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="title" style={{ fontSize: '24px', marginBottom: '16px' }}>📊 Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="stat-card">
              <div className="stat-value">{summary.totalCount}</div>
              <div className="stat-label">Total Payments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatAmount(summary.totalAmount.toString())}</div>
              <div className="stat-label">Total MATIC</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.last7d.count}</div>
              <div className="stat-label">Last 7 Days</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.last30d.count}</div>
              <div className="stat-label">Last 30 Days</div>
            </div>
          </div>
        </div>
      )}

      <div className="glass pad">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="title" style={{ fontSize: '24px', margin: 0 }}>💰 Recent Payments</h3>
          {payments.length > 0 && (
            <button 
              onClick={exportToPDF}
              className="btn btn-accent"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              📄 Export PDF Invoice
            </button>
          )}
        </div>
        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>📭</div>
            <p className="muted">No payments yet. Share your payment link to get started!</p>
          </div>
        ) : (
          <div>
            {payments.slice(0, 10).map((p, i) => (
              <div key={i} className="payment-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-success">✓ Paid</span>
                    <span className="muted" style={{ fontSize: '13px' }}>
                      {p.payer?.slice(0, 6)}...{p.payer?.slice(-4)}
                    </span>
                  </div>
                  {p.memo && <p className="muted" style={{ fontSize: '13px' }}>"{p.memo}"</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>
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
        )}
      </div>
    </div>
    </>
  )
}
