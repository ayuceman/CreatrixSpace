import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Users, Wifi, Shield, ChevronLeft, ChevronRight, Building2, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const stats = [
  { icon: Building2, label: 'Locations', value: '3' },
  { icon: Users, label: 'Members', value: '500+' },
  { icon: Wifi, label: 'Uptime', value: '99.9%' },
  { icon: Clock, label: 'Access', value: '24/7' },
]

const heroImages = [
  {
    src: '/images/hero-slider/office-meeting-room.webp',
    alt: 'Modern meeting room with conference table'
  },
  {
    src: '/images/hero-slider/professional-workspace-desk.webp',
    alt: 'Professional workspace with desk'
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
  {
    src: '/images/locations/dhobighat-hub/workshop_hall_plants.jpeg',
    alt: 'Dhobighat workshop hall with plants'
  },
]

const trustLogos = [
  'Trusted by startups and enterprises across Nepal',
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
    <section className="relative pt-8 md:pt-12 pb-16 md:pb-20 lg:pb-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/40 dark:from-background dark:via-background dark:to-primary/5 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-purple-200/15 dark:bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-200/10 dark:bg-primary/5 rounded-full blur-[80px]" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-4 py-1.5 text-sm font-medium">
                <Zap className="h-3.5 w-3.5 mr-1.5 fill-purple-500 text-purple-500" />
                Nepal's Premier Workspace
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold leading-[1.1] tracking-tight">
                <span className="text-gray-900 dark:text-white">
                  Where Ambitious
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Teams Do Their
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  Best Work
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-muted-foreground leading-relaxed max-w-lg">
                Professional workspaces in Kathmandu & Lalitpur. Flexible plans, enterprise-grade infrastructure, and a community that accelerates growth.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button size="lg" className="bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-700/25 transition-all hover:shadow-xl hover:shadow-purple-700/30 h-12 px-8 text-base" asChild>
                <Link to={ROUTES.BOOKING} className="group">
                  Book a Workspace
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 h-12 px-8 text-base" asChild>
                <Link to={ROUTES.CONTACT}>
                  Schedule a Tour
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-4 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800"
            >
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <div className="font-bold text-2xl text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                      <Icon className="h-3 w-3" />
                      {stat.label}
                    </div>
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
            className="relative"
          >
            <div className="relative aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden group shadow-2xl shadow-black/10">
              {/* Image Carousel */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
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
              
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Enterprise Ready</div>
                  <div className="text-xs text-gray-500">Secure, scalable, professional</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 lg:mt-20"
        >
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 items-center">
            {[
              { icon: Wifi, label: 'Gigabit Internet' },
              { icon: Shield, label: 'Secure Access' },
              { icon: MapPin, label: 'Prime Locations' },
              { icon: Users, label: 'Active Community' },
              { icon: Building2, label: 'Meeting Rooms' },
              { icon: Clock, label: '24/7 Operations' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <item.icon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
