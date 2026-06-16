import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Section } from '@/components/ui/section'

const faqs = [
  {
    question: 'Can I visit to see a space before committing?',
    answer:
      "Absolutely. Walk in any weekday between 10am and 5pm, or book a tour through the website. No appointment needed for a quick look — just tell the front desk you're curious.",
  },
  {
    question: "What's the difference between a hot desk and a dedicated desk?",
    answer:
      'A hot desk means you sit at any available desk each day — first come, first served. A dedicated desk is yours: your things stay overnight, your monitor stays plugged in, your name goes on the spot.',
  },
  {
    question: 'Do you have hourly or half-day rates?',
    answer:
      'Our shortest option is the day pass. We\'ve found that people who come for "just an hour" usually stay for four, so we keep it simple. The day pass gives you access from opening to closing.',
  },
  {
    question: 'Can I book a room for a workshop or event?',
    answer:
      'Yes — we have event spaces that seat 4 to 50 people depending on the setup. Projector, whiteboard, coffee and tea are included. Reach out on WhatsApp or email for weekend and evening bookings.',
  },
  {
    question: 'Is there food nearby?',
    answer:
      'Each of our locations is within walking distance of multiple restaurants and cafés. Dhobighat has a food court next door, Kausimaa has a café downstairs, and Jhamsikhel is surrounded by restaurants.',
  },
  {
    question: 'Do you have parking?',
    answer:
      "Two-wheeler parking is available at all three locations. Four-wheeler parking is available at Dhobighat and Jhamsikhel. It's free for members — day pass visitors can park nearby.",
  },
  {
    question: 'Do you do invoicing or receipts?',
    answer:
      'Yes. Every booking comes with a digital receipt. For businesses that need monthly invoices with PAN details, we can set that up — just ask at the front desk or send us a message.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section id="faq" bg="bg-band">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] tracking-tight">
            The things people{' '}
            <em className="text-clay not-italic italic">actually ask</em>.
          </h2>
          <p className="mt-4 text-body text-fg-2">
            If your question isn't here, message us on WhatsApp. We reply in
            minutes, not days.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="cursor-pointer border-b border-rule"
              onClick={() => toggle(index)}
            >
              <div className="py-5 flex items-start justify-between gap-4">
                <h3
                  className="text-sm font-medium leading-snug transition-colors duration-200"
                  style={{
                    color:
                      openIndex === index
                        ? 'var(--color-fg-1)'
                        : 'var(--color-fg-2)',
                  }}
                >
                  {faq.question}
                </h3>
                <span className="flex-shrink-0 mt-0.5">
                  {openIndex === index ? (
                    <Minus className="h-4 w-4 text-fg-3" />
                  ) : (
                    <Plus className="h-4 w-4 text-fg-3" />
                  )}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-fg-2">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
