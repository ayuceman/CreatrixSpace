import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Users, Wifi, Coffee, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const stats = [
  { icon: MapPin, label: 'Locations', value: '3+' },
  { icon: Users, label: 'Members', value: '500+' },
  { icon: Wifi, label: 'Uptime', value: '99.9%' },
  { icon: Coffee, label: 'Cups/Day', value: '200+' },
]

const heroImages = [
  {
    src: '/images/hero-slider/office-meeting-room.webp',
    alt: 'Modern meeting room with conference table'
  },
  {
    src: '/images/locations/dhobighat-hub/workshop_hall_plants.jpeg',
    alt: 'Dhobighat workshop hall with plants'
  },
  {
    src: '/images/hero-slider/professional-workspace-desk.webp',
    alt: 'Professional workspace with desk'
  },
  {
    src: '/images/locations/dhobighat-hub/workshop_hall_plants.jpeg',
    alt: 'Dhobighat workshop hall with plants'
  },
  {
    src: '/images/hero-slider/modern-workspace-desk.webp',
    alt: 'Modern workspace desk setup'
  },
  {
    src: '/images/hero-slider/creatrixspace-workspace-interior-1.webp',
    alt: 'CreatrixSpace workspace interior'
  },
  {
    src: '/images/hero-slider/creatrixspace-coworking-area-1.webp',
    alt: 'CreatrixSpace coworking area'
  },
  {
    src: '/images/hero-slider/creatrixspace-office-space-1.webp',
    alt: 'CreatrixSpace office space'
  },
  {
    src: '/images/hero-slider/creatrixspace-modern-workspace-1.webp',
    alt: 'CreatrixSpace modern workspace'
  },
  {
    src: '/images/hero-slider/dhobighat-workspace-view-1.webp',
    alt: 'Dhobighat workspace view'
  },
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-scroll images every 5 seconds
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
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section className="relative section-padding bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Subtle background (no seasonal warm tone) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-primary/[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit bg-primary/10 border-primary/20 text-primary">
                Premium Co Working Space in Nepal
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                <span className="gradient-text">Best Co Working Space</span>
                <span className="block gradient-text">in Kathmandu & Lalitpur, Nepal</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                CreatrixSpace offers premium co working spaces in Nepal with locations in Kathmandu (Dhobighat) and Lalitpur (Kupondole, Jhamsikhel). 
                Flexible plans, 24/7 access, high-speed internet, meeting rooms, and modern facilities. 
                Perfect for freelancers, entrepreneurs, startups, and remote workers seeking the best coworking space in Nepal.
              </p>
            </div>

            {/* Availability / Pricing Banner */}
            <div className="rounded-2xl border bg-background/70 dark:bg-background/40 backdrop-blur p-4 md:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold leading-tight">Private offices are fully booked</p>
                    <p className="text-sm text-muted-foreground">
                      Hot desks available now. Membership starts at:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center rounded-full border bg-background/70 dark:bg-background/40 px-2.5 py-1 text-xs">
                        <span className="font-semibold text-foreground">NPR 800.00/day</span>
                      </span>
                      <span className="inline-flex items-center rounded-full border bg-background/70 dark:bg-background/40 px-2.5 py-1 text-xs">
                        <span className="font-semibold text-foreground">NPR 3,000/week</span>
                      </span>
                      <span className="inline-flex items-center rounded-full border bg-background/70 dark:bg-background/40 px-2.5 py-1 text-xs">
                        <span className="font-semibold text-foreground">NPR 8,000/month</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
                  <Button size="lg" asChild>
                    <Link to={ROUTES.BOOKING}>
                      Book a Hot Desk
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to={ROUTES.CONTACT}>
                      Join Waitlist
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="text-center"
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-bold text-2xl">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              {/* Image Carousel */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImages[currentImageIndex].src}
                    alt={heroImages[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
          </motion.div>
        </div>

        {/* Facility Chips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Wifi, label: 'High-speed Internet' },
              { icon: MapPin, label: 'Prime Locations' },
              { icon: Users, label: 'Vibrant Community' },
              { icon: Coffee, label: 'Coffee & Tea' },
              { icon: '🔒', label: 'Secure Access' },
              { icon: '🏢', label: 'Meeting Rooms' },
            ].map((facility, index) => (
              <motion.div
                key={facility.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full border bg-background/70 dark:bg-background/40 text-foreground shadow-sm hover:shadow-lg transition-all hover:scale-105">
                  {typeof facility.icon === 'string' ? (
                    <span className="text-lg">{facility.icon}</span>
                  ) : (
                    <facility.icon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">{facility.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
