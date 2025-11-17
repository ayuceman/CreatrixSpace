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
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Wifi,
    title: 'High-Speed Internet',
    description: 'High speed and reliable internet with 99.9% uptime guarantee.',
    highlight: true,
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Work on your schedule with round-the-clock access to all locations.',
    highlight: true,
  },
  {
    icon: Coffee,
    title: 'Premium Coffee',
    description: 'Unlimited specialty coffee, tea, and refreshments throughout the day.',
    highlight: false,
  },
  {
    icon: Shield,
    title: 'Secure Environment',
    description: 'CCTV monitoring, keycard access, and secure lockers for your belongings.',
    highlight: false,
  },
  {
    icon: Printer,
    title: 'Print & Scan',
    description: 'High-quality printing, scanning, and copying services available.',
    highlight: false,
  },
  {
    icon: Phone,
    title: 'Phone Booths',
    description: 'Private phone booths for confidential calls and video conferences.',
    highlight: false,
  },
  {
    icon: Calendar,
    title: 'Meeting Rooms',
    description: 'Book professional meeting rooms equipped with latest AV technology.',
    highlight: true,
  },
  {
    icon: Users,
    title: 'Community Events',
    description: 'Regular networking events, workshops, and professional development sessions.',
    highlight: false,
  },
  {
    icon: Car,
    title: 'Parking Available',
    description: 'Secure parking spaces available at select locations.',
    highlight: false,
  },
]

export function FeaturesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Everything You Need to
            <span className="gradient-text"> Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our premium amenities and services are designed to boost your productivity 
            and provide the perfect environment for your business to thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`relative h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  feature.highlight ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                }`}>
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      feature.highlight 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                    {feature.highlight && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
