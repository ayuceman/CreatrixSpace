import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  value: string
  onValueChange: (v: string) => void
  label: string
  setLabel: (v: string) => void
}

const SelectCtx = React.createContext<SelectContextValue | null>(null)

function useSelect() {
  const ctx = React.useContext(SelectCtx)
  if (!ctx)
    throw new Error('Select compound components must be used within <Select>')
  return ctx
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

function Select({ value, onValueChange, children, className }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [label, setLabel] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <SelectCtx.Provider
      value={{ open, setOpen, value, onValueChange, label, setLabel }}
    >
      <div ref={ref} className={cn('relative', className)}>
        {children}
      </div>
    </SelectCtx.Provider>
  )
}

interface SelectTriggerProps {
  className?: string
  children?: React.ReactNode
}

function SelectTrigger({ className, children }: SelectTriggerProps) {
  const { open, setOpen } = useSelect()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center gap-2 rounded-md border border-rule bg-bg px-3 text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2',
        'hover:border-clay/50 transition-colors text-left',
        className
      )}
    >
      {children}
      <ChevronDown className="w-4 h-4 ml-auto shrink-0 text-fg-3" />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
  className?: string
}

function SelectValue({ placeholder, className }: SelectValueProps) {
  const { value, label } = useSelect()

  if (value && label) {
    return <span className={cn('truncate', className)}>{label}</span>
  }

  return (
    <span className={cn('truncate text-fg-3', className)}>
      {placeholder || 'Select...'}
    </span>
  )
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

function SelectContent({ className, children }: SelectContentProps) {
  const { open } = useSelect()
  if (!open) return null

  return (
    <div
      className={cn(
        'absolute z-50 mt-1.5 w-full rounded-md border border-rule bg-bg shadow-lg py-1 max-h-60 overflow-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

function SelectItem({ value, children, className }: SelectItemProps) {
  const { onValueChange, setOpen, setLabel, value: currentValue } = useSelect()
  const isSelected = currentValue === value
  const itemRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={itemRef}
      role="option"
      aria-selected={isSelected}
      onClick={() => {
        setLabel(itemRef.current?.textContent || '')
        onValueChange(value)
        setOpen(false)
      }}
      className={cn(
        'px-3 py-2 text-sm cursor-pointer transition-colors',
        isSelected
          ? 'bg-clay-soft text-clay-deep font-medium'
          : 'text-fg-1 hover:bg-bg-raised',
        className
      )}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
