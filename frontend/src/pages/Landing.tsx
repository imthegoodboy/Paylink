import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function Landing() {
  return (
    <>
      <Navbar />
      <div className="container">
        <section style={{ textAlign: 'center', marginTop: '64px', marginBottom: '64px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge" style={{ fontSize: '14px', padding: '8px 16px' }}>
                ⛓️ Built on Polygon Network
              </span>
            </div>
            <h1 className="title-large">Universal Web3 Payment Gateway</h1>
            <p className="muted" style={{ fontSize: '18px', marginBottom: '32px' }}>
              Accept MATIC, USDC, and crypto payments with a simple link. Ultra-low fees and instant confirmations powered by Polygon blockchain.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link to="/dashboard" className="btn btn-success" style={{ fontSize: '16px', padding: '16px 32px' }}>
                Get Started Free 🚀
              </Link>
              <Link to="/how-it-works" className="btn btn-accent" style={{ fontSize: '16px', padding: '16px 32px' }}>
                How It Works
              </Link>
            </div>
            <p className="muted" style={{ fontSize: '14px' }}>
              🎁 First 5 payments free • No credit card required • Set up in 2 minutes
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <div className="glass pad" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))', textAlign: 'center' }}>
            <h2 className="title" style={{ fontSize: '24px', marginBottom: '24px' }}>Why Polygon?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>⚡</div>
                <h3 className="title" style={{ fontSize: '16px', marginBottom: '4px' }}>2s Confirmations</h3>
                <p className="muted" style={{ fontSize: '13px' }}>Lightning-fast transactions</p>
              </div>
              <div>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>💸</div>
                <h3 className="title" style={{ fontSize: '16px', marginBottom: '4px' }}>$0.001 Fees</h3>
                <p className="muted" style={{ fontSize: '13px' }}>Almost zero transaction costs</p>
              </div>
              <div>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🌱</div>
                <h3 className="title" style={{ fontSize: '16px', marginBottom: '4px' }}>Eco-Friendly</h3>
                <p className="muted" style={{ fontSize: '13px' }}>Carbon-neutral blockchain</p>
              </div>
              <div>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛡️</div>
                <h3 className="title" style={{ fontSize: '16px', marginBottom: '4px' }}>Battle-Tested</h3>
                <p className="muted" style={{ fontSize: '13px' }}>Billions in TVL secured</p>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-grid" style={{ marginBottom: '64px' }}>
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

        <section style={{ marginTop: '80px', marginBottom: '64px' }}>
          <div className="glass pad" style={{ textAlign: 'center' }}>
            <h2 className="title" style={{ fontSize: '32px', marginBottom: '24px' }}>Powerful Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '40px' }}>
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔗</div>
                <h3 className="title" style={{ fontSize: '18px' }}>Simple Payment Links</h3>
                <p className="muted">Get your unique link like paylink.app/pay/yourname</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📱</div>
                <h3 className="title" style={{ fontSize: '18px' }}>QR Code Generator</h3>
                <p className="muted">Perfect for offline and mobile payments</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📊</div>
                <h3 className="title" style={{ fontSize: '18px' }}>Analytics Dashboard</h3>
                <p className="muted">Track payments and see detailed statistics</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📄</div>
                <h3 className="title" style={{ fontSize: '18px' }}>PDF Invoices</h3>
                <p className="muted">Export professional invoices anytime</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎨</div>
                <h3 className="title" style={{ fontSize: '18px' }}>Custom Branding</h3>
                <p className="muted">Personalize your payment page (Premium)</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
                <h3 className="title" style={{ fontSize: '18px' }}>Non-Custodial</h3>
                <p className="muted">You always control your funds</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <div className="glass pad" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))' }}>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '16px' }}>Ready to accept crypto payments?</h2>
            <p className="muted" style={{ marginBottom: '24px', fontSize: '16px' }}>
              Join thousands of users already using PayLink for seamless Web3 payments on Polygon
            </p>
            <Link to="/dashboard" className="btn btn-success" style={{ fontSize: '16px', padding: '16px 32px' }}>
              Create Your Payment Link Free
            </Link>
            <p className="muted" style={{ marginTop: '16px', fontSize: '13px' }}>
              🎁 First 5 payments completely free • Upgrade anytime for premium features
            </p>
          </div>
        </section>
      </div>
    </>
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
