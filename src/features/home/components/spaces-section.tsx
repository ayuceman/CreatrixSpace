import { motion } from 'framer-motion'
import {
  Users,
  Tv,
  Clock,
  GraduationCap,
  Table2,
  Building2,
} from 'lucide-react'
import { Section, SectionHeading, AnimateIn } from '@/components/ui/section'

const eventSpaceDetails = [
  { icon: Users, value: '4 → 18', label: 'people' },
  { icon: Tv, value: '4 TVs', label: 'screens' },
  { icon: Clock, value: '5 × 2 hrs', label: 'time blocks' },
]

const trainingDetails = [
  { icon: GraduationCap, value: '20 → 50', label: 'participants' },
  { icon: Table2, value: '2 × 1 table', label: 'setup' },
  { icon: Building2, value: 'Floor 4th', label: 'location' },
]

export function SpacesSection() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 md:mb-16">
        <SectionHeading className="mb-0">
          Rooms for <em className="text-clay not-italic italic">weekends</em>{' '}
          and <em className="text-clay not-italic italic">cohorts</em>.
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <p className="text-body leading-relaxed text-fg-2">
            Whether you're running a weekend workshop, hosting a small event, or
            teaching a class — we have spaces designed for groups. Projectors,
            whiteboards, and coffee included.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimateIn className="rounded-xl overflow-hidden bg-bg-raised border border-rule/50">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src="/images/hero-slider/creatrixspace-coworking-area-1.webp"
              alt="Event space"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="font-serif text-2xl font-bold mb-6 text-fg-1">
              Event space
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {eventSpaceDetails.map((detail) => {
                const Icon = detail.icon
                return (
                  <div key={detail.label}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-fg-3" />
                    </div>
                    <div className="font-serif text-lg font-bold text-fg-1">
                      {detail.value}
                    </div>
                    <div className="text-xs text-fg-3">{detail.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimateIn>

        <AnimateIn
          delay={0.1}
          className="rounded-xl overflow-hidden bg-bg-raised border border-rule/50"
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src="/images/hero-slider/creatrixspace-modern-workspace-1.webp"
              alt="Training room"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="font-serif text-2xl font-bold mb-6 text-fg-1">
              Training & classes
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {trainingDetails.map((detail) => {
                const Icon = detail.icon
                return (
                  <div key={detail.label}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-fg-3" />
                    </div>
                    <div className="font-serif text-lg font-bold text-fg-1">
                      {detail.value}
                    </div>
                    <div className="text-xs text-fg-3">{detail.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimateIn>
      </div>
    </Section>
  )
}
