import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Users, Star, Clock, AlertCircle } from 'lucide-react'
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
    limitedAvailability: true,
    onlyRoomAvailable: true,
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
    <section className="section-padding">
      <div className="container">
        {/* Urgency Banner */}
        {locations.some(loc => loc.onlyRoomAvailable) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-red-900 dark:text-red-100">
                      Limited Availability
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Only one room available for immediate booking
                    </p>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                    <Link to={ROUTES.BOOKING}>
                      <Clock className="h-4 w-4 mr-2" />
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
              <span className="gradient-text block">Across Kathmandu</span>
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
              <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                location.onlyRoomAvailable ? 'ring-2 ring-red-500 ring-offset-2 shadow-lg' : ''
              }`}>
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
                  
                  {/* Only Room Available Badge */}
                  {location.onlyRoomAvailable && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 left-4 z-10"
                    >
                      <Badge className="bg-red-600 text-white border-red-700 shadow-lg animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Only Room Available
                      </Badge>
                    </motion.div>
                  )}
                  
                  {location.popular && !location.onlyRoomAvailable && (
                    <Badge className="absolute top-4 left-4">
                      🔥 Most Popular
                    </Badge>
                  )}
                  
                  {location.onlyRoomAvailable && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center space-x-1.5"
                    >
                      <Clock className="h-3 w-3 text-white" />
                      <span className="text-xs font-bold text-white">Book Now</span>
                    </motion.div>
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
                      className={`w-full ${
                        location.onlyRoomAvailable 
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                          : ''
                      }`}
                      variant={location.onlyRoomAvailable ? "default" : "outline"}
                      asChild
                    >
                      <Link to={location.onlyRoomAvailable ? ROUTES.BOOKING : `${ROUTES.LOCATIONS}/${location.id}`}>
                        {location.onlyRoomAvailable ? (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Book Now - Limited Availability
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          'Explore Location'
                        )}
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
