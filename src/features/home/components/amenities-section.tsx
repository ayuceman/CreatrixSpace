import { motion } from 'framer-motion'
import {
  Wifi,
  Wind,
  Coffee,
  Printer,
  Lock,
  SprayCan,
  Shield,
  Car,
  CookingPot,
} from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/section'

const amenities = [
  { icon: Wifi, label: 'Fast WiFi', description: '100+ Mbps fiber' },
  { icon: Wind, label: 'AC', description: 'Climate controlled' },
  { icon: Coffee, label: 'Coffee & Tea', description: 'Unlimited, all day' },
  { icon: Printer, label: 'Printing', description: 'B&W and color' },
  { icon: Lock, label: 'Lockers', description: 'Personal storage' },
  { icon: SprayCan, label: 'Cleaning', description: 'Daily housekeeping' },
  { icon: Shield, label: 'Security', description: 'CCTV + key access' },
  { icon: Car, label: 'Parking', description: 'Two-wheeler spots' },
  { icon: CookingPot, label: 'Kitchen', description: 'Fridge + microwave' },
]

export function AmenitiesSection() {
  return (
    <Section id="amenities" bg="bg-band">
      <SectionHeading>
        The things you'd <em className="text-clay not-italic italic">expect</em>
        , kept well.
      </SectionHeading>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {amenities.map((amenity, index) => {
          const Icon = amenity.icon
          return (
            <motion.div
              key={amenity.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              viewport={{ once: true }}
              className="p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 bg-bg-raised border border-rule/30"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-fg-1/5">
                <Icon className="h-5 w-5 text-fg-2" />
              </div>
              <h3 className="font-medium text-sm mb-1 text-fg-1">
                {amenity.label}
              </h3>
              <p className="text-xs text-fg-3">{amenity.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
