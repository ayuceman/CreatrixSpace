import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { siteStatsService } from '@/services/supabase-service'

function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const node = ref.current
    if (!node) return

    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString() + suffix
      },
    })
    return () => controls.stop()
  }, [isInView, value, suffix])

  return <span ref={ref}>0</span>
}

interface Stat {
  raw: string
  label: string
  meta: string
}

const defaultStats: Stat[] = [
  {
    raw: '480+',
    label: 'Members across three rooms',
    meta: 'as of this morning',
  },
  {
    raw: '86',
    label: 'Companies, large and small',
    meta: 'from one-person studios to teams of twelve',
  },
  {
    raw: '3',
    label: 'Rooms in Kathmandu & Lalitpur',
    meta: 'opening a fourth in 2027',
  },
  {
    raw: '1,428',
    label: 'Cups of coffee a week',
    meta: 'roasted next door · we count them',
  },
]

function parseStat(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^([\d,]+)(.*)$/)
  if (!match) return { value: 0, suffix: raw }
  return { value: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] }
}

export function AboutSection() {
  const [stats, setStats] = useState<Stat[]>(defaultStats)

  useEffect(() => {
    siteStatsService.getAll().then((data) => {
      if (data && data.length > 0) {
        setStats(
          data.map((s: any) => ({
            raw: s.value + (s.suffix || ''),
            label: s.label,
            meta: s.meta || '',
          }))
        )
      }
    })
  }, [])

  return (
    <section
      id="about"
      className="bg-parchment py-16 md:py-24 lg:py-32 border-t border-rule border-b"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] lg:gap-20 gap-8 items-start"
        >
          <div>
            <div className="text-clay text-xs uppercase tracking-widest font-medium mb-5.5">
              What we make
            </div>
            <p className="font-mono text-[13px] text-fg-3 mb-2">
              EST. 2022 — KATHMANDU &amp; LALITPUR
            </p>
          </div>
          <div>
            <h2 className="font-display font-normal text-[clamp(36px,4.6vw,64px)] leading-[1.08] tracking-[-0.015em] m-0 max-w-read-width text-pretty">
              We build <em className="text-clay">rooms worth showing up to</em>{' '}
              — well-lit, well-kept, and full of people doing serious work,
              quietly.
            </h2>
            <p className="text-lg leading-[1.6] text-fg-2 max-w-180 mt-8">
              CreatrixSpace is a small, premium coworking outfit run out of the
              valley. We don't sell vibes or community manifestos. We rent good
              desks in beautiful rooms, by the day or by the month, and we keep
              the coffee strong.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="md:mt-24 mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-rule-strong"
        >
          {stats.map((stat) => {
            const { value, suffix } = parseStat(stat.raw)
            return (
              <div key={stat.raw} className="pt-2">
                <div className="font-display text-[clamp(56px,8vw,104px)] leading-[0.9] tracking-[-0.02em] tabular-nums text-fg-1">
                  <AnimatedNumber value={value} suffix={suffix} />
                </div>
                <div className="text-sm text-fg-1 mt-4.5 font-medium max-w-55">
                  {stat.label}
                </div>
                <div className="text-xs text-fg-3 font-mono mt-1.5">
                  {stat.meta}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
