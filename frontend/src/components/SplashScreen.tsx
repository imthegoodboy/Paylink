import { useEffect, useState } from 'react'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 20)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(ellipse 1400px 900px at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), #0a0e27',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: progress >= 100 ? 'fadeOut 0.5s ease-out' : 'none',
      opacity: progress >= 100 ? 0 : 1
    }}>
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5)); }
          50% { filter: drop-shadow(0 0 40px rgba(99, 102, 241, 0.8)); }
        }
      `}</style>
      
      <div style={{
        fontSize: '80px',
        marginBottom: '24px',
        animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite'
      }}>
        💳
      </div>
      
      <h1 style={{
        fontSize: '48px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #fff, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '16px'
      }}>
        PayLink
      </h1>
      
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '16px',
        marginBottom: '40px'
      }}>
        Web3 Payments Made Simple
      </p>
      
      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)'
        }} />
      </div>
      
      <div style={{
        marginTop: '16px',
        color: 'var(--muted)',
        fontSize: '14px'
      }}>
        {progress}%
      </div>
    </div>
  )
}
