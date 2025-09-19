import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const locations = [
  {
    id: 'thamel-hub',
    name: 'Thamel Hub',
    address: 'Thamel, Kathmandu',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 120,
    rating: 4.9,
    features: ['24/7 Access', 'Meeting Rooms', 'Event Space'],
    popular: true,
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
  },
  {
    id: 'baluwatar-studios',
    name: 'Baluwatar Studios',
    address: 'Baluwatar, Kathmandu',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 60,
    rating: 4.7,
    features: ['New Location', 'Creative Spaces', 'Tech Hub'],
    popular: false,
  },
]

export function LocationsPreview() {
  return (
    <section className="section-padding">
      <div className="container">
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
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {location.popular && (
                    <Badge className="absolute top-4 left-4">
                      🔥 Most Popular
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

                  <Button 
                    className="w-full" 
                    variant="outline"
                    asChild
                  >
                    <Link to={`${ROUTES.LOCATIONS}/${location.id}`}>
                      Explore Location
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
