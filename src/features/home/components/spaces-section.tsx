import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { spacesService } from '@/services/supabase-service'

interface SpaceCard {
  id: string
  badge: string
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  stats: { value: string; label: string }[]
  tags: string[]
  waMsg: string
  cta: string
}

const badgeStyles = [
  { badgeColor: 'text-clay', badgeDotColor: 'bg-clay' },
  { badgeColor: 'text-moss', badgeDotColor: 'bg-moss' },
]

const defaultEyebrow = 'Also at CreatrixSpace'
const defaultHeadline1 = 'Rooms for '
const defaultHeadlineEm = 'weekends'
const defaultHeadline2 = ' and cohorts.'
const defaultDescription =
  'On Saturdays and Sundays the event rooms open up for launches, readings, and workshops. On weekday afternoons and evenings, a dedicated training room runs cohorts — robotics for kids, coding bootcamps, design schools.'
const defaultCards: SpaceCard[] = [
  {
    id: 'event-space',
    badge: 'Weekends',
    imageSrc: '/images/hero-slider/creatrixspace-coworking-area-1.webp',
    imageAlt: 'Event space at CreatrixSpace',
    title: 'Event space',
    description:
      'Sixty-seat event room at Dhobighat, a forty-seat rooftop at Jhamsikhel, and a twenty-four-seat terrace at Kausimaa. Hire by the half-day or full day on weekends — we handle setup, teardown, and AV.',
    stats: [
      { value: '6 → 60', label: 'Seats per room' },
      { value: '4 / 8 hr', label: 'Half or full day' },
      { value: 'Sat–Sun', label: 'Weekend hire' },
    ],
    tags: [
      'Product launches',
      'Photo shoots',
      'Book readings',
      'Workshops',
      'Investor demo days',
      'Member dinners',
    ],
    waMsg: `Hello CreatrixSpace — I'd like to enquire about hiring the event space for a weekend. Date: __ . Seats: __ .`,
    cta: 'Enquire for an event',
  },
  {
    id: 'training-classes',
    badge: 'Weekdays · evenings',
    imageSrc: '/images/hero-slider/creatrixspace-modern-workspace-1.webp',
    imageAlt: 'Training & classes at CreatrixSpace',
    title: 'Training & classes',
    description:
      'A dedicated room for cohort programmes — robotics for kids, STEM labs, design bootcamps, language schools. Whiteboards, projector, fast wifi, and a setup that can be reconfigured between sessions.',
    stats: [
      { value: '20 → 28', label: 'Learners per room' },
      { value: '2 / 3 / 6 mo', label: 'Programme blocks' },
      { value: 'Mon–Fri', label: 'After-school & evening' },
    ],
    tags: [
      'Robotics & STEM (kids)',
      'Coding bootcamps',
      'Design & UX classes',
      'Language schools',
      'Music & arts cohorts',
      'Corporate training',
    ],
    waMsg: `Hello CreatrixSpace — I'm interested in running a training programme. Type: __ . Cohort size: __ . Start date: __ .`,
    cta: 'Talk to us about a cohort',
  },
]
const defaultCtaEyebrow = 'For trainers, institutes, and event organisers'
const defaultCtaText =
  'We work on flexible blocks — single weekends, three-month robotics terms, six-month cohorts. Equipment, AV, and a host on the floor are included. Pricing depends on room and length.'
const defaultCtaWhatsapp = 'WhatsApp the spaces team'

export function SpacesSection() {
  const [eyebrow, setEyebrow] = useState(defaultEyebrow)
  const [headline1, setHeadline1] = useState(defaultHeadline1)
  const [headlineEm, setHeadlineEm] = useState(defaultHeadlineEm)
  const [headline2, setHeadline2] = useState(defaultHeadline2)
  const [description, setDescription] = useState(defaultDescription)
  const [cards, setCards] = useState<SpaceCard[]>(defaultCards)
  const [ctaEyebrow, setCtaEyebrow] = useState(defaultCtaEyebrow)
  const [ctaText, setCtaText] = useState(defaultCtaText)
  const [ctaWhatsapp, setCtaWhatsapp] = useState(defaultCtaWhatsapp)

  useEffect(() => {
    spacesService
      .get()
      .then((data) => {
        if (data) {
          setEyebrow(data.eyebrow ?? defaultEyebrow)
          setHeadline1(data.headline_1 ?? defaultHeadline1)
          setHeadlineEm(data.headline_em ?? defaultHeadlineEm)
          setHeadline2(data.headline_2 ?? defaultHeadline2)
          setDescription(data.description ?? defaultDescription)
          setCtaEyebrow(data.cta_bar_eyebrow ?? defaultCtaEyebrow)
          setCtaText(data.cta_bar_text ?? defaultCtaText)
          setCtaWhatsapp(data.cta_bar_whatsapp ?? defaultCtaWhatsapp)
          const loadedCards = (data.cards as SpaceCard[]) ?? []
          setCards(loadedCards.length > 0 ? loadedCards : defaultCards)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="spaces" className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-20 mb-16 items-start"
        >
          <div>
            <div className="eyebrow text-clay mb-4.5">{eyebrow}</div>
            <h2 className="font-display font-normal text-[clamp(36px,4.6vw,64px)] leading-[1.05] tracking-[-0.015em] m-0">
              {headline1}
              <em className="text-clay">{headlineEm}</em>
              {headline2}
            </h2>
          </div>
          <p className="text-lg leading-[1.6] text-fg-2 max-w-135 pt-[22px] m-0">
            {description}
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {cards.map((card, i) => {
            const bs = badgeStyles[i % badgeStyles.length]
            const gridCols =
              i % 2 === 0
                ? 'lg:grid-cols-[1fr_1.1fr]'
                : 'lg:grid-cols-[1.1fr_1fr]'
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * i,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
                className="bg-bg-raised border border-rule rounded-sm overflow-hidden"
              >
                <div className={`grid grid-cols-1 ${gridCols} min-h-[480px]`}>
                  <div
                    className={`relative min-h-[320px] bg-ink overflow-hidden ${
                      i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover [filter:saturate(0.92)_brightness(0.96)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-neutral-900/45" />
                    <div className="absolute left-6 top-6 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/92 backdrop-blur-md font-mono text-[11px] tracking-[0.12em] uppercase font-semibold">
                      <span
                        className={`inline-block w-[6px] h-[6px] rounded-full ${bs.badgeDotColor}`}
                      />
                      {card.badge}
                    </div>
                  </div>

                  <div
                    className={`p-[clamp(28px,4vw,56px)] flex flex-col gap-5.5 justify-center ${
                      i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <h3 className="font-display font-normal text-[clamp(32px,3.6vw,48px)] leading-[1.05] tracking-[-0.015em] m-0">
                      {card.title}
                    </h3>
                    <p className="text-base leading-[1.6] text-fg-2 m-0 max-w-130">
                      {card.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-4.5 border-t border-rule">
                      {card.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="font-display text-[clamp(20px,2.2vw,28px)] leading-[1.05] tracking-[-0.01em] text-fg-1">
                            {stat.value}
                          </div>
                          <div className="text-xs text-fg-3 mt-1.5 font-mono">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="text-[11px] tracking-[0.12em] uppercase text-fg-3 font-medium mb-3 font-mono">
                        What we've hosted
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[12.5px] px-3 py-[6px] bg-bg border border-rule rounded-full text-fg-2"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2.5 flex-wrap mt-1">
                      <Button
                        variant="dark"
                        className="px-7 py-3.5 leading-none"
                        text={card.cta}
                        icon={MessageCircle}
                        href={`https://wa.me/${WHATSAPP.NUMBER}?text=${encodeURIComponent(card.waMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                      <Button
                        text="Or send a request"
                        variant="outline"
                        href="#cta"
                        className="px-5.5 py-3.5 rounded-sm! leading-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-14 p-[28px_32px] bg-bg-raised border border-rule rounded-sm flex items-center justify-between gap-6 flex-wrap"
        >
          <div>
            <div className="eyebrow text-clay mb-2">{ctaEyebrow}</div>
            <div className="text-base leading-[1.55] text-fg-1 max-w-[640px]">
              {ctaText}
            </div>
          </div>
          <Button
            variant="dark"
            className="px-7 py-3.5 leading-none"
            text={ctaWhatsapp}
            icon={MessageCircle}
            href={`https://wa.me/${WHATSAPP.NUMBER}?text=${encodeURIComponent("Hello CreatrixSpace — I'd like to discuss a space hire (event or training).")}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        </motion.div>
      </div>
    </section>
  )
}
