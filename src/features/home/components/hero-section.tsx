import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Users, Wifi, Coffee, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
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
    src: '/images/hero-slider/dhobighat-office-back.webp',
    alt: 'Dhobighat office workspace back view'
  },
  {
    src: '/images/hero-slider/professional-workspace-desk.webp',
    alt: 'Professional workspace with desk'
  },
  {
    src: '/images/hero-slider/dhobighat-coworking-space.webp',
    alt: 'Dhobighat coworking space'
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
    <section className="relative section-padding bg-gradient-to-br from-amber-50 via-red-50 to-rose-100 dark:from-amber-950/30 dark:via-red-950/30 dark:to-rose-950/30 overflow-hidden">
      {/* Warm Cozy Background with Snowflakes and Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Snowflakes */}
        {[...Array(60)].map((_, i) => {
          const size = Math.random() * 4 + 2
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 5
          const duration = 3 + Math.random() * 4
          
          return (
            <motion.div
              key={`snowflake-${i}`}
              className="absolute text-white/60"
              style={{
                fontSize: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, 100],
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            >
              ❄
            </motion.div>
          )
        })}
        
        {/* Golden Sparkles */}
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 3 + 1
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 2
          
          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <Sparkles className="w-full h-full text-amber-400" />
            </motion.div>
          )
        })}
        
        {/* Warm Glowing Orbs */}
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-red-300/30 to-amber-300/30 blur-3xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/30 blur-2xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Decorative Stars */}
        {[...Array(15)].map((_, i) => {
          const size = 4 + Math.random() * 4
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 3
          
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute text-amber-400/50"
              style={{
                fontSize: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              ✨
            </motion.div>
          )
        })}
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
                <span className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
                  Best Co Working Space
                </span>
                <span className="block bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 bg-clip-text text-transparent">
                  in Kathmandu & Lalitpur, Nepal
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                CreatrixSpace offers premium co working spaces in Nepal with locations in Kathmandu (Dhobighat) and Lalitpur (Kupondole, Jhamsikhel). 
                Flexible plans, 24/7 access, high-speed internet, meeting rooms, and modern facilities. 
                Perfect for freelancers, entrepreneurs, startups, and remote workers seeking the best coworking space in Nepal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to={ROUTES.BOOKING}>
                  Book a Tour
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.PRICING}>
                  View Pricing
                </Link>
              </Button>
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
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-amber-500/10 to-transparent" />
              
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
            
            {/* Floating Cards - Holiday Themed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -right-4 top-8 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/50 dark:to-amber-950/50 rounded-xl p-4 shadow-lg border-2 border-red-200 dark:border-red-800"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-300">Holiday</div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">Special Offers</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="absolute -left-4 bottom-8 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/50 dark:to-red-950/50 rounded-xl p-4 shadow-lg border-2 border-amber-200 dark:border-amber-800"
            >
              <div className="text-center">
                <span className="text-2xl block mb-1">🎊</span>
                <div className="text-sm font-bold text-amber-800 dark:text-amber-200">New Year</div>
                <div className="text-xs text-red-700 dark:text-red-300">New Beginnings</div>
              </div>
            </motion.div>

            {/* Free Coffee & Tea Chip - Holiday Style */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="absolute -left-4 top-1/3 bg-gradient-to-br from-amber-100 to-red-100 dark:from-amber-900/30 dark:to-red-900/30 rounded-xl p-3 shadow-lg border-2 border-amber-300 dark:border-amber-700"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">☕</span>
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">Warm</div>
                  <div className="text-xs text-red-800 dark:text-red-300">Coffee & Tea</div>
                </div>
              </div>
            </motion.div>

            {/* Cozy Environment Chip - Holiday Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="absolute -right-4 bottom-1/3 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/30 dark:to-amber-900/30 rounded-xl p-3 shadow-lg border-2 border-red-300 dark:border-red-700"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏠</span>
                <div>
                  <div className="text-xs font-bold text-red-900 dark:text-red-200">Cozy</div>
                  <div className="text-xs text-amber-800 dark:text-amber-300">Warm Space</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Facility Chips Section - Holiday Themed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🎄', label: 'Festive Atmosphere', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' },
              { icon: '☕', label: 'Warm Coffee & Tea', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700' },
              { icon: '🏠', label: 'Cozy Workspace', color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700' },
              { icon: Wifi, label: 'High Speed Internet', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800' },
              { icon: MapPin, label: 'Prime Locations', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' },
              { icon: '🔒', label: '24/7 Secure Access', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800' },
            ].map((facility, index) => (
              <motion.div
                key={facility.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${facility.color} shadow-sm hover:shadow-lg transition-all hover:scale-105`}>
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
