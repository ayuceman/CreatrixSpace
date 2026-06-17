import { motion } from 'framer-motion'
import { Clock, Wifi, Users, CalendarDays, Sunrise, Coffee, Phone, Mail } from 'lucide-react'

const amenities = [
  {
    icon: Clock,
    title: '24/7 access',
    description:
      'Residents and private-office members get a key fob. Come in at six, leave at four — no one is keeping score.',
  },
  {
    icon: Wifi,
    title: '1G symmetric fibre',
    description:
      'Backed up by a second line and a UPS that has actually been tested. Latency posted to a public dashboard each month.',
  },
  {
    icon: Users,
    title: 'Meeting rooms',
    description:
      'Seven meeting rooms across the three buildings. Bookable by the hour. Projector, speakerphone, and coffee that work.',
  },
  {
    icon: CalendarDays,
    title: 'Event spaces',
    description:
      'Six to sixty seats. Setup, teardown, and a host on the floor — included in the weekend hire.',
  },
  {
    icon: Sunrise,
    title: 'Rooftop & terrace',
    description:
      'Two of the three buildings have one. Best around four in the afternoon.',
  },
  {
    icon: Coffee,
    title: 'Cafés on site',
    description:
      'A café below Dhobighat and another below Jhamsikhel. Members get the resident discount.',
  },
  {
    icon: Phone,
    title: 'Phone booths',
    description:
      'Quiet, well-lit, with a hook for your coat. No one will hear you breathe.',
  },
  {
    icon: Mail,
    title: 'Mail & registered address',
    description:
      'Use any of the three buildings as your business address. We sign for things and let you know.',
  },
]

export function AmenitiesSection() {
  return (
    <section id="amenities" className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-20 mb-14 items-start"
        >
          <div>
            <div className="eyebrow text-clay mb-4.5">
              What's in the room
            </div>
            <h2 className="font-display font-normal text-[clamp(36px,4.6vw,64px)] leading-[1.05] tracking-[-0.015em] m-0">
              The things you'd{' '}
              <em className="text-clay not-italic">expect</em>, kept well.
            </h2>
          </div>
          <p className="text-lg leading-[1.6] text-fg-2 max-w-135 pt-5.5 m-0">
            We don't have a foosball table. We do have a phone booth where you
            can hear the other person, a kettle that has been on every weekday
            since 2022, and an electrician on speed-dial. The list below is what
            every room shares — the locations page has the rest.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {amenities.map((amenity, i) => {
            const Icon = amenity.icon
            return (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.2, 0.7, 0.2, 1] }}
                className="group bg-bg-raised hover:bg-bg border border-rule hover:border-rule-strong rounded-sm p-[28px_24px_24px] flex flex-col gap-4.5 min-h-49 transition-[border-color,background] duration-base ease-out"
              >
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-fg-1 group-hover:text-clay"
                />
                <div className="font-display text-22 leading-[1.15] tracking-[-0.005em]">
                  {amenity.title}
                </div>
                <div className="text-[13px] leading-normal text-fg-2">
                  {amenity.description}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
