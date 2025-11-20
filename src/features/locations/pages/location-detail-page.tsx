import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, Clock, Wifi, Coffee, Car, Shield, ArrowLeft, Calendar, Phone, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { Location } from '@/lib/types'
import { Gallery, ImageModal } from '@/components/ui/react-tailwind-image-gallery'

const locationData: Record<string, Location> = {
  'dhobighat-hub': {
    id: 'dhobighat-hub',
    name: 'Dhobighat (WashingTown) Hub',
    address: 'Dhobighat, Kathmandu',
    fullAddress: 'Dhobighat Chowk, Kathmandu 44600, Nepal',
    image: '/images/locations/dhobighat-hub/dhobighat-coworking-space-main.png',
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
    description: 'Our flagship location in the heart of Dhobighat, featuring modern amenities and 24/7 access. Perfect for entrepreneurs, freelancers, and remote workers.',
    contact: {
      phone: '+977 9851357889',
      email: ''
    },
    googleMapsUrl: 'https://maps.app.goo.gl/Pw4KLyfjaj2Wdrsw9?g_st=ipc'
  },
  'kausimaa': {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    address: 'Kupondole, Lalitpur',
    fullAddress: 'Jwagal/Kupondole, Lalitpur, Nepal',
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
    description: 'Set on an airy terrace, Kausimaa provides a quiet, green workspace ideal for freelancers, students, and creative minds — with steady WiFi, unlimited tea/coffee, and basic printing services.',
    contact: {
      phone: '',
      email: ''
    },
    googleMapsUrl: ''
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
      email: ''
    }
  },
  // Baluwatar Studios temporarily hidden
}

const getLocationGalleryImages = (locationId: string) => {
  const galleries: Record<string, Array<{ id: number; src: string; alt: string; title: string; span?: string }>> = {
    'dhobighat-hub': [
      {
        id: 1,
        src: '/images/locations/dhobighat-hub/dhobighat-dining-area.png',
        alt: 'Dhobighat dining area',
        title: 'Dining Area',
        span: 'col-span-1'
      },
      {
        id: 2,
        src: '/images/locations/dhobighat-hub/dhobighat-productivity-space.png',
        alt: 'Boost Your Productivity',
        title: 'Boost Your Productivity',
        span: 'sm:col-span-2'
      },
      {
        id: 3,
        src: '/images/locations/dhobighat-hub/dhobighat-office-back-view.png',
        alt: 'Dhobighat office back view',
        title: 'Office Back View',
        span: 'col-span-1'
      },
      {
        id: 4,
        src: '/images/locations/dhobighat-hub/dhobighat-espresso-bar.png',
        alt: 'Dhobighat espresso bar',
        title: 'Espresso Bar',
        span: 'col-span-1'
      },
      {
        id: 5,
        src: '/images/locations/dhobighat-hub/dhobighat-kitchen.png',
        alt: 'Dhobighat kitchen',
        title: 'Kitchen',
        span: 'col-span-1'
      },
      {
        id: 6,
        src: '/images/locations/dhobighat-hub/creatrixspace-coworking-area-1.jpg',
        alt: 'Dhobighat coworking area',
        title: 'Coworking Area',
        span: 'sm:col-span-2'
      },
      {
        id: 7,
        src: '/images/locations/dhobighat-hub/dhobighat-office-front-entrance.png',
        alt: 'Dhobighat office front entrance',
        title: 'Office Front Entrance',
        span: 'col-span-1'
      },
      {
        id: 8,
        src: '/images/locations/dhobighat-hub/dhobighat-meeting-room.png',
        alt: 'Dhobighat meeting room',
        title: 'Meeting Room',
        span: 'col-span-1'
      },
      {
        id: 9,
        src: '/images/locations/dhobighat-hub/creatrixspace-workspace-interior-1.jpg',
        alt: 'Dhobighat workspace interior',
        title: 'Workspace Interior',
        span: 'col-span-1'
      },
      {
        id: 10,
        src: '/images/locations/dhobighat-hub/dhobighat-modern-workspace-desk.png',
        alt: 'Dhobighat modern workspace desk',
        title: 'Modern Workspace Desk',
        span: 'col-span-1'
      },
      {
        id: 11,
        src: '/images/locations/dhobighat-hub/creatrixspace-modern-workspace-1.jpg',
        alt: 'Dhobighat modern workspace',
        title: 'Modern Workspace',
        span: 'sm:col-span-2'
      },
      {
        id: 12,
        src: '/images/locations/dhobighat-hub/dhobighat-professional-workspace-desk.png',
        alt: 'Dhobighat professional workspace desk',
        title: 'Professional Workspace Desk',
        span: 'col-span-1'
      },
      {
        id: 13,
        src: '/images/locations/dhobighat-hub/creatrixspace-office-space-1.jpg',
        alt: 'Dhobighat office space',
        title: 'Office Space',
        span: 'col-span-1'
      }
    ],
    'kausimaa': [
      { id: 1, src: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/1-1639371534.JPG?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle', alt: 'Kausimaa interior', title: 'Kausimaa Interior', span: 'col-span-1' },
      { id: 2, src: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/2-1639371534.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle', alt: 'Kausimaa workspace', title: 'Kausimaa Workspace', span: 'sm:col-span-2' },
      { id: 3, src: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/main.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle', alt: 'Kausimaa main area', title: 'Kausimaa Main Area', span: 'col-span-1' }
    ],
    'jhamsikhel-loft': [
      {
        id: 1,
        src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Loft space',
        title: 'Loft Space',
        span: 'col-span-1'
      },
      {
        id: 2,
        src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Rooftop terrace',
        title: 'Rooftop Terrace',
        span: 'sm:col-span-2'
      },
      {
        id: 3,
        src: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Natural lighting',
        title: 'Natural Lighting',
        span: 'col-span-1'
      },
      {
        id: 4,
        src: 'https://images.unsplash.com/photo-1487088678257-3a541e6e3922?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Outdoor seating',
        title: 'Outdoor Seating',
        span: 'col-span-1'
      }
    ],
    // Baluwatar gallery temporarily hidden
  };

  return galleries[locationId] || [];
};

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = id ? locationData[id as keyof typeof locationData] : null
  const [modalImage, setModalImage] = useState<string | null>(null)

  const galleryImages = id ? getLocationGalleryImages(id) : []

  const openModal = (src: string) => setModalImage(src)
  const closeModal = () => setModalImage(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
      <section className="py-8 bg-gradient-to-br from-background via-background to-primary/5">
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
                    {location.status === 'reserved' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                        🔒 Reserved
                      </Badge>
                    )}
                    {!location.available && location.status && location.status !== 'reserved' && (
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
                      <span className="text-lg">{typeof location.capacity === 'number' ? location.capacity : location.capacity.hotDesks + location.capacity.dedicatedDesks + location.capacity.privateOffices + location.capacity.meetingRooms} capacity</span>
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
                      <Button size="lg" asChild>
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

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Gallery data={galleryImages} onImageClick={openModal} />
        </motion.div>
      )}

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
                {location.features?.map((feature) => (
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
                      <p className="text-muted-foreground">{location.contact?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a 
                        href="https://wa.me/9779803171819"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        +977 9803171819
                      </a>
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
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm" 
                  asChild
                >
                  <Link to={ROUTES.CONTACT}>
                    Schedule a Tour
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      <ImageModal src={modalImage} onClose={closeModal} />
    </div>
  )
}
