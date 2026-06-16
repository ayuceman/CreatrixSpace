import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { Section, SectionHeading, AnimateIn } from '@/components/ui/section'

const tabs = [
  { id: 'day-pass', label: 'Day Pass' },
  { id: 'hot-desk', label: 'Hot Desk' },
  { id: 'dedicated', label: 'Dedicated Desk' },
]

const rooms = {
  'day-pass': [
    {
      name: 'Day Pass',
      price: '~800',
      period: '/day',
      description:
        'Drop in, sit down, start working. Access to any open desk, Wi-Fi, coffee, and common areas.',
      image: '/images/hero-slider/dhobighat-coworking-space.webp',
    },
    {
      name: 'Day Pass +',
      price: '~1,200',
      period: '/day',
      description:
        'Everything in Day Pass plus access to phone booths, printing, and an afternoon snack.',
      image: '/images/hero-slider/professional-workspace-desk.webp',
    },
  ],
  'hot-desk': [
    {
      name: 'Hot Desk',
      price: '~3,000',
      period: '/week',
      description:
        'A different desk each day. Includes locker storage, 24/7 access, and printing credits.',
      image: '/images/hero-slider/modern-workspace-desk.webp',
    },
    {
      name: 'Pick Five',
      price: '~5,000',
      period: '/mo',
      description:
        'Choose any five days a month. Same perks as the hot desk, more flexibility.',
      image: '/images/hero-slider/creatrixspace-workspace-interior-1.webp',
    },
  ],
  dedicated: [
    {
      name: 'Dedicated Desk',
      price: '~8,000',
      period: '/mo',
      description:
        'Your own desk, your own chair, your own monitor. Leave your things overnight. 24/7 key access.',
      image: '/images/hero-slider/creatrixspace-office-space-1.webp',
      featured: true,
    },
    {
      name: 'Dedicated +',
      price: '~10,000',
      period: '/mo',
      description:
        'All dedicated desk perks plus unlimited meeting room hours, guest passes, and a mail address.',
      image: '/images/hero-slider/creatrixspace-modern-workspace-1.webp',
    },
  ],
}

interface MembershipSectionProps {
  onBookTour?: (plan: string) => void
}

export function MembershipSection({
  onBookTour: _onBookTour,
}: MembershipSectionProps) {
  const [activeTab, setActiveTab] = useState('day-pass')

  const activeRooms = rooms[activeTab as keyof typeof rooms]

  return (
    <Section bg="bg-band">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <SectionHeading className="mb-0">
          Pick a room.{' '}
          <em className="text-clay not-italic italic">Show up tomorrow.</em>
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <p className="text-body leading-relaxed text-fg-2">
            No commitment, no deposit, no awkward sales call. Pick what fits,
            pay online, and walk in tomorrow morning. Change plans anytime — we
            keep it simple.
          </p>
        </motion.div>
      </div>

      <AnimateIn delay={0.2} className="flex flex-wrap gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                activeTab === tab.id ? 'var(--color-ink)' : 'transparent',
              color:
                activeTab === tab.id ? 'var(--color-bg)' : 'var(--color-fg-2)',
              border:
                activeTab === tab.id ? 'none' : '1px solid var(--color-rule)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </AnimateIn>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activeRooms.map((room) => (
          <div
            key={room.name}
            className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--color-bg-raised)',
              border: room.featured
                ? '2px solid var(--color-clay)'
                : '1px solid var(--color-rule)',
            }}
          >
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-6">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-serif text-xl font-semibold text-fg-1">
                  {room.name}
                </h3>
                {room.featured && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-clay text-bg">
                    Popular
                  </span>
                )}
              </div>

              <p className="text-sm mb-4 leading-relaxed text-fg-2">
                {room.description}
              </p>

              <div className="flex items-baseline gap-1 pt-4 border-t border-rule/50">
                <span className="font-serif text-2xl font-bold text-fg-1">
                  {room.price}
                </span>
                <span className="text-sm text-fg-3">{room.period}</span>
              </div>
            </div>
          </div>
        ))}

        <div
          className="rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:-translate-y-1"
          style={{
            border: '1px dashed var(--color-rule)',
            backgroundColor: 'transparent',
            minHeight: '280px',
          }}
        >
          <p className="font-serif text-xl font-semibold mb-4 text-fg-1">
            Need something custom?
          </p>
          <p className="text-sm mb-6 text-fg-2">
            We also do private offices, team rooms, and enterprise plans.
          </p>
          <Link
            to={ROUTES.PRICING}
            className="inline-flex items-center gap-2 text-sm font-medium text-clay transition-all hover:gap-3"
          >
            View all plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </Section>
  )
}
