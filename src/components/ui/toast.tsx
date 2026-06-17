import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

interface ToastMessage {
  text: string
  type: 'success' | 'error'
}

let toastId = 0
const listeners = new Set<(msg: ToastMessage) => void>()

export function showToast(text: string, type: 'success' | 'error' = 'success') {
  listeners.forEach((fn) => fn({ text, type }))
}

export function ToastContainer() {
  const [msg, setMsg] = useState<ToastMessage | null>(null)

  useEffect(() => {
    const fn = (m: ToastMessage) => setMsg(m)
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])

  const dismiss = useCallback(() => setMsg(null), [])

  useEffect(() => {
    if (!msg) return
    const t = setTimeout(dismiss, 4000)
    return () => clearTimeout(t)
  }, [msg, dismiss])

  if (!msg) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderRadius: 4,
          border: '1px solid',
          padding: '12px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          fontSize: 14,
          backgroundColor: msg.type === 'error' ? '#fce8e6' : '#1a3a3a',
          borderColor: msg.type === 'error' ? '#c44' : '#1a3a3a',
          color: msg.type === 'error' ? '#8b1a1a' : '#fff',
        }}
      >
        <span>{msg.text}</span>
        <button
          type="button"
          onClick={dismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            color: 'inherit',
            padding: 0,
            lineHeight: 1,
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
