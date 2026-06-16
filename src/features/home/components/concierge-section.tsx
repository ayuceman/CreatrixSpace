import { motion } from 'framer-motion'
import { useState } from 'react'
import { Section, SectionHeading } from '@/components/ui/section'

const suggestions = [
  'How much is a day pass?',
  'Can I visit today?',
  'What locations do you have?',
  'Is there parking?',
]

const replies: Record<string, string> = {
  'How much is a day pass?':
    'A day pass is NPR 800. That gives you access to any open desk, unlimited WiFi, and coffee & tea from opening to closing.',
  'Can I visit today?':
    "Absolutely! We're open 8am–7pm. Walk into any of our three locations — no appointment needed.",
  'What locations do you have?':
    'We have three locations: Dhobighat Hub (Kathmandu), Kausimaa Co-working (Kupondole), and Jhamsikhel Loft (Lalitpur).',
  'Is there parking?':
    'Two-wheeler parking is free at all locations. Four-wheeler parking is available at Dhobighat and Jhamsikhel.',
}

export function ConciergeSection() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Section bg="bg-band">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <SectionHeading className="mb-0">
          Still deciding?{' '}
          <em className="text-clay not-italic italic">Ask away</em>.
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-bg-raised border border-rule rounded-sm overflow-hidden"
        >
          <div className="p-5 space-y-4 min-h-[200px]">
            {!selected ? (
              <div className="bg-ink text-fg-on-ink-1 p-3.5 rounded-sm text-sm leading-relaxed max-w-[80%] self-start">
                Hi! I'm the Creatrix concierge. Ask me anything — I'll give you
                a real answer in seconds.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-bg text-fg-1 border border-rule p-3.5 rounded-sm text-sm leading-relaxed max-w-[80%] self-end ml-auto">
                  {selected}
                </div>
                <div className="bg-ink text-fg-on-ink-1 p-3.5 rounded-sm text-sm leading-relaxed max-w-[80%] self-start">
                  {replies[selected] ||
                    "Great question! Send us a WhatsApp and we'll get back to you right away."}
                </div>
              </div>
            )}

            {!selected && (
              <div className="flex flex-wrap gap-2 pt-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelected(s)}
                    className="bg-transparent border border-rule text-fg-1 px-3.5 py-2 rounded-pill text-xs cursor-pointer transition-all hover:border-rule-strong hover:bg-bg"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-clay mt-4 inline-block cursor-pointer hover:underline"
              >
                Ask another question
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
