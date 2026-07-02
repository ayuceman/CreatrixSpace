import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateRange {
  from: string // 'YYYY-MM-DD'
  to: string // 'YYYY-MM-DD'
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
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

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

// Monday-start week helpers
function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun ... 6 = Sat
  const diff = day === 0 ? -6 : 1 - day
  return addDays(d, diff)
}

function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6)
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1)
}

function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31)
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatDisplay(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface Preset {
  label: string
  range: () => DateRange
}

function buildPresets(today: Date): Preset[] {
  const t = stripTime(today)
  const yesterday = addDays(t, -1)
  const lastWeekAnchor = addDays(t, -7)
  const lastMonthAnchor = new Date(t.getFullYear(), t.getMonth() - 1, 1)
  const lastYearAnchor = new Date(t.getFullYear() - 1, 0, 1)

  return [
    { label: 'Today', range: () => ({ from: toValue(t), to: toValue(t) }) },
    {
      label: 'Yesterday',
      range: () => ({ from: toValue(yesterday), to: toValue(yesterday) }),
    },
    {
      label: 'This week',
      range: () => ({
        from: toValue(startOfWeek(t)),
        to: toValue(endOfWeek(t)),
      }),
    },
    {
      label: 'Last week',
      range: () => ({
        from: toValue(startOfWeek(lastWeekAnchor)),
        to: toValue(endOfWeek(lastWeekAnchor)),
      }),
    },
    {
      label: 'Past two weeks',
      range: () => ({
        from: toValue(addDays(startOfWeek(t), -7)),
        to: toValue(endOfWeek(t)),
      }),
    },
    {
      label: 'This month',
      range: () => ({
        from: toValue(startOfMonth(t)),
        to: toValue(endOfMonth(t)),
      }),
    },
    {
      label: 'Last month',
      range: () => ({
        from: toValue(startOfMonth(lastMonthAnchor)),
        to: toValue(endOfMonth(lastMonthAnchor)),
      }),
    },
    {
      label: 'This year',
      range: () => ({
        from: toValue(startOfYear(t)),
        to: toValue(endOfYear(t)),
      }),
    },
    {
      label: 'Last year',
      range: () => ({
        from: toValue(startOfYear(lastYearAnchor)),
        to: toValue(endOfYear(lastYearAnchor)),
      }),
    },
  ]
}

function MonthGrid({
  viewDate,
  from,
  to,
  hoverDate,
  minDate,
  onSelect,
  onHover,
}: {
  viewDate: Date
  from: Date | null
  to: Date | null
  hoverDate: Date | null
  minDate: Date | null
  onSelect: (date: Date) => void
  onHover: (date: Date | null) => void
}) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  // Monday-start offset
  const rawOffset = firstDay.getDay()
  const startOffset = rawOffset === 0 ? 6 : rawOffset - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonthDays = new Date(year, month, 0).getDate()
  const cells: { date: Date; inMonth: boolean }[] = []

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      inMonth: false,
    })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    cells.push({ date: addDays(last, 1), inMonth: false })
  }

  const effectiveEnd = to ?? hoverDate

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex-1">
      <div className="text-center text-sm font-medium text-fg-1 mb-2">
        {monthLabel}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium text-fg-3 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, inMonth }, i) => {
          const isDisabled = minDate
            ? stripTime(date) < stripTime(minDate)
            : false
          const isToday = isSameDay(date, today)
          const isStart = isSameDay(date, from)
          const isEnd = isSameDay(date, to)
          const isBoundary = isStart || isEnd

          let inRange = false
          if (from && effectiveEnd) {
            const lo = from < effectiveEnd ? from : effectiveEnd
            const hi = from < effectiveEnd ? effectiveEnd : from
            inRange = date >= stripTime(lo) && date <= stripTime(hi)
          }

          return (
            <button
              key={i}
              type="button"
              disabled={isDisabled}
              onMouseEnter={() => onHover(date)}
              onClick={() => onSelect(date)}
              className={cn(
                'h-8 w-8 rounded-sm text-sm flex items-center justify-center transition-colors relative',
                !inMonth && 'text-fg-3/40',
                isDisabled && 'cursor-not-allowed text-fg-3/30',
                !isDisabled &&
                  inMonth &&
                  !isBoundary &&
                  (inRange
                    ? 'bg-clay-soft text-clay-deep'
                    : isToday
                      ? 'bg-clay-soft text-clay-deep font-medium'
                      : 'text-fg-1 hover:bg-bg-raised'),
                isBoundary &&
                  !isDisabled &&
                  'bg-clay text-white font-semibold hover:bg-clay'
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  className,
  min,
  id,
}: DateRangePickerProps) {
  const minDate = toLocalDate(min || '')
  const [open, setOpen] = useState(false)
  const [monthNav, setMonthNav] = useState(0)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [draft, setDraft] = useState<DateRange>(value)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const from = toLocalDate(draft.from)
  const to = toLocalDate(draft.to)
  const displayFrom = toLocalDate(value.from)
  const displayTo = toLocalDate(value.to)

  const leftView = useMemo(() => {
    const base = from || new Date()
    return addMonths(new Date(base.getFullYear(), base.getMonth(), 1), monthNav)
  }, [from, monthNav])

  const rightView = useMemo(() => addMonths(leftView, 1), [leftView])

  const presets = useMemo(() => buildPresets(new Date()), [])

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

  function handleSelect(date: Date) {
    if (!from || (from && to)) {
      // start a new selection
      setDraft({ from: toValue(date), to: '' })
      return
    }
    // completing the range
    let newFrom = from
    let newTo = date
    if (date < from) {
      newFrom = date
      newTo = from
    }
    const finalRange = { from: toValue(newFrom), to: toValue(newTo) }
    setDraft(finalRange)
    onChange(finalRange)
    setOpen(false)
  }

  function handlePreset(preset: Preset) {
    const range = preset.range()
    setDraft(range)
    onChange(range)
    setOpen(false)
  }

  const displayLabel =
    displayFrom && displayTo
      ? `${formatDisplay(displayFrom)} - ${formatDisplay(displayTo)}`
      : placeholder

  function shiftRange(days: number) {
    if (!displayFrom || !displayTo) return
    const range = {
      from: toValue(addDays(displayFrom, days)),
      to: toValue(addDays(displayTo, days)),
    }
    onChange(range)
  }

  return (
    <div
      className={cn('relative inline-flex items-center gap-2', className)}
      ref={wrapperRef}
    >
      <button
        type="button"
        id={id}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setMonthNav(0)
          setOpen((o) => !o)
        }}
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border border-rule bg-bg px-3 text-sm min-w-55',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2',
          'hover:border-clay/50 transition-colors'
        )}
      >
        <Calendar className="w-4 h-4 text-fg-3 shrink-0" />
        <span className={cn('truncate', !displayFrom && 'text-fg-3')}>
          {displayLabel}
        </span>
      </button>

      <button
        type="button"
        onClick={() => shiftRange(-1)}
        className="h-10 w-9 flex items-center justify-center rounded-md border border-rule bg-bg text-fg-2 hover:bg-bg-raised transition-colors"
        aria-label="Shift range back"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => shiftRange(1)}
        className="h-10 w-9 flex items-center justify-center rounded-md border border-rule bg-bg text-fg-2 hover:bg-bg-raised transition-colors"
        aria-label="Shift range forward"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 flex rounded-md border border-rule bg-bg shadow-lg overflow-hidden">
          <div className="w-40 border-r border-rule py-2 shrink-0">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p)}
                className="w-full text-left text-sm text-fg-1 px-4 py-1.5 hover:bg-bg-raised transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-3 w-140">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMonthNav((m) => m - 1)}
                className="p-1 rounded-sm hover:bg-bg-raised text-fg-2 shrink-0"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <MonthGrid
                viewDate={leftView}
                from={from}
                to={to}
                hoverDate={hoverDate}
                minDate={minDate}
                onSelect={handleSelect}
                onHover={setHoverDate}
              />
              <MonthGrid
                viewDate={rightView}
                from={from}
                to={to}
                hoverDate={hoverDate}
                minDate={minDate}
                onSelect={handleSelect}
                onHover={setHoverDate}
              />

              <button
                type="button"
                onClick={() => setMonthNav((m) => m + 1)}
                className="p-1 rounded-sm hover:bg-bg-raised text-fg-2 shrink-0"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {from && (
              <button
                type="button"
                onClick={() => {
                  onChange({ from: '', to: '' })
                  setDraft({ from: '', to: '' })
                  setOpen(false)
                }}
                className="mt-3 w-full text-center text-xs text-fg-3 hover:text-clay py-1.5 border-t border-rule"
              >
                Clear range
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
