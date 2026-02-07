import { motion } from 'framer-motion'
import { MapPin, Wifi, Building2, Clock, Check, ArrowRight, Shield, Zap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function SEOContentSection() {
  const capabilities = [
    {
      icon: Building2,
      title: 'Private Offices & Dedicated Desks',
      description: 'Fully furnished private offices from 2-person suites to 20+ team spaces. Lockable, branded, yours.',
      metric: '4 Rooms',
    },
    {
      icon: Wifi,
      title: 'Enterprise-Grade Connectivity',
      description: 'Redundant fiber connections with 99.9% uptime SLA. Dedicated bandwidth options for teams.',
      metric: '99.9% SLA',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'CCTV monitoring, keycard access control, secure document storage, and visitor management.',
      metric: '24/7 Secure',
    },
    {
      icon: Zap,
      title: 'Scalable Infrastructure',
      description: 'Start with a hot desk, grow into a private office. Scale your space as your team grows.',
      metric: 'Flex Plans',
    },
  ]

  const locations = [
    {
      name: 'Dhobighat Hub',
      area: 'Kathmandu',
      status: 'Flagship',
      features: ['24/7 Access', 'Meeting Rooms', 'Event Space', '4 Private Rooms'],
    },
    {
      name: 'Kausimaa Co-working',
      area: 'Kupondole, Lalitpur',
      status: 'Active',
      features: ['Outdoor Terrace', 'Phone Booths', 'Modern Workspace'],
    },
    {
      name: 'Jhamsikhel Loft',
      area: 'Lalitpur',
      status: 'Active',
      features: ['Rooftop Terrace', 'Cafe', 'Premium Space'],
    },
  ]

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase mb-3">
            Why CreatrixSpace
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Built for Teams That
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"> Mean Business</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-muted-foreground leading-relaxed">
            Professional infrastructure, flexible terms, and operational support so you can focus on what matters.
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-full p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all hover:shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <item.icon className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 rounded-full">
                    {item.metric}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase mb-2">
              Locations
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
              Strategically Positioned Across the Valley
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-full p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      location.status === 'Flagship'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {location.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                    {location.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin className="h-3.5 w-3.5" />
                    {location.area}
                  </p>
                  <ul className="space-y-2">
                    {location.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20" asChild>
              <Link to={ROUTES.LOCATIONS}>
                Explore all locations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
