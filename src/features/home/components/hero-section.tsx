import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Users, Wifi, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const stats = [
  { icon: MapPin, label: 'Locations', value: '3+' },
  { icon: Users, label: 'Members', value: '500+' },
  { icon: Wifi, label: 'Uptime', value: '99.9%' },
  { icon: Coffee, label: 'Cups/Day', value: '200+' },
]

export function HeroSection() {
  return (
    <section className="relative section-padding bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Purple Stars and Planets Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small Stars - Purple star shapes */}
        {[...Array(80)].map((_, i) => {
          const size = Math.random() * 3 + 1
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 3
          const duration = 2 + Math.random() * 2
          
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: 0.4 + Math.random() * 0.4,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <div 
                className="w-full h-full bg-purple-500"
                style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                WebkitClipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
              />
            </motion.div>
          )
        })}
        
        {/* Medium Stars - Brighter purple star shapes */}
        {[...Array(20)].map((_, i) => {
          const size = 3 + Math.random() * 3
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 2
          
          return (
            <motion.div
              key={`bright-star-${i}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: 0.6,
              }}
              animate={{
                opacity: [0.4, 0.9, 0.4],
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <div 
                className="w-full h-full bg-purple-600"
                style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  WebkitClipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  boxShadow: `0 0 ${size}px rgba(147, 51, 234, 0.5)`,
                }}
              />
            </motion.div>
          )
        })}
        
        {/* Saturn - Purple with realistic rings */}
        <motion.div
          className="absolute top-10 right-10 flex items-center justify-center"
          style={{
            opacity: 0.7,
            width: '120px',
            height: '120px',
          }}
          animate={{
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Saturn Rings - Multiple elliptical rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer ring */}
            <div 
              className="absolute border-2 border-purple-500/50" 
              style={{ 
                width: '100px', 
                height: '8px',
                borderRadius: '50%',
                transform: 'rotate(25deg)',
              }} 
            />
            {/* Middle ring - brighter */}
            <div 
              className="absolute border border-purple-500/60" 
              style={{ 
                width: '90px', 
                height: '6px',
                borderRadius: '50%',
                transform: 'rotate(25deg)',
              }} 
            />
            {/* Inner ring */}
            <div 
              className="absolute border border-purple-400/40" 
              style={{ 
                width: '80px', 
                height: '5px',
                borderRadius: '50%',
                transform: 'rotate(25deg)',
              }} 
            />
            {/* Gap ring */}
            <div 
              className="absolute border border-purple-500/30" 
              style={{ 
                width: '70px', 
                height: '4px',
                borderRadius: '50%',
                transform: 'rotate(25deg)',
              }} 
            />
          </div>
          
          {/* Saturn Planet - with gradient for realism */}
          <div 
            className="relative rounded-full bg-purple-600 mx-auto z-10" 
            style={{
              width: '36px',
              height: '36px',
              background: 'radial-gradient(circle at 35% 35%, rgba(167, 139, 250, 0.9), rgba(139, 92, 246, 0.8), rgba(124, 58, 237, 0.7))',
              boxShadow: '0 0 40px rgba(147, 51, 234, 0.5), inset -5px -5px 10px rgba(79, 70, 229, 0.3)',
            }} 
          >
            {/* Planet surface detail */}
            <div 
              className="absolute inset-0 rounded-full opacity-20" 
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 60%)',
              }} 
            />
          </div>
        </motion.div>
        
        {/* Planets - Purple dots of different sizes */}
        
        <motion.div
          className="absolute bottom-32 left-1/3 w-10 h-10 rounded-full bg-purple-500"
          style={{
            opacity: 0.4,
            boxShadow: '0 0 25px rgba(147, 51, 234, 0.25)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-16 w-8 h-8 rounded-full bg-purple-400"
          style={{
            opacity: 0.5,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)',
          }}
        />
        
        {/* Additional small planets */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-purple-500"
          style={{
            opacity: 0.4,
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-7 h-7 rounded-full bg-purple-600"
          style={{
            opacity: 0.45,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
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
              <Badge variant="outline" className="w-fit">
                ✨ New location opening in Baluwatar
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Your Perfect
                <span className="gradient-text block">Workspace Awaits</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Premium coworking spaces in Kathmandu's prime locations. 
                Join a community of ambitious professionals and grow your business in inspiring environments.
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
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/dhobighat-office-space1.png"
                alt="Modern coworking space"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -right-4 top-8 bg-white dark:bg-card rounded-xl p-4 shadow-lg border"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">24/7 Access</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="absolute -left-4 bottom-8 bg-white dark:bg-card rounded-xl p-4 shadow-lg border"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-primary">High Speed</div>
                <div className="text-sm text-muted-foreground">Reliable Internet</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
