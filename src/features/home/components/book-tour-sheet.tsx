import { X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { WHATSAPP } from '@/lib/constants'

interface BookTourSheetProps {
  open: boolean
  onClose: () => void
  seed?: { location?: string; plan?: string }
}

const locations = [
  { id: 'dhobighat', name: 'Dhobighat Hub', address: 'Kathmandu' },
  {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    address: 'Kupondole, Lalitpur',
  },
  { id: 'jhamsikhel', name: 'Jhamsikhel Loft', address: 'Lalitpur' },
]

const timeSlots = ['11:00', '12:00', '14:00', '15:00', '16:00']

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
      <span className="w-[18px] h-[18px] rounded-full bg-clay border border-clay text-bg inline-flex items-center justify-center text-[10px] font-medium">
        ✓
      </span>
    )
  }
  return (
    <span
      className="w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[10px] font-medium"
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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    seed?.location || 'dhobighat'
  )
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const dates = useMemo(() => generateDates(), [])

  const canContinueStep1 = selectedLocation && selectedDate && selectedTime

  const reset = () => {
    setStep(1)
    setSelectedLocation(seed?.location || 'dhobighat')
    setSelectedDate(null)
    setSelectedTime(null)
    setName('')
    setPhone('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleContinue = () => {
    if (step === 1 && canContinueStep1) setStep(2)
    else if (step === 2 && name && phone) setStep(3)
  }

  const handleSubmit = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to book a tour.\n\nLocation: ${locations.find((l) => l.id === selectedLocation)?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nName: ${name}\nPhone: ${phone}`
    )
    window.open(`https://wa.me/${WHATSAPP.NUMBER}?text=${message}`, '_blank')
    handleClose()
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

  return (
    <AnimatePresence onExitComplete={reset}>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[560px] bg-bg z-[101] overflow-y-auto"
            style={{ boxShadow: 'rgba(26, 25, 22, 0.18) -20px 0px 60px' }}
          >
            <div className="p-9 md:p-10 flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="eyebrow text-label uppercase tracking-widest font-medium text-clay">
                  Book a tour
                </span>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-sm hover:bg-bg-band transition-colors text-fg-2"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 text-[12px] font-mono text-fg-3">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    {s > 1 && <span className="flex-1 h-[1px] bg-rule w-6" />}
                    <div
                      className="flex items-center gap-2"
                      style={{
                        color: s === step ? 'var(--color-clay)' : undefined,
                        fontWeight: s === step ? 500 : 400,
                      }}
                    >
                      <StepCircle num={s} active={s === step} done={s < step} />
                      <span className="text-[11px] tracking-wide">
                        {stepLabel(s)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Where & When */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="font-display text-[40px] leading-[1.05] tracking-tight m-0">
                    Come by, have a coffee,{' '}
                    <em className="text-clay not-italic italic">look around</em>
                    .
                  </h2>
                  <p className="text-[15px] leading-relaxed text-fg-2 m-0">
                    A tour takes about twenty minutes. You'll meet whoever's
                    running the floor that day; the coffee is on us.
                  </p>

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
                          className="p-3.5 text-left rounded-sm transition-all"
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
                          <div className="text-[14px] font-medium">
                            {loc.name}
                          </div>
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
                                ? 'var(--color-ink)'
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
                                ? 'var(--color-ink)'
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
                    className="btn self-start mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-medium transition-all"
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
                  <h2 className="font-display text-[40px] leading-[1.05] tracking-tight m-0">
                    Just a name and a number —{' '}
                    <em className="text-clay not-italic italic">that's all</em>.
                  </h2>
                  <p className="text-[15px] leading-relaxed text-fg-2 m-0">
                    We'll send you a WhatsApp to confirm. No spam, no sales
                    pitch.
                  </p>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Your name
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anish"
                      className="w-full px-4 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-sm placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-clay"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                      Phone number
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98XXXXXXXX"
                      className="w-full px-4 py-3 rounded-sm border border-rule bg-bg-raised text-fg-1 text-sm placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-clay"
                    />
                  </label>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-pill text-sm font-medium border border-rule text-fg-1 hover:bg-bg-raised transition-all"
                    >
                      Back
                    </button>
                    <button
                      disabled={!name || !phone}
                      onClick={handleContinue}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-medium transition-all"
                      style={{
                        background:
                          name && phone
                            ? 'var(--color-ink)'
                            : 'var(--color-fg-3)',
                        color: 'var(--color-bg)',
                        opacity: name && phone ? 1 : 0.6,
                        cursor: name && phone ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Continue
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
                  className="flex flex-col gap-6"
                >
                  <h2 className="font-display text-[40px] leading-[1.05] tracking-tight m-0">
                    Ready to go?{' '}
                    <em className="text-clay not-italic italic">
                      Confirm below
                    </em>
                    .
                  </h2>

                  <div className="bg-bg-raised border border-rule rounded-sm p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-fg-3">Location</span>
                      <span className="text-fg-1 font-medium">
                        {locations.find((l) => l.id === selectedLocation)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-fg-3">Date</span>
                      <span className="text-fg-1 font-medium">
                        {selectedDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-fg-3">Time</span>
                      <span className="text-fg-1 font-medium">
                        {selectedTime}
                      </span>
                    </div>
                    <div className="border-t border-rule pt-3 flex justify-between text-sm">
                      <span className="text-fg-3">Name</span>
                      <span className="text-fg-1 font-medium">{name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-fg-3">Phone</span>
                      <span className="text-fg-1 font-medium">{phone}</span>
                    </div>
                  </div>

                  <p className="text-xs text-fg-3 m-0">
                    We'll send you a WhatsApp to confirm your tour time.
                  </p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-pill text-sm font-medium border border-rule text-fg-1 hover:bg-bg-raised transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-medium bg-clay text-bg hover:bg-clay-deep transition-all"
                    >
                      Confirm via WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
