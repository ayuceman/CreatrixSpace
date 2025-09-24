import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, Clock, Wifi, Coffee, Car, Shield, ArrowLeft, Calendar, Phone, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const locationData = {
  'dhobighat-hub': {
    id: 'dhobighat-hub',
    name: 'Dhobighat (WashingTown) Hub',
    address: 'Dhobighat, Kathmandu',
    fullAddress: 'Dhobighat Chowk, Kathmandu 44600, Nepal',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 120,
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
    description: 'Our flagship location in the heart of Dhobighat, featuring modern amenities and 24/7 access. Perfect for entrepreneurs, freelancers, and remote workers.',
    contact: {
      phone: '+977 9851357889',
      email: 'dhobighat@creatrixspace.com'
    },
    googleMapsUrl: 'https://maps.app.goo.gl/Pw4KLyfjaj2Wdrsw9?g_st=ipc'
  },
  'jhamsikhel-loft': {
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft',
    address: 'Jhamsikhel, Lalitpur',
    fullAddress: 'Jhamsikhel, Lalitpur 44600, Nepal',
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
    description: 'A beautiful loft space with rooftop terrace and natural lighting. Currently reserved for a long-term client.',
    contact: {
      phone: '+977 9803171819',
      email: 'jhamsikhel@creatrixspace.com'
    }
  },
  'baluwatar-studios': {
    id: 'baluwatar-studios',
    name: 'Baluwatar Studios',
    address: 'Baluwatar, Kathmandu',
    fullAddress: 'Baluwatar, Kathmandu 44600, Nepal',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 60,
    rating: 4.7,
    features: ['Creative Spaces', 'Tech Hub', 'Modern Design', 'Quiet Zones'],
    amenities: ['Recording Studio', 'Photography Studio', '3D Printing', 'VR Lab'],
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '10:00', close: '18:00' }
    },
    available: false,
    status: 'Coming Soon',
    popular: false,
    description: 'A cutting-edge creative hub designed for artists, designers, and tech innovators. Opening soon with state-of-the-art facilities.',
    contact: {
      phone: '+977 9851357889',
      email: 'baluwatar@creatrixspace.com'
    }
  }
}

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = id ? locationData[id as keyof typeof locationData] : null

  if (!location) {
    return (
      <div className="overflow-hidden">
        <section className="section-padding bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold">Location Not Found</h1>
              <p className="text-lg text-muted-foreground">
                The location you're looking for doesn't exist or may have been moved.
              </p>
              <Button size="lg" asChild>
                <Link to={ROUTES.LOCATIONS}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Locations
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Button variant="ghost" asChild>
              <Link to={ROUTES.LOCATIONS}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Locations
              </Link>
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {location.popular && (
                      <Badge className="bg-primary text-primary-foreground">
                        🔥 Most Popular
                      </Badge>
                    )}
                    {!location.available && location.status && (
                      <Badge variant="destructive">{location.status}</Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-display font-bold">
                    {location.name}
                  </h1>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{location.fullAddress}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                      <span className="text-lg font-medium">{location.rating}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="text-lg">{location.capacity} capacity</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {location.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {location.available ? (
                    <>
                      <Button size="lg" asChild>
                        <Link to={ROUTES.BOOKING}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Now
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to={ROUTES.CONTACT}>
                          Schedule Tour
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" disabled>
                      {location.status}
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features & Amenities */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-bold">Features</h2>
              <div className="grid grid-cols-2 gap-3">
                {location.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-bold">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {location.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opening Hours & Contact */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-bold">Opening Hours</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {Object.entries(location.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-muted-foreground">{hours.open} - {hours.close}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-bold">Contact Information</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{location.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{location.contact.email}</p>
                    </div>
                  </div>
                  {location.googleMapsUrl && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <a 
                          href={location.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center space-x-1"
                        >
                          <span>View on Google Maps</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {location.available && (
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Ready to Experience {location.name}?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Join our community of professionals and discover the perfect workspace for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to={ROUTES.BOOKING}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Your Space
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to={ROUTES.CONTACT}>
                    Schedule a Tour
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
