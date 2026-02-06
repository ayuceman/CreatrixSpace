import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Users, Star, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const locations = [
  {
    id: 'dhobighat-hub',
    name: 'Dhobighat (WashingTown) Hub',
    address: 'Dhobighat, Kathmandu',
    image: '/images/locations/dhobighat-hub/workshop_hall_plants.jpeg',
    capacity: 30,
    rating: 4.9,
    features: ['24/7 Access', 'Meeting Rooms', 'Event Space'],
    popular: true,
    available: true,
  },
  {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    address: 'Kupondole, Lalitpur',
    image: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/2-1639371534.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
    capacity: 40,
    rating: 4.6,
    features: ['WiFi', 'Outdoor Terrace', 'Phone Booth'],
    popular: false,
    available: true,
  },
  {
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft',
    address: 'Jhamsikhel, Lalitpur',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 80,
    rating: 4.8,
    features: ['Rooftop Terrace', 'Cafe', 'Parking'],
    popular: false,
    available: false,
    status: 'Reserved for 6 months',
  },
]

export function LocationsPreview() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-background">
      <div className="container">
        {/* Availability Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-amber-950 dark:text-amber-100">
                    Private offices are fully booked
                  </h3>
                  <p className="text-sm text-amber-800/90 dark:text-amber-200/90">
                    Hot desks available — membership from NPR 800.00/day • 3,000/week • 8,000/month
                  </p>
                </div>
              </div>
              <div className="ml-auto flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button asChild className="w-full md:w-auto">
                  <Link to={ROUTES.BOOKING}>
                    Book a Hot Desk
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <Link to={ROUTES.CONTACT}>
                    Join Waitlist
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Prime Locations
              <span className="gradient-text block">Kathmandu & Lalitpur</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Choose from our carefully selected locations in the heart of the city, 
              each designed to inspire creativity and collaboration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="outline" asChild>
              <Link to={ROUTES.LOCATIONS}>
                View All Locations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      location.id === 'dhobighat-hub' 
                        ? 'brightness-110 contrast-105 saturate-110' 
                        : ''
                    }`}
                    style={
                      location.id === 'dhobighat-hub'
                        ? { filter: 'brightness(1.15) contrast(1.1) saturate(1.15)' }
                        : {}
                    }
                  />
                  {location.id === 'dhobighat-hub' ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 via-transparent to-orange-200/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  )}

                  {location.popular && (
                    <Badge className="absolute top-4 left-4">
                      🔥 Most Popular
                    </Badge>
                  )}
                  
                  {location.status === 'reserved' && (
                    <Badge variant="secondary" className="absolute top-4 left-4 bg-orange-100 text-orange-800 border-orange-200">
                      🔒 Reserved
                    </Badge>
                  )}
                  
                  {!location.available && location.status && location.status !== 'reserved' && (
                    <Badge variant="destructive" className="absolute top-4 left-4">
                      {location.status}
                    </Badge>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{location.rating}</span>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">{location.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{location.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{location.capacity} capacity</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {location.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {location.available ? (
                    <Button 
                      className="w-full"
                      variant="outline"
                      asChild
                    >
                      <Link to={ROUTES.BOOKING}>
                        Book Hot Desk
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      {location.status}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
