import { useState } from 'react'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ text: string, sender: 'user' | 'bot' }>>([
    { text: 'Hi! 👋 Welcome to PayLink. How can I help you today?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')

  const quickReplies = [
    'How do I create a payment link?',
    'What networks are supported?',
    'How much does it cost?',
    'Is my data secure?'
  ]

  const botResponses: Record<string, string> = {
    'create': '📝 To create a payment link:\n1. Go to Dashboard\n2. Connect your wallet\n3. Choose a unique slug\n4. Share your link!\n\nYou get 5 free payments to try it out.',
    'network': '⛓️ PayLink is built on Polygon (Amoy testnet). We chose Polygon for ultra-low fees and fast confirmations. Mainnet support coming soon!',
    'cost': '💰 Pricing:\n• First 5 payments: FREE\n• After trial: Small fee per payment\n• Custom branding: Premium feature\n• Invoice PDF export: Included',
    'secure': '🔒 Security:\n• All transactions on-chain\n• Non-custodial (you control your wallet)\n• Smart contract verified\n• No private keys stored\n• Open source code',
    'default': '🤔 I can help you with:\n• Creating payment links\n• Network information\n• Pricing details\n• Security questions\n\nTry asking about any of these topics!'
  }

  function handleSend() {
    if (!input.trim()) return

    const userMessage = { text: input, sender: 'user' as const }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const response = getResponse(input.toLowerCase())
      setMessages(prev => [...prev, { text: response, sender: 'bot' }])
    }, 500)

    setInput('')
  }

  function getResponse(query: string): string {
    for (const [key, response] of Object.entries(botResponses)) {
      if (query.includes(key)) return response
    }
    return botResponses.default
  }

  function handleQuickReply(reply: string) {
    const userMessage = { text: reply, sender: 'user' as const }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const response = getResponse(reply.toLowerCase())
      setMessages(prev => [...prev, { text: response, sender: 'bot' }])
    }, 500)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          border: 'none',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="glass" style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '350px',
          maxWidth: 'calc(100vw - 48px)',
          height: '500px',
          maxHeight: 'calc(100vh - 150px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            padding: '16px',
            borderRadius: '20px 20px 0 0'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'white' }}>💬 PayLink Support</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              Online now
            </p>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                  Quick questions:
                </p>
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      marginBottom: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'var(--primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              className="input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button 
              onClick={handleSend}
              className="btn"
              style={{ padding: '12px 16px' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
