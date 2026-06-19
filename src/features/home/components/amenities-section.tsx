import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Clock,
  Wifi,
  Users,
  CalendarDays,
  Sunrise,
  Coffee,
  Phone,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { amenitiesService } from '@/services/supabase-service'

const iconMap: Record<string, LucideIcon> = {
  clock: Clock,
  wifi: Wifi,
  presentation: Users,
  calendar: CalendarDays,
  sun: Sunrise,
  coffee: Coffee,
  phone: Phone,
  mail: Mail,
}

const defaultEyebrow = "What's in the room"
const defaultHeadline1 = "The things you'd"
const defaultHeadlineEm = 'expect'
const defaultHeadline2 = ', kept well.'
const defaultDescription =
  "We don't have a foosball table. We do have a phone booth where you can hear the other person, a kettle that has been on every weekday since 2022, and an electrician on speed-dial. The list below is what every room shares — the locations page has the rest."

export function AmenitiesSection() {
  const [amenities, setAmenities] = useState<any[]>([])
  const [eyebrow, setEyebrow] = useState(defaultEyebrow)
  const [headline1, setHeadline1] = useState(defaultHeadline1)
  const [headlineEm, setHeadlineEm] = useState(defaultHeadlineEm)
  const [headline2, setHeadline2] = useState(defaultHeadline2)
  const [description, setDescription] = useState(defaultDescription)

  useEffect(() => {
    amenitiesService.getAll().then(setAmenities)
    amenitiesService
      .getContent()
      .then((data) => {
        if (data) {
          setEyebrow(data.eyebrow ?? defaultEyebrow)
          setHeadline1(data.headline_1 ?? defaultHeadline1)
          setHeadlineEm(data.headline_em ?? defaultHeadlineEm)
          setHeadline2(data.headline_2 ?? defaultHeadline2)
          setDescription(data.description ?? defaultDescription)
        }
      })
      .catch(() => {})
  }, [])

  if (amenities.length === 0) return null
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
            <div className="eyebrow text-clay mb-4.5">{eyebrow}</div>
            <h2 className="font-display font-normal text-[clamp(36px,4.6vw,64px)] leading-[1.05] tracking-[-0.015em] m-0">
              {headline1} <em className="text-clay">{headlineEm}</em>{' '}
              {headline2}
            </h2>
          </div>
          <p className="text-lg leading-[1.6] text-fg-2 max-w-135 pt-5.5 m-0">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {amenities.map((amenity, i) => {
            const Icon = iconMap[amenity.icon] || Clock
            return (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 * i,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
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
