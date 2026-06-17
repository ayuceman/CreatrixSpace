import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useBookTour } from '@/lib/book-tour-context'

const heroImages = [
  {
    src: '/images/hero-slider/office-meeting-room.webp',
    alt: 'Modern meeting room with conference table',
    label: 'Jhamsikhel Loft',
    location: 'Jhamsikhel, Lalitpur',
  },
  {
    src: '/images/hero-slider/dhobighat-coworking-space.webp',
    alt: 'Dhobighat coworking space',
    label: 'Dhobighat Hub',
    location: 'Dhobighat, Kathmandu',
  },
  {
    src: '/images/hero-slider/creatrixspace-workspace-interior-1.webp',
    alt: 'CreatrixSpace workspace interior',
    label: 'Kausimaa Co-working',
    location: 'Kupondole, Lalitpur',
  },
  {
    src: '/images/hero-slider/creatrixspace-coworking-area-1.webp',
    alt: 'CreatrixSpace coworking area',
    label: 'Dhobighat Hub',
    location: 'Dhobighat, Kathmandu',
  },
  {
    src: '/images/hero-slider/professional-workspace-desk.webp',
    alt: 'Professional workspace with desk',
    label: 'Jhamsikhel Loft',
    location: 'Jhamsikhel, Lalitpur',
  },
]

const pricingStrip = [
  { label: 'NPR 800', sublabel: 'A day · no deposit' },
  { label: 'NPR 8,000', sublabel: 'A month · dedicated desk' },
  { label: '5 rooms', sublabel: 'Private offices — available now' },
  { label: 'NPR 6,000', sublabel: 'Virtual office · per month' },
]

interface HeroSectionProps {
  onBookTour?: () => void
}

export function HeroSection({ onBookTour: _onBookTour }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { openTour } = useBookTour()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    )
  }

  return (
    <section className="pt-6 section-padding bg-bg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-3.5 px-4 py-2 pr-4 pl-3.5 bg-bg-raised border border-rule rounded-pill mb-7">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="relative inline-block w-2 h-2 rounded-full bg-moss before:absolute before:-inset-1 before:rounded-full before:border before:border-moss before:opacity-60 before:animate-ping"
              />
              <span className="eyebrow text-label uppercase tracking-widest font-medium text-moss">
                Now booking
              </span>
            </span>
            <span className="w-px h-3.5 bg-rule-strong" />
            <span className="text-[13px] text-fg-2">
              <b className="text-fg-1 font-medium">5 private offices</b> just
              opened across the three buildings — and{' '}
              <b className="text-fg-1 font-medium">25 hot desks</b> today
            </span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-14 items-end pb-14">
          {/* Left — Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="font-display font-normal text-[clamp(56px,9vw,132px)] leading-[0.95] tracking-tight m-0 text-fg-1">
              A quieter way
              <br />
              <em className="text-clay">to work</em>
              <br />
              in the valley.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex items-end"
          >
            <div>
              <p className="text-[19px] leading-[1.55] text-fg-2 max-w-95 mb-8">
                Three rooms across Kathmandu and Lalitpur — hot desks, dedicated
                desks, five lockable private offices, and a virtual office for
                NPR 6,000 a month.
              </p>

              <div className="hidden md:flex items-center gap-4">
                <Button
                  variant="dark"
                  text="Book a tour"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="py-3.5 px-7"
                  onClick={() => openTour()}
                />
                <Button
                  variant="outline"
                  icon={MessageCircle}
                  text="WhatsApp"
                  className="py-3.5 px-7 rounded-none"
                  href={WHATSAPP.url}
                  target="_blank"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative h-75 md:h-112.5 lg:h-150 overflow-hidden group">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1, ease: 'easeInOut' },
                  scale: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute inset-0"
              >
                <img
                  src={heroImages[currentImageIndex].src}
                  alt={heroImages[currentImageIndex].alt}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-900/60 to-transparent"
            />

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-bg-raised/85 lg:hidden"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-fg-1" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-bg-raised/85 lg:hidden"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-fg-1" />
            </button>

            <div className="absolute left-8 right-8 bottom-7 z-10 flex items-end justify-between gap-6 flex-wrap text-fg-on-ink-1">
              <div>
                <div className="text-xs uppercase tracking-widest font-medium mb-2 text-white/70">
                  {String(currentImageIndex + 1).padStart(2, '0')} /{' '}
                  {String(heroImages.length).padStart(2, '0')} ·{' '}
                  {heroImages[currentImageIndex].location}
                </div>
                <div className="font-display text-[clamp(28px,4vw,44px)] leading-[1.05] tracking-[-0.01em] transition-opacity duration-400 ease-out">
                  {heroImages[currentImageIndex].label}
                </div>
              </div>
              <div className="flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Slide ${index + 1}`}
                    className={`w-7 h-0.75 p-0 border-0 cursor-pointer transition-colors duration-300 ease-out ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-[22px] grid grid-cols-2 md:grid-cols-4 gap-6 pt-[22px] border-t border-rule"
        >
          {pricingStrip.map((item) => (
            <div key={item.label}>
              <div className="font-display text-[clamp(28px,3.4vw,40px)] leading-none text-fg-1">
                {item.label}
              </div>
              <div className="text-[13px] text-fg-2 mt-2">{item.sublabel}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
