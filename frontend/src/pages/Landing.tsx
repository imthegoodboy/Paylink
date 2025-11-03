import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="container">
      <header>
        <h1 className="title" style={{ fontSize: '24px', margin: 0 }}>💳 PayLink</h1>
        <nav>
          <Link to="/dashboard" className="cta">Open Dashboard</Link>
        </nav>
      </header>
      
      <section style={{ textAlign: 'center', marginTop: '64px', marginBottom: '64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="title-large">Universal Web3 Payment Gateway</h1>
          <p className="muted" style={{ fontSize: '18px', marginBottom: '32px' }}>
            Accept MATIC, USDC, and crypto payments with a simple link. Built on Polygon for ultra-low fees and instant confirmations.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn" style={{ fontSize: '16px', padding: '16px 32px' }}>
              Get Started Free
            </Link>
            <Link to="/pay/demo" className="btn btn-accent" style={{ fontSize: '16px', padding: '16px 32px' }}>
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <Feature 
          icon="👨‍💼" 
          title="Freelancers" 
          desc="Share your payment link and get paid globally in crypto. No intermediaries, no high fees." 
        />
        <Feature 
          icon="🎨" 
          title="Creators" 
          desc="Collect tips, donations, and support from your community with instant on-chain verification." 
        />
        <Feature 
          icon="💖" 
          title="Organizations" 
          desc="Receive crypto donations easily with automatic receipts and transparent tracking." 
        />
      </section>

      <section style={{ marginTop: '80px' }}>
        <div className="glass pad" style={{ textAlign: 'center' }}>
          <h2 className="title" style={{ fontSize: '32px', marginBottom: '24px' }}>Why PayLink?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '40px' }}>
            <div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
              <h3 className="title" style={{ fontSize: '18px' }}>Instant Payments</h3>
              <p className="muted">Transactions confirmed in seconds on Polygon network</p>
            </div>
            <div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
              <h3 className="title" style={{ fontSize: '18px' }}>Secure & Transparent</h3>
              <p className="muted">All transactions recorded on-chain, verifiable forever</p>
            </div>
            <div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>💰</div>
              <h3 className="title" style={{ fontSize: '18px' }}>Ultra-Low Fees</h3>
              <p className="muted">Polygon's low gas fees mean more money in your pocket</p>
            </div>
            <div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📱</div>
              <h3 className="title" style={{ fontSize: '18px' }}>Simple QR Codes</h3>
              <p className="muted">Generate QR codes for offline and mobile payments</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '64px', marginBottom: '64px' }}>
        <div className="glass pad" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))' }}>
          <h2 className="title" style={{ fontSize: '28px', marginBottom: '16px' }}>Ready to accept crypto payments?</h2>
          <p className="muted" style={{ marginBottom: '24px', fontSize: '16px' }}>
            Join thousands of users already using PayLink for seamless Web3 payments
          </p>
          <Link to="/dashboard" className="btn btn-success" style={{ fontSize: '16px', padding: '16px 32px' }}>
            Create Your Payment Link
          </Link>
        </div>
      </section>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="glass pad" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 className="title" style={{ fontSize: '20px', marginBottom: '8px' }}>{title}</h3>
      <p className="muted">{desc}</p>
    </div>
  )
}
