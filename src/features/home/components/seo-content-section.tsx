import { motion } from 'framer-motion'
import { MapPin, Wifi, Building2, Clock, Check } from 'lucide-react'

export function SEOContentSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Prime Locations',
      description: 'Strategically located in Kathmandu & Lalitpur with excellent connectivity',
    },
    {
      icon: Wifi,
      title: 'High-Speed Internet',
      description: 'Reliable fiber internet with 99.9% uptime guarantee',
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Work on your schedule with round-the-clock availability',
    },
    {
      icon: Building2,
      title: 'Meeting Rooms',
      description: 'Professional meeting rooms and event spaces for booking',
    },
  ]

  const locations = [
    {
      name: 'Dhobighat Hub',
      area: 'Kathmandu',
      features: ['24/7 Access', 'Meeting Rooms', 'Event Space', 'Flagship Location'],
    },
    {
      name: 'Kausimaa Co-working',
      area: 'Kupondole, Lalitpur',
      features: ['Outdoor Terrace', 'Phone Booths', 'Modern Workspace'],
    },
    {
      name: 'Jhamsikhel Loft',
      area: 'Lalitpur',
      features: ['Rooftop Terrace', 'Cafe', 'Premium Space'],
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-background dark:via-primary/5 dark:to-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Best Co Working Space
            </span>
            {' '}in Nepal
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-muted-foreground leading-relaxed">
            Premium coworking spaces in Kathmandu and Lalitpur designed for freelancers, entrepreneurs, and remote workers
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-white dark:bg-background border border-purple-100 dark:border-purple-900/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-gray-900 dark:text-white">
              Our Locations
            </h3>
            <p className="text-gray-600 dark:text-muted-foreground">
              Choose from our premium workspace locations across Nepal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50/50 dark:from-background dark:to-primary/5 border border-purple-200 dark:border-purple-900/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="mb-4">
                    <h4 className="font-bold text-xl mb-1 text-purple-700 dark:text-purple-400">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location.area}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {location.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-8 border-t border-purple-100 dark:border-purple-900/50"
        >
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            From daily passes to private offices, CreatrixSpace provides flexible membership plans 
            that suit your needs. Experience the perfect environment for productivity and growth 
            at Nepal's premier coworking spaces.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
