import { X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import {
  locationService,
  bookTourContentService,
  formSubmissionService,
} from '@/services/supabase-service'

interface BookTourSheetProps {
  open: boolean
  onClose: () => void
  seed?: { location?: string; plan?: string }
}

interface SheetLocation {
  id: string
  name: string
  address: string
}

const defaultSheetLocations: SheetLocation[] = [
  { id: 'dhobighat', name: 'Dhobighat', address: 'Kathmandu' },
  { id: 'kausimaa', name: 'Kausimaa', address: 'Kupondole' },
  { id: 'jhamsikhel', name: 'Jhamsikhel', address: 'Lalitpur' },
]

interface InterestOption {
  value: string
  label: string
}

function generateDates() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const result: { label: string; date: Date }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    if (d.getDay() === 0) continue
    result.push({
      label: `${days[d.getDay()].slice(0, 3)} ${d.getDate()}`,
      date: d,
    })
  }
  return result
}

function StepCircle({
  num,
  active,
  done,
}: {
  num: number
  active: boolean
  done: boolean
}) {
  if (done) {
    return (
      <span className="w-4.5 h-4.5 rounded-full bg-clay border border-clay text-bg inline-flex items-center justify-center text-[10px] font-medium">
        ✓
      </span>
    )
  }
  return (
    <span
      className="w-4.5 h-4.5 rounded-full inline-flex items-center justify-center text-[10px] font-medium"
      style={{
        background: active ? 'var(--color-clay)' : 'transparent',
        border: active
          ? '1px solid var(--color-clay)'
          : '1px solid var(--color-rule-strong)',
        color: active ? 'var(--color-bg)' : 'var(--color-fg-3)',
      }}
    >
      {num}
    </span>
  )
}

export function BookTourSheet({ open, onClose, seed }: BookTourSheetProps) {
  const [step, setStep] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('')
  const [notes, setNotes] = useState('')

  const [locations, setLocations] = useState<SheetLocation[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [interestOptions, setInterestOptions] = useState<InterestOption[]>([])
  const [step1Headline, setStep1Headline] = useState('')
  const [step1Description, setStep1Description] = useState('')
  const [step2Headline, setStep2Headline] = useState('')
  const [confirmationEyebrow, setConfirmationEyebrow] = useState('')
  const [confirmationTourDetails, setConfirmationTourDetails] = useState('')

  const dates = useMemo(() => generateDates(), [])

  useEffect(() => {
    if (!open) return
    Promise.all([
      locationService.getAllLocations(),
      bookTourContentService.get(),
    ]).then(([locData, content]) => {
      const mapped: SheetLocation[] = (locData || []).map((l: any) => ({
        id: l.slug || l.id,
        name: l.name,
        address: l.address || '',
      }))
      const loadedLocations = mapped.length > 0 ? mapped : defaultSheetLocations
      const loadedOptions =
        (content?.interest_options as InterestOption[]) ?? []
      const loadedTimeSlots = (content?.time_slots as string[]) ?? [
        '11:00',
        '12:00',
        '14:00',
        '15:00',
        '16:00',
      ]

      setLocations(loadedLocations)
      setTimeSlots(loadedTimeSlots)
      setInterestOptions(loadedOptions)
      setStep1Headline(
        content?.step1_headline ??
          'Come by, have a coffee, <em class="text-clay">look around</em>.'
      )
      setStep1Description(
        content?.step1_description ??
          "A tour takes about twenty minutes. You'll meet whoever's running the floor that day; the coffee is on us."
      )
      setStep2Headline(
        content?.step2_headline ??
          'A couple of <em class="text-clay">details</em>.'
      )
      setConfirmationEyebrow(content?.confirmation_eyebrow ?? 'Confirmed')
      setConfirmationTourDetails(
        content?.confirmation_tour_details ??
          "The full floor, the meeting rooms, the phone booths, the terrace. We'll show you the desk we'd put you at, what the wifi feels like, and where the coffee comes from."
      )
      const firstLoc = loadedLocations[0]?.id ?? null
      setSelectedLocation(seed?.location || firstLoc)
      setInterest(loadedOptions[0]?.value || '')
    })
  }, [open, seed?.location])

  const canContinueStep1 = selectedLocation && selectedDate && selectedTime
  const canConfirmStep2 = name && email

  const reset = () => {
    setStep(1)
    const current = locations.length > 0 ? locations : defaultSheetLocations
    const firstLoc = current[0]?.id ?? null
    setSelectedLocation(seed?.location || firstLoc)
    setSelectedDate(null)
    setSelectedTime(null)
    setName('')
    setEmail('')
    setPhone('')
    setInterest(interestOptions[0]?.value || '')
    setNotes('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleContinue = () => {
    if (step === 1 && canContinueStep1) setStep(2)
  }

  const handleConfirm = async () => {
    if (!canConfirmStep2) return
    try {
      await formSubmissionService.create({
        form_type: 'book_tour',
        name,
        email,
        phone: phone || null,
        room: selectedLocName,
        selected_date: selectedDate,
        time_slot: selectedTime,
        interest,
        notes: notes || null,
      })
    } catch {
      // silently fail — don't block the user
    }
    setStep(3)
  }

  const stepLabel = (s: number) => {
    switch (s) {
      case 1:
        return 'WHERE & WHEN'
      case 2:
        return 'WHO YOU ARE'
      case 3:
        return 'CONFIRM'
    }
  }

  const selectedLocName = locations.find((l) => l.id === selectedLocation)?.name

  const selectedInterestLabel = interestOptions.find(
    (o) => o.value === interest
  )?.label

  return (
    <AnimatePresence onExitComplete={reset}>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-100"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-140 bg-bg z-101 overflow-y-auto"
            style={{ boxShadow: 'rgba(26, 25, 22, 0.18) -20px 0px 60px' }}
          >
            <div className="p-9 md:p-[36px_40px_40px] flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="eyebrow text-clay">Book a tour</span>
                <button
                  onClick={handleClose}
                  className="bg-transparent border-0 text-fg-2 cursor-pointer p-1.5 inline-flex"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step indicator (hidden on step 3) */}
              {step < 3 && (
                <div className="flex items-center gap-2 text-xs font-mono text-fg-3">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      {s > 1 && <span className="flex-1 h-px bg-rule w-6" />}
                      <div
                        className="flex items-center gap-2"
                        style={{
                          color:
                            s === step
                              ? 'var(--color-clay)'
                              : s < step
                                ? 'var(--color-clay)'
                                : undefined,
                          fontWeight: s === step || s < step ? 500 : 400,
                        }}
                      >
                        <StepCircle
                          num={s}
                          active={s === step}
                          done={s < step}
                        />
                        <span className="text-[11px] tracking-wide">
                          {stepLabel(s)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Where & When */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-6"
                >
                  <h2
                    className="font-display text-[40px] leading-[1.05] tracking-[-0.015em] m-0"
                    dangerouslySetInnerHTML={{ __html: step1Headline }}
                  />
                  {step1Description && (
                    <p className="text-[15px] leading-[1.6] text-fg-2 m-0">
                      {step1Description}
                    </p>
                  )}

                  {/* Location picker */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Pick a room
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {locations.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => setSelectedLocation(loc.id)}
                          className="p-[14px_12px] text-left rounded-sm transition-all"
                          style={{
                            background:
                              selectedLocation === loc.id
                                ? 'var(--color-ink)'
                                : 'var(--color-bg-raised)',
                            color:
                              selectedLocation === loc.id
                                ? 'var(--color-bg)'
                                : 'var(--color-fg-1)',
                            border:
                              selectedLocation === loc.id
                                ? '1px solid transparent'
                                : '1px solid var(--color-rule)',
                          }}
                        >
                          <div className="text-sm font-medium">{loc.name}</div>
                          <div
                            className="font-mono text-[11px] mt-1"
                            style={{ opacity: 0.65 }}
                          >
                            {loc.address}
                          </div>
                        </button>
                      ))}
                    </div>
                  </label>

                  {/* Date picker */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Pick a day
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {dates.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => setSelectedDate(d.label)}
                          className="px-3.5 py-2.5 rounded-pill text-[13px] font-medium transition-all"
                          style={{
                            background:
                              selectedDate === d.label
                                ? 'var(--color-clay)'
                                : 'var(--color-bg-raised)',
                            color:
                              selectedDate === d.label
                                ? 'var(--color-bg)'
                                : 'var(--color-fg-1)',
                            border:
                              selectedDate === d.label
                                ? '1px solid transparent'
                                : '1px solid var(--color-rule)',
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </label>

                  {/* Time slot */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Time slot
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className="px-4 py-2.5 rounded-pill text-[13px] font-medium font-mono transition-all"
                          style={{
                            background:
                              selectedTime === t
                                ? 'var(--color-clay)'
                                : 'var(--color-bg-raised)',
                            color:
                              selectedTime === t
                                ? 'var(--color-bg)'
                                : 'var(--color-fg-1)',
                            border:
                              selectedTime === t
                                ? '1px solid transparent'
                                : '1px solid var(--color-rule)',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </label>

                  <button
                    disabled={!canContinueStep1}
                    onClick={handleContinue}
                    className="inline-flex items-center gap-2 self-start mt-3 px-6 py-3 rounded-pill text-sm font-medium transition-all"
                    style={{
                      background: canContinueStep1
                        ? 'var(--color-ink)'
                        : 'var(--color-fg-3)',
                      color: 'var(--color-bg)',
                      opacity: canContinueStep1 ? 1 : 0.6,
                      cursor: canContinueStep1 ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Who You Are */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-6"
                >
                  <h2
                    className="font-display text-[36px] leading-[1.08] tracking-[-0.015em] m-0"
                    dangerouslySetInnerHTML={{ __html: step2Headline }}
                  />

                  {/* Summary card */}
                  <div className="bg-bg-raised border border-rule rounded-sm p-[14px_18px] flex items-center gap-3.5 text-[13px] text-fg-2">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-clay"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M3 10h18" />
                      <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />
                    </svg>
                    <div>
                      <b className="text-fg-1 font-medium">{selectedLocName}</b>{' '}
                      · {selectedDate} at {selectedTime}
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="ml-auto bg-transparent border-0 text-clay cursor-pointer text-[13px] underline underline-offset-4 shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  {/* Name */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Your name
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sunaina Pradhan"
                      className="w-full px-3.5 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-[15px] placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-clay"
                    />
                  </label>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                        Email
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-[15px] placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-clay"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                        Phone (optional)
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+977 ..."
                        className="w-full px-3.5 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-[15px] placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-clay"
                      />
                    </label>
                  </div>

                  {/* What you're after */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      What you're after
                    </span>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-[15px] focus:outline-none focus:ring-2 focus:ring-clay appearance-none cursor-pointer"
                    >
                      {interestOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Notes */}
                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Anything else (optional)
                    </span>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bring a friend? Need parking? Quietest desk?"
                      className="w-full px-3.5 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-[15px] placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-clay resize-y"
                    />
                  </label>

                  {/* Back + Confirm */}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4.5 py-3 rounded-pill text-sm font-medium border border-rule text-fg-1 hover:bg-bg-raised transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      disabled={!canConfirmStep2}
                      onClick={handleConfirm}
                      className="inline-flex items-center gap-2 px-4.5 py-3 rounded-pill text-sm font-medium transition-all"
                      style={{
                        background: canConfirmStep2
                          ? 'var(--color-ink)'
                          : 'var(--color-fg-3)',
                        color: 'var(--color-bg)',
                        opacity: canConfirmStep2 ? 1 : 0.6,
                        cursor: canConfirmStep2 ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Confirm tour
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-5 pt-3"
                >
                  <div className="eyebrow text-moss">{confirmationEyebrow}</div>

                  <h2 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] m-0">
                    See you <em className="text-clay">{selectedDate}</em>,{' '}
                    {name}.
                  </h2>

                  <p className="text-base leading-[1.6] text-fg-2 m-0">
                    We've put you on the list at{' '}
                    <b className="text-fg-1">{selectedLocName}</b> for{' '}
                    <b className="text-fg-1">{selectedTime}</b>. Look for an
                    email shortly with directions and a contact for the host on
                    the floor. No need to RSVP — just show up.
                  </p>

                  <div className="mt-3 p-5.5 bg-bg-raised border border-rule rounded-sm flex flex-col gap-2.5">
                    <div className="eyebrow text-fg-2">What you'll see</div>
                    <div className="text-sm leading-[1.55] text-fg-2">
                      The full floor, the meeting rooms, the phone booths, the
                      terrace. We'll show you the desk we'd put you at, what the
                      wifi feels like, and where the coffee comes from.
                    </div>
                    <div className="text-[13px] text-fg-3 font-mono mt-1.5 pt-3 border-t border-rule">
                      {interest !== 'just-looking'
                        ? `HOLDING — ${selectedInterestLabel}`
                        : 'JUST LOOKING'}
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 self-start mt-3 px-6 py-3 rounded-pill text-sm font-medium bg-ink text-bg hover:bg-ink/90 transition-all cursor-pointer"
                  >
                    Back to the site
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
