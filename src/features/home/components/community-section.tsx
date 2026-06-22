import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from 'framer-motion'
import {
  testimonialsService,
  memberCompaniesService,
} from '@/services/supabase-service'

const avatarColors = ['bg-clay-deep', 'bg-fg-2', 'bg-clay'] as const

const defaultTestimonials = [
  {
    initials: 'SP',
    quote:
      'I came in for a week pass and never left. The light is wrong everywhere else now.',
    name: 'Sunaina Pradhan',
    role: 'Translator \u00B7 Jhamsikhel resident',
  },
  {
    initials: 'AK',
    quote:
      'We grew from two to nine without changing rooms. They just kept finding space.',
    name: 'Anjan Karki',
    role: 'Founder, Loomstack',
  },
  {
    initials: 'MJ',
    quote:
      'A floor full of people doing serious work, quietly. That is rarer than it sounds.',
    name: 'Mira Joshi',
    role: 'Visiting fellow \u00B7 Dhobighat',
  },
  {
    initials: 'AS',
    quote:
      'The terrace at four o\u2019clock is the only meeting room I trust for hard conversations.',
    name: 'Aakriti Sharma',
    role: 'Designer \u00B7 Kausimaa',
  },
  {
    initials: 'RM',
    quote:
      'I have a Kathmandu address now. Things arrive. People know where to find me.',
    name: 'Robin Maharjan',
    role: 'Virtual office \u00B7 2 yrs',
  },
  {
    initials: 'PT',
    quote:
      'I edit better here than at home. The chair is part of it. So is the silence.',
    name: 'Priya Tamang',
    role: 'Filmmaker \u00B7 Day pass regular',
  },
]

const defaultCompanies = [
  { name: 'Loomstack', italic: false },
  { name: 'Tuk\u012B Studio', italic: true },
  { name: 'Naya Press', italic: false },
  { name: 'Madal Labs', italic: false },
  { name: 'Annapurna Type', italic: true },
  { name: 'Bhote Books', italic: false },
  { name: 'Patan Records', italic: false },
  { name: 'Sherpa Software', italic: true },
  { name: 'Khukuri & Co.', italic: false },
  { name: 'Field/Note', italic: false },
  { name: 'Lipi Cartography', italic: true },
  { name: 'Kalimati Capital', italic: false },
  { name: 'Chautari Films', italic: false },
  { name: 'Tea & Wire', italic: true },
]

export function CommunitySection() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [companies, setCompanies] = useState(defaultCompanies)

  useEffect(() => {
    testimonialsService.getAll().then((data) => {
      if (data && data.length > 0) {
        setTestimonials(
          data.map((t: any) => ({
            initials: t.author_initials || '',
            quote: t.quote,
            name: t.author_name,
            role: t.author_role || '',
          }))
        )
      }
    })
    memberCompaniesService.getAll().then((data) => {
      if (data && data.length > 0) {
        setCompanies(
          data.map((c: any) => ({
            name: c.name,
            italic: c.italic || false,
          }))
        )
      }
    })
  }, [])

  const MIN_VISIBLE = 12

  const testItems = (() => {
    const copies = Math.ceil(MIN_VISIBLE / testimonials.length)
    const repeated: typeof testimonials = []
    for (let i = 0; i < copies; i++) repeated.push(...testimonials)
    return repeated
  })()

  const compItems = (() => {
    const copies = Math.ceil(MIN_VISIBLE / companies.length)
    const repeated: typeof companies = []
    for (let i = 0; i < copies; i++) repeated.push(...companies)
    return repeated
  })()

  const tx = useMotionValue(0)
  const testPaused = useRef(false)
  const testSpeed = 1 / 30000
  useAnimationFrame((_, delta) => {
    if (testPaused.current) return
    const cur = tx.get()
    const next = cur + testSpeed * delta
    tx.set(next >= 1 ? next - 1 : next)
  })
  const testX = useTransform(tx, (v) => `${-v * 50}%`)

  const cx = useMotionValue(0)
  const compPaused = useRef(false)
  const compSpeed = 1 / 25000
  useAnimationFrame((_, delta) => {
    if (compPaused.current) return
    const cur = cx.get()
    const next = cur + compSpeed * delta
    cx.set(next >= 1 ? next - 1 : next)
  })
  const compX = useTransform(cx, (v) => `${(v - 1) * 50}%`)

  return (
    <section id="community" className="py-16 md:py-24 lg:py-32 pb-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] lg:gap-16 gap-8 mb-16 items-end">
          <div>
            <div className="eyebrow text-clay mb-4.5">
              The people in the room
            </div>
            <h2 className="font-display font-normal text-[clamp(40px,5vw,72px)] leading-[1.02] tracking-[-0.015em] m-0">
              A floor full of people doing serious work &mdash;{' '}
              <em className="text-clay not-italic">quietly</em>.
            </h2>
          </div>
          <p className="text-base leading-[1.6] text-fg-2 max-w-[460px] mb-[6px] m-0">
            Translators, founders, filmmakers, engineers. Some of them are here
            every weekday at eight. Some come twice a year for a week.
          </p>
        </div>
      </div>

      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
        onMouseEnter={() => {
          testPaused.current = true
        }}
        onMouseLeave={() => {
          testPaused.current = false
        }}
      >
        <motion.div className="flex gap-6" style={{ x: testX }}>
          {testItems.map((t, i) => {
            const avatarColor =
              avatarColors[
                (t.initials.charCodeAt(0) + t.initials.charCodeAt(1)) %
                  avatarColors.length
              ]
            return (
              <article
                key={`${t.initials}-${i}`}
                className="shrink-0 w-[380px] bg-bg-raised border border-rule rounded-sm p-[28px] flex flex-col gap-4.5"
              >
                <div className="font-display text-[22px] leading-[1.3] tracking-[-0.005em] text-fg-1">
                  &ldquo;{t.quote}&rdquo;
                </div>
                <div className="flex gap-3.5 items-center mt-auto">
                  <div
                    className={`w-[42px] h-[42px] rounded-full ${avatarColor} text-bg flex items-center justify-center font-display text-base tracking-[-0.01em] shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-fg-1">
                      {t.name}
                    </div>
                    <div className="text-xs text-fg-2 mt-0.5">{t.role}</div>
                  </div>
                </div>
              </article>
            )
          })}
        </motion.div>
      </div>

      <div className="container mt-16">
        <div className="text-xs tracking-[0.12em] uppercase text-fg-3 font-medium mb-5.5 text-center">
          Companies &amp; studios in residence &mdash; fourteen of eighty-six
        </div>
      </div>

      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
        onMouseEnter={() => {
          compPaused.current = true
        }}
        onMouseLeave={() => {
          compPaused.current = false
        }}
      >
        <motion.div className="flex gap-12" style={{ x: compX }}>
          {compItems.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className={`shrink-0 font-display text-[clamp(28px,3.4vw,44px)] tracking-[-0.01em] text-fg-2 py-3 whitespace-nowrap ${
                c.italic ? 'italic' : 'not-italic'
              }`}
            >
              {c.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
