import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'

interface Message {
  text: string
  isUser: boolean
  id: number
}

const replies: Record<string, string> = {
  'How many hot desks are open today?':
    'Right now: 11 at Dhobighat, 6 at Kausimaa, 8 at Jhamsikhel. The terrace at Kausimaa fills up first \u2014 usually by ten. Want me to hold a south-facing desk at Dhobighat for the afternoon?',
  'Are private offices really available?':
    'Yes \u2014 five lockable rooms across the three buildings are open for move-in. Two at Dhobighat (a Studio for four and a Studio for six), two at Kausimaa (both Studios for two), one at Jhamsikhel (Studio for four). Sizes from two to eight desks. Want the floor plans?',
  'What does the Virtual Office include?':
    'NPR 6,000/month for a registered Kathmandu address at Dhobighat Hub. We sign for and scan your mail, forward what you ask us to, and give you four hours of meeting room and two day-passes a month so you can come in for in-person meetings. Most-requested setup for remote founders.',
  'Can I hire a room for a weekend event?':
    'Yes. The event room at Dhobighat holds 60, the Jhamsikhel rooftop 40, and the Kausimaa terrace 24. Half-day or full-day hire on Saturdays and Sundays, AV and host included. What date were you looking at?',
  'Can I tour a location this week?':
    'Yes \u2014 Tuesday through Saturday, between 11 and 4. Tours take twenty minutes and you meet whoever\u2019s running the floor that day. Coffee\u2019s on us. Which room would you like to see?',
}

const suggestions = Object.keys(replies)

let nextId = 1

export function ConciergeSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello \u2014 I\u2019m the concierge at CreatrixSpace. Ask me about availability, pricing, or a tour, and I\u2019ll do my best.',
      isUser: false,
      id: nextId++,
    },
  ])
  const [answering, setAnswering] = useState<string | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = chatRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  const ask = (question: string) => {
    if (answering) return

    const userId = nextId++
    setMessages((prev) => [
      ...prev,
      { text: question, isUser: true, id: userId },
    ])
    setAnswering(question)

    const delay = Math.max(600, question.length * 12)
    setTimeout(() => {
      const reply =
        replies[question] ||
        'Great question \u2014 send us a WhatsApp and we\u2019ll get back to you right away.'
      const replyId = nextId++
      setMessages((prev) => [
        ...prev,
        { text: reply, isUser: false, id: replyId },
      ])
      setAnswering(null)
    }, delay)
  }

  return (
    <section
      id="concierge"
      className="py-24 bg-bg-band border-t border-rule border-b border-rule"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
          <div>
            <div className="eyebrow text-clay mb-4.5">Ask CreatrixSpace</div>
            <h2 className="font-display font-normal text-[clamp(32px,4vw,56px)] leading-[1.05] tracking-[-0.015em] m-0">
              Faster than a form.{' '}
              <em className="text-clay not-italic">Real answers</em>, in plain
              English.
            </h2>
            <p className="text-base leading-[1.6] text-fg-2 max-w-[440px] mt-[22px]">
              The concierge knows what's open today, what each room sounds like
              in the afternoon, and how to get you on the floor by tomorrow. Try
              one of the questions &mdash; or write your own.
            </p>
            <div className="text-xs font-mono text-fg-3 mt-7 pt-4.5 border-t border-rule">
              REPLY TIME &mdash; UNDER A MINUTE, MON&ndash;SAT
            </div>
          </div>

          <div className="border border-rule rounded-sm overflow-hidden bg-bg">
            <div className="flex items-center gap-3 px-5.5 py-4 border-b border-rule bg-bg">
              <span className="relative inline-flex items-center justify-center w-3 h-3">
                <motion.span
                  className="absolute inset-0 rounded-full border border-moss opacity-60"
                  initial={{ scale: 0.6, opacity: 0.7 }}
                  animate={{ scale: [0.6, 1.8], opacity: [0.7, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
                <span className="inline-block w-2 h-2 rounded-full bg-moss shrink-0" />
              </span>
              <div>
                <div className="text-sm font-medium">Aakriti at Dhobighat</div>
                <div className="text-xs text-fg-2">
                  On the floor today &middot; replies in a minute
                </div>
              </div>
              <div className="ml-auto text-xs text-fg-3 font-mono">LIVE</div>
            </div>

            <div
              ref={chatRef}
              className="p-[24px_22px] flex flex-col gap-3 min-h-[260px] max-h-[380px] overflow-y-auto"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                    className={
                      msg.isUser
                        ? 'bg-bg-raised border border-rule text-fg-1 p-[14px_18px] rounded-sm text-sm leading-[1.55] max-w-[85%] self-end'
                        : 'bg-ink text-fg-on-ink-1 p-[14px_18px] rounded-sm text-sm leading-[1.55] max-w-[85%] self-start'
                    }
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {answering && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-ink/70 text-fg-on-ink-2 p-[14px_18px] rounded-sm text-sm leading-[1.55] max-w-[85%] self-start"
                >
                  <span className="inline-flex gap-[3px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-fg-on-ink-2 animate-bounce [animation-delay:0ms]" />
                    <span className="w-[5px] h-[5px] rounded-full bg-fg-on-ink-2 animate-bounce [animation-delay:150ms]" />
                    <span className="w-[5px] h-[5px] rounded-full bg-fg-on-ink-2 animate-bounce [animation-delay:300ms]" />
                  </span>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-[14px_18px_16px] border-t border-rule bg-bg flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    disabled={answering === s}
                    className="bg-transparent border border-rule text-fg-1 px-3.5 py-[7px] rounded-pill text-xs cursor-pointer transition-all hover:border-rule-strong hover:bg-bg-raised disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form className="flex gap-2 items-center border-t border-rule pt-3">
                <input
                  placeholder="Write to the concierge\u2026"
                  className="flex-1 px-1 py-2.5 bg-transparent border-0 outline-0 font-body text-sm text-fg-1 placeholder:text-fg-3"
                />
                <a
                  href={`https://wa.me/${WHATSAPP.NUMBER}?text=Hello%20CreatrixSpace%20%E2%80%94%20`}
                  target="_blank"
                  rel="noopener"
                  aria-label="Continue on WhatsApp"
                  title={`Or message us on WhatsApp at ${WHATSAPP.DISPLAY}`}
                  className="bg-[#25D366] text-white border-0 px-3 py-2 rounded-full cursor-pointer sm:inline-flex hidden items-center gap-1.5 text-xs no-underline font-medium"
                >
                  <MessageCircle size={14} />
                  On WhatsApp
                </a>
                <button
                  type="submit"
                  aria-label="Send"
                  className="bg-ink text-bg border-0 p-[9px_10px] rounded-full cursor-pointer inline-flex items-center"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
