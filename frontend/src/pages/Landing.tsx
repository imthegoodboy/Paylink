import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="title">💳 PayLink</h1>
        <nav>
          <Link to="/dashboard" className="cta">Open Dashboard</Link>
        </nav>
      </header>
      <section style={{ marginTop: 48 }}>
        <div className="glass pad">
          <h2 className="title">Universal Web3 Payment Gateway (Polygon)</h2>
          <p className="muted">Accept MATIC/USDC payments, subscriptions, or donations with a simple link.</p>
          <div style={{ marginTop: 16 }}>
            <Link to="/dashboard" className="btn">Get Started</Link>
          </div>
        </div>
      </section>
      <section style={{ marginTop: 32, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <Feature title="Freelancers" desc="Share your link, get paid globally." />
        <Feature title="Creators" desc="Collect tips and donations." />
        <Feature title="NGOs" desc="Receive crypto donations easily." />
      </section>
    </div>
  )
}

function Feature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="glass pad">
      <h3 className="title">{title}</h3>
      <p className="muted">{desc}</p>
    </div>
  )
}


