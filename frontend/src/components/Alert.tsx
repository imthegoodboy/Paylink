export function Alert({ kind = 'error', children }: { kind?: 'error' | 'success', children: any }) {
  const cls = kind === 'error' ? 'alert' : 'success'
  return <div className={cls}>{children}</div>
}


