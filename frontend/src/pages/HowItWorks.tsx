import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom'

export function HowItWorks() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <section style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
            <h1 className="title-large">How PayLink Works</h1>
            <p className="muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Accept crypto payments in 3 simple steps. No coding required.
            </p>
          </section>

          <div style={{ marginBottom: '80px' }}>
            {[
              {
                step: '1',
                icon: '🦊',
                title: 'Connect Your Wallet',
                description: 'Link your MetaMask wallet to create your account. Your wallet address is your identity - no passwords to remember.',
                details: [
                  'Click "Connect Wallet" on the dashboard',
                  'Approve the connection in MetaMask',
                  'Enter your email and name to complete signup',
                  'Get 5 free payment trials to test it out'
                ]
              },
              {
                step: '2',
                icon: '🔗',
                title: 'Create Your Payment Link',
                description: 'Choose a unique username to create your personalized payment page. Share this link anywhere.',
                details: [
                  'Pick a memorable slug (e.g., "yourname")',
                  'Get your unique link: paylink.app/pay/yourname',
                  'Download QR code for easy sharing',
                  'Customize your page with premium features (optional)'
                ]
              },
              {
                step: '3',
                icon: '💰',
                title: 'Receive Payments',
                description: 'Share your link and start receiving payments instantly. All transactions are recorded on-chain.',
                details: [
                  'Payers enter amount and optional memo',
                  'Payment processed via smart contract',
                  'Funds arrive instantly in your wallet',
                  'View analytics and export invoices'
                ]
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                marginBottom: '48px',
                display: 'flex',
                gap: '32px',
                alignItems: 'start',
                flexDirection: index % 2 === 1 ? 'row-reverse' : 'row',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '0 0 80px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'
                  }}>
                    {item.step}
                  </div>
                  <div style={{ fontSize: '48px' }}>{item.icon}</div>
                </div>
                
                <div className="glass pad" style={{ flex: '1 1 400px' }}>
                  <h3 className="title" style={{ fontSize: '24px', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.8' }}>
                    {item.description}
                  </p>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    display: 'grid',
                    gap: '8px'
                  }}>
                    {item.details.map((detail, i) => (
                      <li key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'start', 
                        gap: '12px',
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="glass pad" style={{ marginBottom: '48px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))' }}>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '24px', textAlign: 'center' }}>
              Premium Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div>
                <h4 className="title" style={{ fontSize: '18px', marginBottom: '8px' }}>🎨 Custom Branding</h4>
                <p className="muted">
                  Personalize your payment page with custom colors, logo, and welcome message
                </p>
              </div>
              <div>
                <h4 className="title" style={{ fontSize: '18px', marginBottom: '8px' }}>📊 Advanced Analytics</h4>
                <p className="muted">
                  Detailed charts, payment trends, and customer insights
                </p>
              </div>
              <div>
                <h4 className="title" style={{ fontSize: '18px', marginBottom: '8px' }}>📄 PDF Invoices</h4>
                <p className="muted">
                  Export professional invoices for all your transactions
                </p>
              </div>
            </div>
          </div>

          <div className="glass pad" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="title" style={{ fontSize: '32px', marginBottom: '16px' }}>Ready to Get Started?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
              Create your payment link in under 2 minutes. First 5 payments are free!
            </p>
            <Link to="/dashboard" className="btn btn-success" style={{ fontSize: '16px', padding: '16px 32px', textDecoration: 'none' }}>
              Create Your Free Account
            </Link>
          </div>

          <div style={{ marginBottom: '64px' }}>
            <h2 className="title" style={{ fontSize: '28px', marginBottom: '24px', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                {
                  q: 'Do I need cryptocurrency to create an account?',
                  a: 'No! You only need a MetaMask wallet. You can create an account for free and start receiving payments immediately.'
                },
                {
                  q: 'What are the fees?',
                  a: 'First 5 payments are completely free. After that, we charge a small platform fee. Polygon network fees are just a fraction of a cent.'
                },
                {
                  q: 'Is my money safe?',
                  a: 'Yes! PayLink is non-custodial, meaning funds go directly to your wallet. We never hold your money or have access to your private keys.'
                },
                {
                  q: 'Can I accept payments in different cryptocurrencies?',
                  a: 'Currently we support MATIC (Polygon\'s native token). Support for USDC, USDT, and other tokens is coming soon!'
                }
              ].map((faq, i) => (
                <div key={i} className="glass pad" style={{ cursor: 'pointer' }}>
                  <h4 className="title" style={{ fontSize: '16px', marginBottom: '8px' }}>{faq.q}</h4>
                  <p className="muted" style={{ margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
