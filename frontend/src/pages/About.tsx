import { Navbar } from '../components/Navbar'

export function About() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <section style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
            <h1 className="title-large">About PayLink</h1>
            <p className="muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              We're building the future of Web3 payments on Polygon blockchain
            </p>
          </section>

          <div className="glass pad" style={{ marginBottom: '32px' }}>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '16px' }}>Our Mission</h2>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              PayLink is democratizing access to cryptocurrency payments. Just like PayPal revolutionized online payments, 
              we're making it incredibly simple for anyone to accept crypto payments without technical knowledge. 
              Whether you're a freelancer, creator, or business owner, you deserve access to the global crypto economy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="glass pad">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
              <h3 className="title" style={{ fontSize: '20px' }}>Fast</h3>
              <p className="muted">
                Built on Polygon for instant transactions and ultra-low fees. Say goodbye to slow payment processing.
              </p>
            </div>
            <div className="glass pad">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h3 className="title" style={{ fontSize: '20px' }}>Secure</h3>
              <p className="muted">
                Non-custodial design means you always control your funds. Smart contracts are audited and open-source.
              </p>
            </div>
            <div className="glass pad">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
              <h3 className="title" style={{ fontSize: '20px' }}>Global</h3>
              <p className="muted">
                Accept payments from anyone, anywhere in the world. No borders, no restrictions, no intermediaries.
              </p>
            </div>
          </div>

          <div className="glass pad" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))' }}>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '16px' }}>Why Polygon?</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <span style={{ fontSize: '24px' }}>💰</span>
                <div>
                  <h4 className="title" style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Ultra-Low Fees</h4>
                  <p className="muted" style={{ margin: 0 }}>
                    Transaction costs are just a fraction of a cent, making micro-payments viable
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <span style={{ fontSize: '24px' }}>⚡</span>
                <div>
                  <h4 className="title" style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Instant Confirmations</h4>
                  <p className="muted" style={{ margin: 0 }}>
                    Sub-2-second block times mean your payments are confirmed almost instantly
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <span style={{ fontSize: '24px' }}>🌱</span>
                <div>
                  <h4 className="title" style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Eco-Friendly</h4>
                  <p className="muted" style={{ margin: 0 }}>
                    Polygon's proof-of-stake consensus is energy-efficient and carbon-neutral
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <span style={{ fontSize: '24px' }}>🛡️</span>
                <div>
                  <h4 className="title" style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Battle-Tested</h4>
                  <p className="muted" style={{ margin: 0 }}>
                    Polygon secures billions in assets and processes millions of daily transactions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass pad" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '16px' }}>Open Source & Transparent</h2>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              PayLink is built in the open. Our smart contracts are verified on PolygonScan, and our code is available 
              for anyone to audit. We believe in radical transparency and community-driven development.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-accent"
                style={{ textDecoration: 'none' }}
              >
                View on GitHub
              </a>
              <a 
                href="https://polygonscan.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn"
                style={{ textDecoration: 'none' }}
              >
                View Contracts
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
