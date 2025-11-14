import { motion } from 'framer-motion'
import { MapPin, Users, Star, Clock, Wifi, Coffee, Car, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

const locations = [
  {
    id: 'dhobighat-hub',
    name: 'Dhobighat (WashingTown) Hub',
    address: 'Dhobighat, Kathmandu',
    image: '/dhobighat-office-space1.png',
    capacity: 30,
    rating: 4.9,
    features: ['24/7 Access', 'Meeting Rooms', 'Event Space', 'High-Speed WiFi', 'Parking'],
    amenities: ['Coffee Bar', 'Printing Services', 'Phone Booths', 'Lounge Areas'],
    openingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '20:00' }
    },
    available: true,
    popular: true,
  },
  {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    address: 'Kupondole, Lalitpur',
    image: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/2-1639371534.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
    capacity: 40,
    rating: 4.6,
    features: ['WiFi', 'Outdoor Terrace', 'Phone Booths', 'Lounge Areas'],
    amenities: ['WiFi', 'Lounge Area', 'Outdoor Terrace', 'Kitchen', 'Phone Booths', 'Event Space For Rent', 'Free Drinking Water', 'Parking'],
    openingHours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '18:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '10:00', close: '18:00' }
    },
    available: true,
    popular: false,
  },
  {
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft',
    address: 'Jhamsikhel, Lalitpur',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 80,
    rating: 4.8,
    features: ['Rooftop Terrace', 'Cafe', 'Parking', 'Natural Light'],
    amenities: ['Outdoor Seating', 'Kitchen Facilities', 'Event Space', 'Storage Lockers'],
    openingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: { open: '09:00', close: '19:00' }
    },
    available: false,
    status: 'Reserved for 6 months',
    popular: false,
  },
]

export function LocationsPage() {
  return (
    <div className="container section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Our <span className="gradient-text">Locations</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our premium coworking spaces across Kathmandu. Each location is designed 
          to inspire productivity and foster collaboration.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Open now</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {location.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {location.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Opening Hours</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Mon - Fri</span>
                      <span>{location.openingHours.monday.open} - {location.openingHours.monday.close}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend</span>
                      <span>{location.openingHours.saturday.open} - {location.openingHours.saturday.close}</span>
                    </div>
                  </div>
                </div>

                {location.available ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    asChild
                  >
                    <Link to={`${ROUTES.LOCATIONS}/${location.id}`}>
                      View Details
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16"
      >
        <h2 className="text-2xl font-semibold mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted-foreground mb-6">
          We're constantly expanding our network. Get notified when new locations open.
        </p>
        <Button size="lg" asChild>
          <Link to={ROUTES.CONTACT}>
            Contact Us
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
