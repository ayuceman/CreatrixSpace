import { useEffect, useCallback } from 'react'
import { Button } from './button'
import { X } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    },
    [onCancel]
  )

  useEffect(() => {
    if (open) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-rule bg-card p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h5 font-display text-fg-1">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-fg-3 hover:text-fg-1 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-body-sm text-fg-2 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            text={cancelText}
            onClick={onCancel}
          />
          <Button
            type="button"
            variant={variant === 'danger' ? 'dark' : 'default'}
            text={confirmText}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  )
}
