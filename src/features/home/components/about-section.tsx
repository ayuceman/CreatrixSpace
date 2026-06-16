import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Section, AnimateIn } from '@/components/ui/section'

function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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

function parseStat(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^([\d,]+)(.*)$/)
  if (!match) return { value: 0, suffix: raw }
  return { value: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] }
}

const stats = [
  {
    raw: '480+',
    label: 'Members who ve worked from our spaces since we opened',
  },
  { raw: '86', label: 'Desks across three locations in the valley' },
  { raw: '3', label: 'Locations — Dhobighat, Kausimaa, and Jhamsikhel' },
  { raw: '1,428', label: 'Cups of coffee served last month alone' },
]

export function AboutSection() {
  return (
    <Section bg="bg-band">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] tracking-tight">
            We build{' '}
            <em className="text-clay not-italic italic">
              rooms worth showing up to
            </em>{' '}
            — well-lit, well-kept, and full of people doing serious work,
            quietly.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-body leading-relaxed text-fg-2">
            Every detail — the lighting, the acoustics, the desk height, the
            chair — is there because someone thought about it. We don't do
            gimmicks. No beer fridges. No ping-pong tables. Just well-run rooms
            where you can do your best thinking.
          </p>
          <p className="text-body leading-relaxed text-fg-2">
            Our members include software engineers, writers, designers,
            consultants, and the occasional lawyer. They come because they like
            the quiet. And the coffee.
          </p>
        </motion.div>
      </div>

      <AnimateIn
        delay={0.3}
        className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-rule pt-8"
      >
        {stats.map((stat, index) => {
          const { value, suffix } = parseStat(stat.raw)
          return (
            <motion.div
              key={stat.raw}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="font-serif text-4xl md:text-5xl font-bold text-fg-1 counter-num">
                <AnimatedNumber value={value} suffix={suffix} />
              </div>
              <div className="text-sm mt-2 leading-snug text-fg-3">
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </AnimateIn>
    </Section>
  )
}
