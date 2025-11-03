export function Alert({ kind = 'error', children }: { kind?: 'error' | 'success', children: any }) {
  const cls = kind === 'error' ? 'alert' : 'success'
  const icon = kind === 'error' ? '⚠️' : '✅'
  
  return (
    <div className={cls}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span>{children}</span>
    </div>
  )
}
