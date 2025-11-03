import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{
      background: 'rgba(10, 14, 39, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>💳</span>
              <span style={{
                fontSize: '24px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                PayLink
              </span>
              <span className="badge" style={{ fontSize: '10px' }}>
                Polygon
              </span>
            </div>
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }} className="desktop-menu">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/how-it-works" active={isActive('/how-it-works')}>How It Works</NavLink>
            <NavLink to="/about" active={isActive('/about')}>About</NavLink>
            <Link to="/dashboard" className="btn" style={{ padding: '10px 20px', fontSize: '14px' }}>
              Dashboard
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            display: 'none',
            flexDirection: 'column',
            gap: '16px',
            paddingBottom: '20px'
          }}>
            <NavLink to="/" active={isActive('/')} mobile>Home</NavLink>
            <NavLink to="/how-it-works" active={isActive('/how-it-works')} mobile>How It Works</NavLink>
            <NavLink to="/about" active={isActive('/about')} mobile>About</NavLink>
            <Link to="/dashboard" className="btn" style={{ padding: '12px 24px', width: '100%', textAlign: 'center' }}>
              Dashboard
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  )
}

function NavLink({ to, active, children, mobile }: { to: string, active: boolean, children: any, mobile?: boolean }) {
  return (
    <Link 
      to={to} 
      style={{
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        textDecoration: 'none',
        fontWeight: active ? '600' : '500',
        fontSize: mobile ? '16px' : '15px',
        transition: 'color 0.2s ease',
        display: mobile ? 'block' : 'inline'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
      onMouseLeave={(e) => e.currentTarget.style.color = active ? 'var(--accent)' : 'var(--text-secondary)'}
    >
      {children}
    </Link>
  )
}
