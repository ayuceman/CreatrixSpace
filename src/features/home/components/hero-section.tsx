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
    <section className="relative pt-6 md:pt-8 pb-12 md:pb-16 lg:pb-20 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 dark:from-background dark:via-background dark:to-primary/5 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-5 lg:space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-4 py-1.5 text-sm font-medium shadow-lg shadow-purple-500/30">
                ✨ Premium Co Working Space in Nepal
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-[1.15] tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  Best Co Working Space
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">in Kathmandu &</span>
                <br />
                <span className="text-gray-900 dark:text-white">Lalitpur, Nepal</span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-muted-foreground leading-relaxed max-w-xl">
                Premium workspace with flexible plans, 24/7 access, high-speed internet & modern facilities. 
                Perfect for freelancers, entrepreneurs & remote workers.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40" asChild>
                <Link to={ROUTES.BOOKING} className="group">
                  Book Hot Desk Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30" asChild>
                <Link to={ROUTES.CONTACT}>
                  Schedule Tour
                </Link>
              </Button>
            </motion.div>

            {/* Pricing Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Private offices fully booked</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hot desks available starting from:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 bg-white dark:bg-background rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-400">NPR 800/day</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white dark:bg-background rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-400">NPR 3,000/week</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white dark:bg-background rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-400">NPR 8,000/month</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-4 gap-4 pt-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="font-bold text-xl text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-gray-600 dark:text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:scale-110"
          >
            {/* Decorative Ring */}
            <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-3xl blur-2xl" />
            
            <div className="relative aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden group shadow-2xl shadow-purple-500/20 border-4 border-white dark:border-gray-800">
              {/* Image Carousel */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImages[currentImageIndex].src}
                    alt={heroImages[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent" />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-purple-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-purple-700" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-white'
                        : 'w-1.5 bg-white/50 hover:bg-white/75'
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 lg:mt-16"
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
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-background border border-purple-100 dark:border-purple-900/50 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:-translate-y-0.5 cursor-default">
                  {typeof facility.icon === 'string' ? (
                    <span className="text-base">{facility.icon}</span>
                  ) : (
                    <facility.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{facility.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
