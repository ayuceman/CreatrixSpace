import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  User,
  Mail,
  Loader2,
  CheckCircle2,
  X,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isBefore,
  startOfDay,
  isToday,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { meetingService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'
import type { Database } from '@/lib/database.types'

type Meeting = Database['public']['Tables']['meetings']['Row']

function generate15MinSlots(fromHour: number, toHour: number): string[] {
  const slots: string[] = []
  for (let h = fromHour; h <= toHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === toHour && m > 0) break
      slots.push(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      )
    }
  }
  return slots
}

const START_SLOTS = generate15MinSlots(9, 16)

const DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hr', value: 60 },
  { label: '1.5 hr', value: 90 },
  { label: '2 hr', value: 120 },
  { label: '2.5 hr', value: 150 },
  { label: '3 hr', value: 180 },
]

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const nh = Math.floor(total / 60)
  const nm = total % 60
  return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}`
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && aEnd > bStart
}

export function MeetingPage() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [monthMeetings, setMonthMeetings] = useState<Meeting[]>([])
  const [loadingMeetings, setLoadingMeetings] = useState(false)
  const [selectedStart, setSelectedStart] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [pendingEdit, setPendingEdit] = useState<Meeting | null>(null)
  const [pendingDelete, setPendingDelete] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState('')
  const [timeModalOpen, setTimeModalOpen] = useState(false)

  const today = startOfDay(new Date())
  const nowStr = format(new Date(), 'HH:mm')

  const calendarStart = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 0,
  })
  const calendarEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const loadMeetings = useCallback(async (date: string) => {
    setLoadingMeetings(true)
    try {
      const data = await meetingService.getByDate(date)
      setMeetings(data)
    } finally {
      setLoadingMeetings(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setLoadingMeetings(true) // eslint-disable-line react-hooks/set-state-in-effect
      meetingService
        .getByDate(selectedDate)
        .then(setMeetings)
        .finally(() => setLoadingMeetings(false))
    }
  }, [selectedDate])

  useEffect(() => {
    const start = format(calendarStart, 'yyyy-MM-dd')
    const end = format(calendarEnd, 'yyyy-MM-dd')
    meetingService.getByDateRange(start, end).then(setMonthMeetings)
  }, [currentMonth, calendarStart, calendarEnd])

  useEffect(() => {
    document.body.style.overflow = timeModalOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [timeModalOpen])

  const meetingsByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const m of monthMeetings) {
      map.set(m.date, (map.get(m.date) || 0) + 1)
    }
    return map
  }, [monthMeetings])

  const selectedEndTime = useMemo(() => {
    if (!selectedStart || !selectedDuration) return null
    return addMinutes(selectedStart, selectedDuration)
  }, [selectedStart, selectedDuration])

  const bookedRanges = useMemo(() => {
    const todayStr = format(today, 'yyyy-MM-dd')
    return meetings.filter((m) => {
      if (editingId && m.id === editingId) return false
      if (selectedDate !== todayStr) return true
      return m.end_time > nowStr
    })
  }, [meetings, selectedDate, today, nowStr, editingId])

  function isSlotBooked(time: string): boolean {
    const endTime = addMinutes(time, 15)
    return bookedRanges.some((m) =>
      rangesOverlap(time, endTime, m.start_time, m.end_time)
    )
  }

  function isSlotPast(time: string): boolean {
    if (selectedDate !== format(today, 'yyyy-MM-dd')) return false
    return time <= nowStr
  }

  function isStartSlotAvailable(time: string): boolean {
    if (isSlotPast(time)) return false
    return !isSlotBooked(time)
  }

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today) && !isToday(day)) return
    const formatted = format(day, 'yyyy-MM-dd')
    setSelectedDate(formatted)
    setSelectedStart(null)
    setSelectedDuration(null)
    setSuccess(false)
    setEditingId(null)
    setTimeModalOpen(true)
  }

  const handleStartClick = (time: string) => {
    if (!isStartSlotAvailable(time)) return
    setSelectedStart(time)
    setSelectedDuration(null)
  }

  const handleDurationClick = (value: number) => {
    setSelectedDuration(value)
    setTimeModalOpen(false)
  }

  const handleEdit = (m: Meeting) => {
    setPendingEdit(m)
    setVerifyEmail('')
    setSuccess(false)
  }

  const handleVerifyEmail = async () => {
    if (!pendingEdit) return
    if (verifyEmail.toLowerCase() !== pendingEdit.email.toLowerCase()) {
      showToast('Email does not match the booking record', 'error')
      return
    }

    if (pendingDelete) {
      try {
        await meetingService.delete(pendingEdit.id, verifyEmail)
        showToast('Meeting cancelled', 'success')
        loadMeetings(selectedDate!)
        const start = format(calendarStart, 'yyyy-MM-dd')
        const end = format(calendarEnd, 'yyyy-MM-dd')
        const data = await meetingService.getByDateRange(start, end)
        setMonthMeetings(data)
      } catch {
        showToast('Failed to cancel meeting', 'error')
      }
      setPendingEdit(null)
      setPendingDelete(false)
      setVerifyEmail('')
      return
    }

    setEditingId(pendingEdit.id)
    setVerifiedEmail(pendingEdit.email)
    setSelectedDate(pendingEdit.date)
    setSelectedStart(pendingEdit.start_time)
    const duration =
      Number(pendingEdit.end_time.split(':')[0]) * 60 +
      Number(pendingEdit.end_time.split(':')[1]) -
      (Number(pendingEdit.start_time.split(':')[0]) * 60 +
        Number(pendingEdit.start_time.split(':')[1]))
    setSelectedDuration(duration)
    setName(pendingEdit.name)
    setEmail(pendingEdit.email)
    setOrganization(pendingEdit.organization)
    setPendingEdit(null)
    setVerifyEmail('')
  }

  const handleDelete = (m: Meeting) => {
    setPendingEdit(m)
    setPendingDelete(true)
    setVerifyEmail('')
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !name ||
      !email ||
      !selectedDate ||
      !selectedStart ||
      !selectedDuration
    ) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    setBooking(true)
    try {
      const endTime = addMinutes(selectedStart, selectedDuration)

      if (editingId) {
        const available = await meetingService.checkAvailability(
          selectedDate,
          selectedStart,
          endTime
        )
        if (!available) {
          const selfBooked = meetings.some(
            (m) =>
              m.id === editingId &&
              m.start_time === selectedStart &&
              m.end_time === endTime
          )
          if (!selfBooked) {
            showToast('This time range is no longer available.', 'error')
            setBooking(false)
            return
          }
        }

        await meetingService.update(
          editingId,
          {
            date: selectedDate,
            start_time: selectedStart,
            end_time: endTime,
            name,
            email,
            organization,
          },
          verifiedEmail
        )
        showToast('Meeting updated!', 'success')
      } else {
        const available = await meetingService.checkAvailability(
          selectedDate,
          selectedStart,
          endTime
        )
        if (!available) {
          showToast(
            'This time range is no longer available. Please choose another.',
            'error'
          )
          setBooking(false)
          return
        }

        await meetingService.book({
          name,
          email,
          organization,
          date: selectedDate,
          start_time: selectedStart,
          end_time: endTime,
        })
        showToast('Meeting booked successfully!', 'success')
      }

      setSuccess(true)
      loadMeetings(selectedDate)
      const start = format(calendarStart, 'yyyy-MM-dd')
      const end = format(calendarEnd, 'yyyy-MM-dd')
      const data = await meetingService.getByDateRange(start, end)
      setMonthMeetings(data)
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to save meeting.',
        'error'
      )
    } finally {
      setBooking(false)
    }
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setOrganization('')
    setSelectedStart(null)
    setSelectedDuration(null)
    setSuccess(false)
    setEditingId(null)
    setPendingEdit(null)
    setVerifyEmail('')
    setTimeModalOpen(false)
  }

  const handleCancelEdit = () => {
    resetForm()
  }

  return (
    <section className="section-padding bg-bg-band/30">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-clay/20 bg-bg shadow-lg overflow-hidden"
            >
              <div className="bg-clay p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="text-fg-on-ink-1 hover:text-fg-on-ink-1/70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-display text-fg-on-ink-1">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="text-fg-on-ink-1 hover:text-fg-on-ink-1/70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs text-fg-3 font-medium py-1"
                      >
                        {d}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day) => {
                    const formatted = format(day, 'yyyy-MM-dd')
                    const isPast = isBefore(day, today) && !isToday(day)
                    const isSelected = selectedDate === formatted
                    const sameMonth = isSameMonth(day, currentMonth)
                    const count = meetingsByDate.get(formatted) || 0

                    return (
                      <button
                        key={formatted}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all
                          ${!sameMonth ? 'text-fg-3/30' : ''}
                          ${isPast ? 'text-fg-3/30 cursor-not-allowed' : isSelected ? 'cursor-default' : 'hover:bg-clay/10 cursor-pointer'}
                          ${isToday(day) && !isSelected ? 'border border-clay/40 text-clay font-semibold' : ''}
                          ${isSelected ? 'bg-clay text-fg-on-ink-1 font-semibold' : ''}
                        `}
                      >
                        <span>{format(day, 'd')}</span>
                        {count > 0 && (
                          <span
                            className={`absolute sm:static bottom-[5px] text-[8px] sm:text-[10px] sm:mt-0.5 leading-none ${isSelected ? 'text-fg-on-ink-1/80' : 'text-clay'}`}
                          >
                            {count} booked
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Time Picker Modal */}
          <AnimatePresence>
            {timeModalOpen && selectedDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                onClick={() => setTimeModalOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md rounded-2xl border border-clay/20 bg-bg shadow-xl overflow-hidden"
                >
                  <div className="bg-ink p-4 flex items-center justify-between">
                    <h3 className="text-lg font-display text-fg-on-ink-1 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setTimeModalOpen(false)}
                      className="text-fg-on-ink-1/70 hover:text-fg-on-ink-1 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {loadingMeetings ? (
                    <div className="p-8 text-center text-fg-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                      {/* Start Time */}
                      <div>
                        <p className="text-sm font-medium text-fg-2 mb-3">
                          Start time
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-60 overflow-y-auto">
                          {START_SLOTS.map((time) => {
                            const available = isStartSlotAvailable(time)
                            const isSelected = selectedStart === time
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={!available}
                                onClick={() => handleStartClick(time)}
                                className={`
                                  py-2 px-1.5 rounded-lg text-xs font-medium transition-all border
                                  ${
                                    !available
                                      ? 'bg-fg-3/10 text-fg-3/50 border-transparent cursor-not-allowed line-through'
                                      : isSelected
                                        ? 'bg-clay text-fg-on-ink-1 border-clay shadow-md'
                                        : 'bg-bg-raised text-fg-1 border-rule hover:border-clay/50 hover:bg-clay/5 cursor-pointer'
                                  }
                                `}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Duration */}
                      {selectedStart && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="text-sm font-medium text-fg-2 mb-3">
                            Duration
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {DURATIONS.map((d) => {
                              const end = addMinutes(selectedStart, d.value)
                              const fits = end <= '17:00'
                              const noOverlap = !bookedRanges.some((m) =>
                                rangesOverlap(
                                  selectedStart,
                                  end,
                                  m.start_time,
                                  m.end_time
                                )
                              )
                              const disabled = !fits || !noOverlap
                              const isSelected = selectedDuration === d.value
                              return (
                                <button
                                  key={d.value}
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => handleDurationClick(d.value)}
                                  className={`
                                    py-2 px-3 rounded-lg text-sm font-medium transition-all border
                                    ${
                                      disabled
                                        ? 'bg-fg-3/10 text-fg-3/50 border-transparent cursor-not-allowed line-through'
                                        : isSelected
                                          ? 'bg-clay text-fg-on-ink-1 border-clay shadow-md'
                                          : 'bg-bg-raised text-fg-1 border-rule hover:border-clay/50 hover:bg-clay/5 cursor-pointer'
                                    }
                                  `}
                                >
                                  {d.label}
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Booked Meetings */}
                      {meetings.length > 0 && (
                        <div className="border-t border-rule pt-5">
                          <p className="text-sm font-medium text-fg-2 mb-3">
                            Booked Meetings ({meetings.length})
                          </p>
                          <div className="space-y-2 pr-1">
                            {meetings.map((m) => {
                              const isEditing = editingId === m.id
                              return (
                                <div
                                  key={m.id}
                                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${isEditing ? 'bg-clay/15 ring-1 ring-clay' : 'bg-clay/5'}`}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                                  <span className="font-medium text-fg-1 min-w-18 shrink-0">
                                    {m.start_time}&ndash;{m.end_time}
                                  </span>
                                  <span className="text-fg-2 truncate min-w-0">
                                    {m.name}
                                  </span>
                                  {m.organization && (
                                    <span className="text-fg-3 truncate hidden sm:inline min-w-0">
                                      &middot; {m.organization}
                                    </span>
                                  )}
                                  <div className="flex items-center gap-1 ml-auto shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleEdit(m)}
                                      className="p-1 rounded text-fg-3 hover:text-clay hover:bg-clay/10 transition-colors"
                                      title="Edit"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(m)}
                                      className="p-1 rounded text-fg-3 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Cancel"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Form Sidebar */}
          <AnimatePresence mode="wait">
            {pendingEdit ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-2xl border border-clay/20 bg-bg shadow-lg overflow-hidden lg:sticky lg:top-28">
                  <div className="bg-clay p-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-display text-fg-on-ink-1">
                        Verify to Edit
                      </h3>
                      <p className="text-fg-on-ink-1/70 text-sm mt-0.5">
                        Enter the email used to book this meeting
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingEdit(null)}
                      className="text-fg-on-ink-1/70 hover:text-fg-on-ink-1 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="rounded-lg bg-clay/5 border border-clay/10 px-3 py-2.5 text-sm space-y-1">
                      <p className="text-fg-2">
                        <span className="font-medium text-fg-1">
                          {pendingEdit.name}
                        </span>{' '}
                        &middot; {pendingEdit.start_time}&ndash;
                        {pendingEdit.end_time}
                      </p>
                      {pendingEdit.organization && (
                        <p className="text-fg-3 text-xs">
                          {pendingEdit.organization}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="verify-email">
                        Booking Email <span className="text-clay">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-3" />
                        <Input
                          id="verify-email"
                          type="email"
                          placeholder="Enter the email used to book"
                          value={verifyEmail}
                          onChange={(e) => setVerifyEmail(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="dark"
                      text="Verify"
                      onClick={handleVerifyEmail}
                      className="w-full py-3"
                    />
                  </div>
                </div>
              </motion.div>
            ) : selectedDate &&
              selectedStart &&
              selectedDuration &&
              !success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-2xl border border-clay/20 bg-bg shadow-lg overflow-hidden lg:sticky lg:top-28">
                  <div className="bg-clay p-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-display text-fg-on-ink-1">
                        {editingId ? 'Edit Booking' : 'Complete Booking'}
                      </h3>
                      <p className="text-fg-on-ink-1/70 text-sm mt-0.5">
                        {selectedDate} &middot; {selectedStart} &ndash;{' '}
                        {selectedEndTime}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-fg-on-ink-1/70 hover:text-fg-on-ink-1 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleBook} className="p-5 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">
                        Full Name <span className="text-clay">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-3" />
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9"
                          disabled={booking}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">
                        Email <span className="text-clay">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-3" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          disabled={booking}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="organization">
                        Organization{' '}
                        <span className="text-fg-3 text-xs">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-3" />
                        <Input
                          id="organization"
                          placeholder="Company or organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="pl-9"
                          disabled={booking}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant="dark"
                      text={
                        booking
                          ? 'Saving...'
                          : editingId
                            ? 'Update Booking'
                            : 'Confirm Booking'
                      }
                      icon={booking ? Loader2 : Calendar}
                      iconSize={18}
                      className="w-full py-3 mt-1"
                      disabled={booking}
                    />
                  </form>
                </div>
              </motion.div>
            ) : selectedEndTime && success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="lg:sticky lg:top-28"
              >
                <div className="rounded-2xl border border-ok/20 bg-bg shadow-lg overflow-hidden text-center p-8">
                  <div className="w-14 h-14 bg-ok/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-ok" />
                  </div>
                  <h3 className="text-xl font-display text-fg-1 mb-2">
                    {editingId ? 'Meeting Updated!' : 'Meeting Booked!'}
                  </h3>
                  <p className="text-sm text-fg-2 mb-1">{selectedDate}</p>
                  <p className="text-sm text-fg-2 mb-4">
                    {selectedStart} &ndash; {selectedEndTime}
                  </p>
                  <p className="text-xs text-fg-3 mb-6">
                    {name} &middot; {organization}
                  </p>
                  <Button
                    variant="outline"
                    text="Book Another"
                    onClick={resetForm}
                    className="w-full"
                  />
                </div>
              </motion.div>
            ) : selectedDate ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="lg:sticky lg:top-28 rounded-2xl border border-rule bg-bg shadow-lg overflow-hidden p-8 text-center">
                  <Clock className="h-10 w-10 text-fg-3 mx-auto mb-3" />
                  <p className="text-fg-2 text-sm">
                    Select a start time and duration above.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="select-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:sticky lg:top-28"
              >
                <div className="rounded-2xl border border-rule bg-bg shadow-lg overflow-hidden p-8 text-center">
                  <Calendar className="h-10 w-10 text-fg-3 mx-auto mb-3" />
                  <p className="text-fg-2 text-sm">
                    Pick a date on the calendar to get started.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
