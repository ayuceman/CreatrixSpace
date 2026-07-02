import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string // 'YYYY-MM-DD'
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  min?: string // 'YYYY-MM-DD'
  id?: string
}

function toLocalDate(value: string): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  min,
  id,
}: DatePickerProps) {
  const minDate = toLocalDate(min || '')
  const [open, setOpen] = useState(false)
  const selected = toLocalDate(value)
  const [monthNav, setMonthNav] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const viewDate = useMemo(() => {
    const base = toLocalDate(value) || new Date()
    return new Date(base.getFullYear(), base.getMonth() + monthNav, 1)
  }, [value, monthNav])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const today = new Date()
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const displayLabel = selected
    ? selected.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : placeholder

  return (
    <div className={cn('relative', className)} ref={wrapperRef}>
      <button
        type="button"
        id={id}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-md border border-rule bg-bg px-3 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2',
          'hover:border-clay/50 transition-colors'
        )}
      >
        <Calendar className="w-4 h-4 text-fg-3 shrink-0" />
        <span className={cn('truncate', !selected && 'text-fg-3')}>
          {displayLabel}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-72 rounded-md border border-rule bg-bg shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setMonthNav((m) => m - 1)}
              className="p-1 rounded-sm hover:bg-bg-raised text-fg-2"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-fg-1">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setMonthNav((m) => m + 1)}
              className="p-1 rounded-sm hover:bg-bg-raised text-fg-2"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium text-fg-3 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />
              const cellDate = new Date(year, month, day)
              const isSelected = selected && isSameDay(cellDate, selected)
              const isToday = isSameDay(cellDate, today)
              const isDisabled = minDate
                ? cellDate <
                  new Date(
                    minDate.getFullYear(),
                    minDate.getMonth(),
                    minDate.getDate()
                  )
                : false
              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(toValue(cellDate))
                    setMonthNav(0)
                    setOpen(false)
                  }}
                  className={cn(
                    'h-8 w-8 rounded-sm text-sm flex items-center justify-center transition-colors',
                    isDisabled
                      ? 'text-fg-3/40 cursor-not-allowed'
                      : isSelected
                        ? 'bg-clay text-white font-semibold'
                        : isToday
                          ? 'bg-clay-soft text-clay-deep font-medium'
                          : 'text-fg-1 hover:bg-bg-raised'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {selected && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="mt-2 w-full text-center text-xs text-fg-3 hover:text-clay py-1.5 border-t border-rule"
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  )
}
