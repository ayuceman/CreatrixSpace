import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, MessageCircle } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    question: 'Can I walk in tomorrow and start working?',
    answer:
      'Yes. Day passes don\u2019t need to be booked \u2014 show up between 8 and 8 at any of the three buildings and the host at the desk will get you set up in five minutes. NPR 800 for the day, coffee included.',
  },
  {
    question:
      'What\u2019s the difference between a hot desk and a dedicated desk?',
    answer:
      'A hot desk is any open seat in the room \u2014 first come, first served, leave nothing behind. A dedicated desk is reserved in your name in the open room of your choice; you can leave a monitor on it, get mail there, and come and go 24/7. The open space is only used for these two \u2014 private rooms are separate.',
  },
  {
    question: 'Are private offices really available?',
    answer:
      'Yes \u2014 five lockable rooms across the three buildings are open for move-in this month. Two at Dhobighat, two at Kausimaa, one at Jhamsikhel. Sizes range from two to eight desks. WhatsApp us and we\u2019ll send the floor plans.',
  },
  {
    question: 'What does the Virtual Office include?',
    answer:
      'A registered business address at Dhobighat Hub for NPR 6,000/month. We sign for and scan your mail, forward what you ask us to, and give you four hours of meeting-room time and two day-passes a month so you can come in for in-person meetings.',
  },
  {
    question: 'Can I hire a room for a weekend event?',
    answer:
      'Yes. The event room at Dhobighat holds 60, the Jhamsikhel rooftop 40, and the Kausimaa terrace 24. We do half-day and full-day hire on Saturdays and Sundays \u2014 message on WhatsApp with the date and headcount and we\u2019ll send pricing.',
  },
  {
    question: 'Do you host training cohorts \u2014 robotics, coding, language?',
    answer:
      'Yes. A dedicated training room runs after-school and evening cohorts for robotics, STEM, coding, design, and languages. We work with the trainer or institute on a 2/3/6-month block. Get in touch with cohort size and timing.',
  },
  {
    question: 'Do you take WhatsApp?',
    answer:
      'Yes \u2014 fastest way to reach us. Tap any WhatsApp button on the site, or write to +977 9851 000 000. Replies usually inside a minute, 8am\u20138pm.',
  },
  {
    question: 'How do I cancel a membership?',
    answer:
      'Email or WhatsApp before the next renewal. No notice period, no exit fee, no awkward call. Day passes don\u2019t renew automatically \u2014 only the monthly plans do.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section
      id="faq"
      className="py-32 bg-bg-band border-t border-rule border-b border-rule"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="eyebrow text-clay mb-4.5">Frequently asked</div>
            <h2 className="font-display font-normal text-[clamp(36px,4.6vw,64px)] leading-[1.05] tracking-[-0.015em] m-0 max-w-[440px]">
              The things people{' '}
              <em className="text-clay not-italic">actually ask</em>.
            </h2>
            <p className="text-[15px] leading-[1.6] text-fg-2 max-w-[380px] mt-[22px]">
              If your question isn't here, WhatsApp us &mdash; someone on the
              floor will reply inside a minute.
            </p>
            <Button
              variant="dark"
              className="px-7 py-3.5 leading-none mt-6"
              text="WhatsApp +977 9851 000 000"
              icon={MessageCircle}
              href={`https://wa.me/${WHATSAPP.NUMBER}?text=${encodeURIComponent('Hello CreatrixSpace \u2014 I have a question:')}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>

          <div className="border-t border-rule-strong">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={index} className="border-b border-rule">
                  <button
                    onClick={() => toggle(index)}
                    className="w-full bg-transparent border-0 py-[22px] flex items-center justify-between gap-6 cursor-pointer text-left text-fg-1"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-[clamp(20px,2.2vw,26px)] leading-[1.25] tracking-[-0.005em]">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full border border-rule-strong inline-flex items-center justify-center transition-[background,color] duration-200 ease-out ${
                        isOpen ? 'bg-ink text-bg' : 'bg-transparent text-fg-1'
                      }`}
                    >
                      {isOpen ? (
                        <Minus size={16} strokeWidth={1.5} />
                      ) : (
                        <Plus size={16} strokeWidth={1.5} />
                      )}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="m-0 pb-6 pr-[60px] text-base leading-[1.65] text-fg-2 max-w-[720px]">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
