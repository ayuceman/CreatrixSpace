import { useState, useRef, useEffect, useCallback } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value: string // 'HH:mm' (24h)
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
}

function parse24(value: string): { hour: number; minute: number } | null {
  if (!value) return null
  const [h, m] = value.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return null
  return { hour: h, minute: m }
}

function to24(hour12: number, minute: number, period: 'AM' | 'PM'): string {
  let h = hour12
  if (period === 'AM' && h === 12) h = 0
  if (period === 'PM' && h !== 12) h += 12
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function formatDisplay(value: string): string {
  const parsed = parse24(value)
  if (!parsed) return ''
  const { hour, minute } = parsed
  const period = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${String(minute).padStart(2, '0')} ${period}`
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5) // 0,5,10,...55

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  className,
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  const parsed = parse24(value)
  const currentPeriod: 'AM' | 'PM' = parsed
    ? parsed.hour >= 12
      ? 'PM'
      : 'AM'
    : 'AM'
  const currentHour12 = parsed ? parsed.hour % 12 || 12 : null
  const currentMinute = parsed ? parsed.minute : null

  // Snap to nearest 5-minute for highlighting
  const nearestMinute5 =
    currentMinute !== null ? Math.round(currentMinute / 5) * 5 : null
  const effectiveMinuteDisplay =
    nearestMinute5 !== null && nearestMinute5 <= 55
      ? nearestMinute5
      : currentMinute

  const [period, setPeriod] = useState<'AM' | 'PM'>(currentPeriod)

  // Sync period when value changes externally
  useEffect(() => {
    if (parsed) {
      setPeriod(parsed.hour >= 12 ? 'PM' : 'AM')
    }
  }, [value])

  // Close on outside click
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

  // Scroll selected hour/minute into view when opening
  const scrollToSelected = useCallback(() => {
    requestAnimationFrame(() => {
      if (hourRef.current) {
        const active = hourRef.current.querySelector('[data-active="true"]')
        if (active)
          active.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
      if (minuteRef.current) {
        const active = minuteRef.current.querySelector('[data-active="true"]')
        if (active)
          active.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    })
  }, [])

  useEffect(() => {
    if (open) scrollToSelected()
  }, [open, scrollToSelected])

  const handleSelect = (hour12: number, minute: number, p: 'AM' | 'PM') => {
    onChange(to24(hour12, minute, p))
  }

  const selectHour = (h: number) => {
    const min = currentMinute !== null ? currentMinute : 0
    handleSelect(h, min, period)
  }

  const selectMinute = (m: number) => {
    const hr = currentHour12 !== null ? currentHour12 : 12
    handleSelect(hr, m, period)
  }

  const togglePeriod = (p: 'AM' | 'PM') => {
    setPeriod(p)
    if (currentHour12 !== null && currentMinute !== null) {
      handleSelect(currentHour12, currentMinute, p)
    }
  }

  const displayLabel = value ? formatDisplay(value) : placeholder

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
        <Clock className="w-4 h-4 text-fg-3 shrink-0" />
        <span className={cn('truncate', !value && 'text-fg-3')}>
          {displayLabel}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-64 rounded-md border border-rule bg-bg shadow-lg p-3">
          {/* AM/PM Toggle */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePeriod(p)}
                className={cn(
                  'px-4 py-1.5 rounded-sm text-sm font-medium transition-colors',
                  period === p
                    ? 'bg-clay text-white'
                    : 'text-fg-2 hover:bg-bg-raised'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Hour & Minute Columns */}
          <div className="grid grid-cols-2 gap-2">
            {/* Hours */}
            <div>
              <div className="text-[11px] font-medium text-fg-3 text-center mb-1">
                Hour
              </div>
              <div
                ref={hourRef}
                className="max-h-44 overflow-y-auto scrollbar-thin"
              >
                <div className="grid grid-cols-3 gap-1">
                  {HOURS.map((h) => {
                    const isActive = currentHour12 === h
                    return (
                      <button
                        key={h}
                        type="button"
                        data-active={isActive}
                        onClick={() => selectHour(h)}
                        className={cn(
                          'h-8 rounded-sm text-sm flex items-center justify-center transition-colors',
                          isActive
                            ? 'bg-clay text-white font-semibold'
                            : 'text-fg-1 hover:bg-bg-raised'
                        )}
                      >
                        {h}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Minutes */}
            <div>
              <div className="text-[11px] font-medium text-fg-3 text-center mb-1">
                Minute
              </div>
              <div
                ref={minuteRef}
                className="max-h-44 overflow-y-auto scrollbar-thin"
              >
                <div className="grid grid-cols-3 gap-1">
                  {MINUTES.map((m) => {
                    const isActive = effectiveMinuteDisplay === m
                    return (
                      <button
                        key={m}
                        type="button"
                        data-active={isActive}
                        onClick={() => selectMinute(m)}
                        className={cn(
                          'h-8 rounded-sm text-sm flex items-center justify-center transition-colors',
                          isActive
                            ? 'bg-clay text-white font-semibold'
                            : 'text-fg-1 hover:bg-bg-raised'
                        )}
                      >
                        {String(m).padStart(2, '0')}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Clear */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="mt-2 w-full text-center text-xs text-fg-3 hover:text-clay py-1.5 border-t border-rule"
            >
              Clear time
            </button>
          )}
        </div>
      )}
    </div>
  )
}
