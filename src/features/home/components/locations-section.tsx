import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { locationService } from '@/services/supabase-service'

interface LocationView {
  id: string
  name: string
  city: string
  status: string
  description: string
  address: string
  hours: string
  hotDesk: string
  privateOffice: string
  mapQuery: string
  mapEmbedUrl: string | null
  lat: number | null
  lng: number | null
  stats: {
    openDesks: number
    privateOffices: number
    meetingRooms: number
    eventSeats: number
  }
  images: string[]
}

const defaultLocations: LocationView[] = [
  {
    id: 'dhobighat',
    name: 'Dhobighat Hub',
    city: 'Kathmandu',
    status: 'Open today · 2 private offices left',
    description:
      'Our original space in the heart of Kathmandu. Two floors, 30 desks, a meeting room, and a terrace for when you need air.',
    address: 'Dhobighat — two floors, above the bakery',
    hours: '24/7 access · staffed 7am–9pm',
    hotDesk: 'Open · 12 spots today',
    privateOffice: '2 rooms — available',
    mapQuery: 'Dhobighat+Kathmandu+Nepal',
    mapEmbedUrl: null,
    lat: null,
    lng: null,
    stats: {
      openDesks: 30,
      privateOffices: 4,
      meetingRooms: 2,
      eventSeats: 40,
    },
    images: [
      '/images/hero-slider/dhobighat-coworking-space.webp',
      '/images/hero-slider/dhobighat-office-back.webp',
      '/images/hero-slider/dhobighat-workspace-view-1.webp',
    ],
  },
  {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    city: 'Lalitpur',
    status: 'Open today · full today',
    description:
      'A quieter spot in Kupondole with outdoor seating, phone booths, and a café downstairs. Popular with freelancers and small teams.',
    address: 'Kupondole — quiet street, café downstairs',
    hours: '24/7 access · staffed 8am–8pm',
    hotDesk: 'Full · waiting list open',
    privateOffice: '1 room — available',
    mapQuery: 'Kupondole+Lalitpur+Nepal',
    mapEmbedUrl: null,
    lat: null,
    lng: null,
    stats: {
      openDesks: 20,
      privateOffices: 3,
      meetingRooms: 1,
      eventSeats: 20,
    },
    images: [
      '/images/hero-slider/creatrixspace-coworking-area-1.webp',
      '/images/hero-slider/creatrixspace-workspace-interior-1.webp',
      '/images/hero-slider/creatrixspace-office-space-1.webp',
    ],
  },
  {
    id: 'jhamsikhel',
    name: 'Jhamsikhel Loft',
    city: 'Lalitpur',
    status: 'Open today · 1 private office left',
    description:
      'Brick walls and a rooftop with a view of Patan. The café downstairs opens at seven and shuts at eleven.',
    address: 'Jhamsikhel — top floor, brick building above Le Sherpa',
    hours: '24/7 access · staffed 8am–10pm',
    hotDesk: 'Open · 8 spots today',
    privateOffice: '1 room — available',
    mapQuery: 'Jhamsikhel+Lalitpur+Nepal',
    mapEmbedUrl: null,
    lat: null,
    lng: null,
    stats: {
      openDesks: 40,
      privateOffices: 6,
      meetingRooms: 3,
      eventSeats: 60,
    },
    images: [
      '/images/hero-slider/office-meeting-room.webp',
      '/images/hero-slider/modern-workspace-desk.webp',
      '/images/hero-slider/professional-workspace-desk.webp',
    ],
  },
]

function toLocationView(db: any): LocationView {
  const cap = db.capacity || {}
  const imgs = db.images || []
  const lat = db.latitude ? Number(db.latitude) : null
  const lng = db.longitude ? Number(db.longitude) : null
  const gmaps = db.google_maps_url || ''
  const mapEmbedUrl = gmaps.includes('/embed')
    ? gmaps
    : lat && lng
      ? `https://www.google.com/maps?q=${lat},${lng}&output=embed`
      : null
  return {
    id: db.slug || db.id,
    name: db.name,
    city: db.city || '',
    status: db.status || (db.available ? 'Open today' : 'Closed'),
    description: db.description || '',
    address: db.address || '',
    hours: db.opening_hours
      ? typeof db.opening_hours === 'string'
        ? db.opening_hours
        : '24/7 access'
      : '24/7 access',
    hotDesk: cap.hotDesks
      ? `Open · ${cap.hotDesks} spots today`
      : 'Available today',
    privateOffice: cap.privateOffices
      ? `${cap.privateOffices} rooms — available`
      : 'Available',
    mapQuery: db.full_address
      ? db.full_address.replace(/\s+/g, '+')
      : db.city
        ? `${db.name}+${db.city}+Nepal`.replace(/\s+/g, '+')
        : '',
    mapEmbedUrl,
    lat,
    lng,
    stats: {
      openDesks: cap.hotDesks || cap.openDesks || 0,
      privateOffices: cap.privateOffices || cap.dedicatedDesks || 0,
      meetingRooms: cap.meetingRooms || 0,
      eventSeats: cap.eventSeats || 0,
    },
    images: imgs.length > 0 ? imgs : db.image_url ? [db.image_url] : [],
  }
}

interface LocationsSectionProps {
  onBookTour?: (location: string) => void
}

export function LocationsSection({ onBookTour }: LocationsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [locations, setLocations] = useState<LocationView[]>(defaultLocations)

  useEffect(() => {
    locationService.getAllLocations().then((data) => {
      if (data && data.length > 0) {
        setLocations(data.map(toLocationView))
      }
    })
  }, [])

  const activeLocation = locations[activeIndex]

  useEffect(() => {
    setSlideIndex(0)
  }, [activeIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % activeLocation.images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeLocation.images.length])

  return (
    <section id="locations" className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-end mb-16">
          <div>
            <div className="text-clay text-xs uppercase tracking-widest font-medium mb-4.5">
              Three rooms
            </div>
            <h2 className="font-display font-normal text-[clamp(40px,5vw,80px)] leading-[1.02] tracking-[-0.015em] m-0 max-w-[880px] text-pretty">
              One in <em className="text-clay">Kathmandu</em>, two in{' '}
              <em className="text-clay">Lalitpur</em> — each a little different.
            </h2>
          </div>
          <Link
            to={ROUTES.LOCATIONS}
            className="text-clay text-[15px] font-medium no-underline border-b border-clay pb-1 whitespace-nowrap justify-self-start"
          >
            All addresses & hours →
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_1.1fr] gap-16 items-start">
          <div role="tablist" aria-label="Locations">
            {locations.map((location, index) => {
              const isActive = activeIndex === index
              const num = String(index + 1).padStart(2, '0')
              return (
                <div
                  key={location.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setActiveIndex(index)
                  }}
                  className={`loc-tab cursor-pointer flex items-start gap-4 border-t border-rule ${
                    isActive ? 'py-[28px]' : 'py-[22px]'
                  } ${
                    index === locations.length - 1 ? 'border-b border-rule' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-mono text-[11px] tracking-[0.12em] uppercase mb-2 ${
                        isActive ? 'text-clay' : 'text-fg-3'
                      }`}
                    >
                      {num} · {location.city}
                    </div>
                    <div
                      className={`font-display text-[clamp(28px,3.4vw,44px)] leading-[1.05] tracking-[-0.01em] transition-colors duration-300 ${
                        isActive ? 'text-fg-1' : 'text-fg-3'
                      }`}
                    >
                      {location.name}
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-[15px] leading-[1.55] text-fg-2 mt-[14px] max-w-[480px]">
                            {location.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0"
                    style={{
                      color: isActive
                        ? 'var(--color-clay)'
                        : 'var(--color-fg-3)',
                      transform: isActive ? 'translateX(2px)' : 'none',
                      transition:
                        'transform 300ms var(--ease-out), color 300ms var(--ease-out)',
                    }}
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </div>
              )
            })}
          </div>

          <div className="sticky top-24 space-y-6">
            <div className="relative aspect-4/3 overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={`${activeIndex}-${slideIndex}`}
                  src={activeLocation.images[slideIndex]}
                  alt={`${activeLocation.name} — photo ${slideIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-linear-to-t from-neutral-900/60 to-transparent"
              />

              <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
                {activeLocation.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`w-7 h-0.75 p-0 border-0 cursor-pointer transition-colors duration-300 ease-out ${
                      i === slideIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <article className="bg-bg-raised border border-rule rounded-sm p-[28px] flex flex-col gap-4.5">
              <div className="eyebrow text-clay">{activeLocation.status}</div>

              <dl className="grid grid-cols-4 gap-3.5">
                <div>
                  <dd className="font-display text-28 leading-none tracking-[-0.01em]">
                    {activeLocation.stats.openDesks}
                  </dd>
                  <dt className="text-[11px] text-fg-3 mt-1.5 font-mono tracking-[0.04em] uppercase">
                    Open desks
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-28 leading-none tracking-[-0.01em]">
                    {activeLocation.stats.privateOffices}
                  </dd>
                  <dt className="text-[11px] text-fg-3 mt-1.5 font-mono tracking-[0.04em] uppercase">
                    Private offices
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-28 leading-none tracking-[-0.01em]">
                    {activeLocation.stats.meetingRooms}
                  </dd>
                  <dt className="text-[11px] text-fg-3 mt-1.5 font-mono tracking-[0.04em] uppercase">
                    Meeting rooms
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-28 leading-none tracking-[-0.01em]">
                    {activeLocation.stats.eventSeats}
                  </dd>
                  <dt className="text-[11px] text-fg-3 mt-1.5 font-mono tracking-[0.04em] uppercase">
                    Event seats
                  </dt>
                </div>
              </dl>

              <dl className="pt-4.5 border-t border-rule flex flex-col gap-2.5">
                <div className="flex justify-between gap-4 items-baseline">
                  <dt className="text-xs text-fg-3 tracking-[0.08em] uppercase font-medium shrink-0">
                    Hot desk
                  </dt>
                  <dd className="text-sm font-body text-right text-moss">
                    {activeLocation.hotDesk}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 items-baseline">
                  <dt className="text-xs text-fg-3 tracking-[0.08em] uppercase font-medium shrink-0">
                    Private office
                  </dt>
                  <dd className="text-sm font-body text-right text-moss">
                    {activeLocation.privateOffice}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 items-baseline">
                  <dt className="text-xs text-fg-3 tracking-[0.08em] uppercase font-medium shrink-0">
                    Hours
                  </dt>
                  <dd className="text-sm font-body text-right text-fg-1">
                    {activeLocation.hours}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 items-baseline">
                  <dt className="text-xs text-fg-3 tracking-[0.08em] uppercase font-medium shrink-0">
                    Address
                  </dt>
                  <dd className="text-[13px] font-mono text-right text-fg-1">
                    {activeLocation.address}
                  </dd>
                </div>
              </dl>

              <div className="flex gap-2.5 mt-[4px] flex-wrap">
                <Button
                  variant="dark"
                  text={`Book a tour at ${activeLocation.name}`}
                  icon={ArrowRight}
                  iconPosition="right"
                  iconSize={14}
                  onClick={() => onBookTour?.(activeLocation.id)}
                  className="px-5.5 text-sm"
                />
                <Button
                  variant="outline"
                  text="See the room"
                  href={`/locations/${activeLocation.id}`}
                  className="rounded-sm px-4.5 leading-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="bg-transparent border-0 p-0 text-[13px] text-clay font-medium cursor-pointer inline-flex items-center gap-1.5 self-start mt-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {showMap ? 'Hide map' : 'Show on map'}
              </button>
            </article>

            <AnimatePresence initial={false}>
              {showMap && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  className="overflow-hidden rounded-sm border border-rule"
                >
                  {activeLocation.mapEmbedUrl || activeLocation.mapQuery ? (
                    <iframe
                      title={`${activeLocation.name} on Google Maps`}
                      src={
                        activeLocation.mapEmbedUrl ||
                        `https://www.google.com/maps?q=${activeLocation.mapQuery}&output=embed`
                      }
                      width="100%"
                      height="220"
                      className="border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-sm text-fg-3 bg-bg-raised">
                      No map data — add an address, coordinates, or Google Maps
                      URL
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
