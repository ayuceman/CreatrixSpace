import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Section, SectionHeading } from '@/components/ui/section'

const locations = [
  {
    id: 'dhobighat-hub',
    name: 'Dhobighat Hub',
    description:
      'Our original space in the heart of Kathmandu. Two floors, 30 desks, a meeting room, and a terrace for when you need air.',
    address: 'Dhobighat, Kathmandu',
    image: '/images/hero-slider/dhobighat-coworking-space.webp',
  },
  {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    description:
      'A quieter spot in Kupondole with outdoor seating, phone booths, and a café downstairs. Popular with freelancers and small teams.',
    address: 'Kupondole, Lalitpur',
    image: '/images/hero-slider/creatrixspace-coworking-area-1.webp',
  },
  {
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft',
    description:
      'The newest location. Open plan on the top floor, private offices below. Rooftop terrace with mountain views on clear days.',
    address: 'Jhamsikhel, Lalitpur',
    image: '/images/hero-slider/office-meeting-room.webp',
  },
]

interface LocationsSectionProps {
  onBookTour?: (location: string) => void
}

export function LocationsSection({
  onBookTour: _onBookTour,
}: LocationsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <Section>
      <SectionHeading>
        One in <em className="text-clay not-italic italic">Kathmandu</em>, two
        in <em className="text-clay not-italic italic">Lalitpur</em> — each a
        little different.
      </SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="cursor-pointer transition-all duration-300"
              style={{
                borderTop: index === 0 ? '1px solid var(--color-rule)' : 'none',
                borderBottom: '1px solid var(--color-rule)',
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        activeIndex === index
                          ? 'var(--color-clay)'
                          : 'transparent',
                      border:
                        activeIndex === index
                          ? 'none'
                          : '1px solid var(--color-fg-3)',
                    }}
                  />
                  <h3
                    className="font-serif text-xl font-semibold transition-colors duration-300"
                    style={{
                      color:
                        activeIndex === index
                          ? 'var(--color-fg-1)'
                          : 'var(--color-fg-3)',
                    }}
                  >
                    {location.name}
                  </h3>
                </div>
                <span className="text-sm text-fg-3">{location.address}</span>
              </div>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed max-w-md text-fg-2">
                      {location.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative aspect-[4/3] rounded-xl overflow-hidden"
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={activeIndex}
              src={locations[activeIndex].image}
              alt={locations[activeIndex].name}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  )
}
