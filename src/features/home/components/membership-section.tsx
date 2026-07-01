import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { plansContentService } from '@/services/supabase-service'

interface PlanCard {
  id: string
  eyebrow: string
  name: string
  price: string
  prefix?: string
  period: string
  description: string
  features: string[]
  highlight?: boolean
  badge?: string
  availability?: boolean
  cta: string
}

interface PlanTab {
  id: string
  label: string
  subtitle: string
  mode: 'grid' | 'single'
  cards?: PlanCard[]
  single?: {
    eyebrow: string
    name: string
    price: string
    period: string
    description: string
    badge: string
    subtitle: string
    features: string[]
  }
}

const defaultFooterTags = [
  'NO DEPOSIT',
  'CANCEL ANY TIME',
  'PRICES INCLUDE 13% VAT',
  'FIRST DAY ON US FOR DAY PASSES',
]

const defaultTabs: PlanTab[] = [
  {
    id: 'open-desks',
    label: 'Open desks',
    subtitle: 'DAY PASS · NPR 800 / DAY',
    mode: 'grid',
    cards: [
      {
        id: 'day-pass',
        eyebrow: 'Hot desk',
        name: 'Day Pass',
        price: '800',
        period: '/ day',
        description:
          'One open-room desk for the day. Show up between 8 and 8. Bring a friend the first time at no charge.',
        features: [
          'Any open desk · any room',
          'Coffee, tea, fast wifi',
          'No commitment, no deposit',
        ],
        cta: 'Start day pass',
      },
      {
        id: 'week-pass',
        eyebrow: 'Hot desk',
        name: 'Week Pass',
        price: '3,000',
        period: '/ week',
        description:
          'Seven consecutive days in the open room. Useful for visiting consultants and short residencies.',
        features: [
          'Any open desk · any room',
          'Two hours of meeting room',
          'Guest access × 1',
        ],
        cta: 'Start week pass',
      },
      {
        id: 'dedicated-desk',
        eyebrow: 'Reserved desk',
        name: 'Dedicated Desk',
        price: '8,000',
        period: '/ month',
        description:
          'Your own reserved desk in the open room of your choice. 24/7 access, mail handling, a key fob.',
        features: [
          'Reserved desk · 24/7 access',
          'Mail at your business address',
          'Eight hours of meeting room',
          'Two event passes per month',
        ],
        badge: 'Most picked',
        cta: 'Start dedicated desk',
      },
    ],
  },
  {
    id: 'private-offices',
    label: 'Private offices',
    subtitle: 'STUDIO FOR TWO · NPR 24,000 / MO',
    mode: 'grid',
    cards: [
      {
        id: 'studio-2',
        eyebrow: 'Lockable room',
        name: 'Studio for two',
        price: '24,000',
        period: '/ month',
        description:
          'A lockable room for a pair. A door that closes, a window that opens, two reserved desks.',
        features: [
          'Two desks · lockable door',
          '24/7 access · key card',
          '16 hrs meeting room / mo',
          'Mail at your address',
        ],
        availability: true,
        cta: 'Book a viewing',
      },
      {
        id: 'studio-4',
        eyebrow: 'Lockable room',
        name: 'Studio for four',
        price: '46,000',
        period: '/ month',
        description:
          'For a small team that has outgrown a corner. Four desks, a whiteboard, and the same coffee.',
        features: [
          'Four desks · lockable door',
          '24/7 access · key cards',
          '24 hrs meeting room / mo',
          'Phone-booth credits',
        ],
        badge: 'Most picked',
        availability: true,
        cta: 'Book a viewing',
      },
      {
        id: 'studio-68',
        eyebrow: 'Lockable room',
        name: 'Studio for six to eight',
        price: '78,000',
        prefix: 'From',
        period: '/ month',
        description:
          'A larger room with its own meeting corner. Suits a team of six to eight that needs door, branding, and privacy.',
        features: [
          'Six to eight desks',
          'In-room meeting corner',
          'Custom signage on the door',
          'Dedicated host on the floor',
        ],
        availability: true,
        cta: 'Book a viewing',
      },
    ],
  },
  {
    id: 'virtual-office',
    label: 'Virtual office',
    subtitle: 'ADDRESS & MAIL · NPR 6,000 / MO',
    mode: 'single',
    single: {
      eyebrow: 'Address & mail',
      name: 'Virtual Office',
      price: '6,000',
      period: '/ month',
      description:
        'A real Kathmandu business address at Dhobighat Hub. We sign for your mail, scan it, and forward what matters. Use it for company registration, banking, courier, and Google Business.',
      badge: 'MOST-REQUESTED SETUP FOR REMOTE FOUNDERS AND VISITING TEAMS.',
      subtitle: 'ADDRESS & MAIL · NPR 6,000 / MO',
      features: [
        'Registered business address',
        'Mail received, sorted, and scanned',
        'Forwarding on request',
        'Four hours of meeting room / month',
        'Two day-passes / month to visit',
      ],
    },
  },
]

function PlanCardComponent({ card }: { card: PlanCard }) {
  const waMsg = encodeURIComponent(
    `Hello CreatrixSpace — I'd like to enquire about the ${card.name} plan. `
  )

  return (
    <div
      className={`rounded-sm p-[28px_26px] flex flex-col gap-3.5 h-full transition-all ${
        card.highlight
          ? 'bg-ink border border-transparent text-fg-on-ink-1'
          : 'bg-bg-raised border border-rule text-fg-1'
      }`}
    >
      <div className="flex justify-between items-center gap-2">
        <span
          className={`eyebrow ${card.highlight ? 'text-fg-on-ink-2' : 'text-fg-2'}`}
        >
          {card.eyebrow}
        </span>
        {card.badge && <span className="eyebrow text-clay">{card.badge}</span>}
      </div>

      <div className="font-display text-28 leading-[1.05] tracking-[-0.01em] -mt-0.5">
        {card.name}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        {card.prefix === 'From' ? (
          <span
            className={`font-display text-[40px] leading-none tracking-[-0.015em] ${card.highlight ? 'text-fg-on-ink-1' : 'text-fg-1'}`}
          >
            From {card.price}
          </span>
        ) : (
          <>
            <span
              className={`font-mono text-[13px] ${card.highlight ? 'text-fg-on-ink-2' : 'text-fg-2'}`}
            >
              NPR
            </span>
            <span
              className={`font-display text-[60px] leading-none tracking-[-0.015em] ${card.highlight ? 'text-fg-on-ink-1' : 'text-fg-1'}`}
            >
              {card.price}
            </span>
            <span
              className={`text-[13px] ml-1 ${card.highlight ? 'text-fg-on-ink-2' : 'text-fg-2'}`}
            >
              {card.period}
            </span>
          </>
        )}
      </div>

      <p
        className={`text-sm leading-[1.55] m-0 mt-1 ${card.highlight ? 'text-fg-on-ink-2' : 'text-fg-2'}`}
      >
        {card.description}
      </p>

      <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-2.25">
        {card.features.map((f) => (
          <li
            key={f}
            className={`flex gap-3 items-start text-sm ${card.highlight ? 'text-fg-on-ink-1' : 'text-fg-1'}`}
          >
            <span className="shrink-0 mt-0.5 text-clay">—</span>
            {f}
          </li>
        ))}
      </ul>

      {card.availability && (
        <div className="mt-1 text-xs font-mono flex items-center gap-2 text-moss">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-moss" />
          Available
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <Button
          text={card.cta}
          icon={ArrowRight}
          iconPosition="right"
          iconSize={16}
          className={`w-full rounded-sm! px-5 py-3.25 text-sm font-medium border-0 justify-between ${
            card.highlight ? 'bg-bg text-ink' : 'bg-ink text-bg'
          }`}
        />
        <Link
          to={`https://wa.me/${WHATSAPP.NUMBER}?text=${waMsg}`}
          target="_blank"
          rel="noopener"
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm text-[13px] font-medium no-underline cursor-pointer text-center ${
            card.highlight
              ? 'text-white/80 border border-white/20'
              : 'text-fg-1 border border-rule-strong'
          }`}
        >
          <MessageCircle className="size-3.5" />
          WhatsApp us about this
        </Link>
      </div>
    </div>
  )
}

export function MembershipSection() {
  const [tabs, setTabs] = useState<PlanTab[]>(defaultTabs)
  const [activeId, setActiveId] = useState('open-desks')

  useEffect(() => {
    plansContentService
      .get()
      .then((data) => {
        if (data) {
          const loadedTabs =
            (data.tabs as PlanTab[])?.length > 0
              ? (data.tabs as PlanTab[])
              : defaultTabs
          setTabs(loadedTabs)
          if (loadedTabs.length > 0) setActiveId(loadedTabs[0].id)
        }
      })
      .catch(() => {})
  }, [])

  const activeTab = tabs.find((t) => t.id === activeId)!

  const waMsgVirtual = encodeURIComponent(
    `Hello CreatrixSpace — I'd like to set up a Virtual Office at Dhobighat Hub.`
  )

  return (
    <section
      id="membership"
      className="bg-bg-band py-16 md:py-24 lg:py-32 border-t border-rule border-b"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] lg:gap-20 sm:gap-8 mb-16 items-start"
        >
          <div>
            <div className="eyebrow text-clay mb-4.5">Pricing plans</div>
            <h2 className="font-display font-normal text-[clamp(36px,4.6vw,64px)] leading-[1.05] tracking-[-0.015em] m-0">
              Pick a room. <em className="text-clay">Show up tomorrow.</em>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-[1.6] text-fg-2 max-w-135 m-0">
              Four ways to work with us — day passes, dedicated desks, lockable
              private offices, and a virtual office for founders who want a
              Kathmandu address. No deposit, no joining fee, cancel any time.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex items-center gap-5 mb-12 flex-wrap"
        >
          <div className="inline-flex p-1 bg-bg-raised border border-rule rounded-pill overflow-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`px-5.5 py-2.5 rounded-pill font-body text-sm font-medium whitespace-nowrap cursor-pointer transition-all border-0 ${
                  activeId === tab.id
                    ? 'bg-ink text-bg'
                    : 'bg-transparent text-fg-2'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="text-[13px] text-fg-3 font-mono">
            {activeTab?.subtitle}
          </div>
        </motion.div>

        {activeTab?.mode === 'grid' && activeTab.cards ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {activeTab.cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 * i,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                <PlanCardComponent card={card} />
              </motion.div>
            ))}
          </div>
        ) : activeTab?.single ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="bg-bg-raised border border-rule rounded-sm lg:p-[40px_44px] p-7 flex flex-col lg:flex-row lg:gap-12 gap-8"
          >
            <div className="flex-1 flex flex-col gap-3.5">
              <span className="eyebrow text-fg-2">
                {activeTab.single.eyebrow}
              </span>
              <div className="font-display text-[40px] leading-[1.05] tracking-[-0.015em]">
                {activeTab.single.name}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-[13px] text-fg-2">NPR</span>
                <span className="font-display text-80 leading-none tracking-[-0.02em]">
                  {activeTab.single.price}
                </span>
                <span className="text-sm text-fg-2 ml-1.5">
                  {activeTab.single.period}
                </span>
              </div>
              <p className="text-[15px] leading-[1.6] text-fg-2 m-0 max-w-105">
                {activeTab.single.description}
              </p>
              <div className="text-xs font-mono text-clay pt-3.5 border-t border-rule">
                {activeTab.single.badge}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-5">
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {activeTab.single.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-fg-1">
                    <span className="shrink-0 mt-0.5 text-clay">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2.5 flex-wrap mt-auto">
                <Button
                  text="Set up virtual office"
                  icon={ArrowRight}
                  iconPosition="right"
                  variant="dark"
                  href={`https://wa.me/${WHATSAPP.NUMBER}?text=${waMsgVirtual}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.25 leading-none rounded-sm!"
                />
                <Button
                  text="Or send a request"
                  variant="outline"
                  href="#cta"
                  className="px-5.5 py-3.25 rounded-sm! leading-none"
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex items-center gap-4.5 flex-wrap mt-14"
        >
          {defaultFooterTags.map((tag, index) => (
            <React.Fragment key={tag}>
              <span className="text-xs font-mono text-fg-3 tracking-wide uppercase">
                {tag}
              </span>
              {index < defaultFooterTags.length - 1 && (
                <span className="text-fg-3 text-xs">·</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
