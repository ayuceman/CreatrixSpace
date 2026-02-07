import { motion } from 'framer-motion'
import { 
  Wifi, 
  Clock, 
  Coffee, 
  Shield, 
  Printer, 
  Phone,
  Calendar,
  Users,
  Car
} from 'lucide-react'

const features = [
  {
    icon: Wifi,
    title: 'Gigabit Internet',
    description: 'Redundant fiber connections with dedicated bandwidth. Built for video calls, cloud ops, and zero-latency workflows.',
    highlight: true,
  },
  {
    icon: Clock,
    title: '24/7 Operations',
    description: 'Round-the-clock access with keycard entry. Work across time zones without restrictions.',
    highlight: true,
  },
  {
    icon: Calendar,
    title: 'Meeting Rooms',
    description: 'AV-equipped conference rooms bookable by the hour. Presentation-ready with displays and whiteboards.',
    highlight: true,
  },
  {
    icon: Shield,
    title: 'Security & Access Control',
    description: 'CCTV monitoring, keycard access, visitor management, and secure document storage.',
    highlight: false,
  },
  {
    icon: Phone,
    title: 'Private Phone Booths',
    description: 'Sound-isolated booths for calls, video conferences, and focused work sessions.',
    highlight: false,
  },
  {
    icon: Coffee,
    title: 'Premium Coffee & Pantry',
    description: 'Complimentary specialty coffee, tea, and refreshments. Fully stocked shared kitchen.',
    highlight: false,
  },
  {
    icon: Printer,
    title: 'Business Services',
    description: 'High-quality printing, scanning, copying, and mail handling services included.',
    highlight: false,
  },
  {
    icon: Users,
    title: 'Community & Events',
    description: 'Curated networking events, workshops, and knowledge-sharing sessions for members.',
    highlight: false,
  },
  {
    icon: Car,
    title: 'Parking',
    description: 'Secure on-site parking available at select locations. Two and four-wheeler options.',
    highlight: false,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-24 bg-gray-50 dark:bg-gray-950/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
            Amenities & Infrastructure
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Everything Your Team Needs
          </h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade facilities designed for productivity, collaboration, and professional growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className={`relative h-full p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  feature.highlight 
                    ? 'bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800 shadow-sm' 
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      feature.highlight 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  {feature.highlight && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">
                        Core
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
