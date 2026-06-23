import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Users,
  Star,
  ArrowLeft,
  Calendar,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { Location } from '@/lib/types'
import { locationService } from '@/services/supabase-service'
import {
  Gallery,
  ImageModal,
} from '@/components/ui/react-tailwind-image-gallery'

const locationData: Record<string, Location> = {
  'dhobighat-hub': {
    id: 'dhobighat-hub',
    name: 'Dhobighat Hub',
    fullAddress: 'Dhobighat Chowk, Kathmandu 44600, Nepal',
    image:
      '/images/locations/dhobighat-hub/dhobighat-coworking-space-main.webp',
    capacity: 30,
    rating: 4.9,
    features: [
      '24/7 Access',
      'Meeting Rooms',
      'Event Space',
      'High-Speed WiFi',
      'Parking',
    ],
    amenities: [
      'Coffee Bar',
      'Printing Services',
      'Phone Booths',
      'Lounge Areas',
    ],
    openingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '20:00' },
    },
    available: true,
    popular: true,
    description:
      'Our flagship location in the heart of Dhobighat, featuring modern amenities and 24/7 access. Perfect for entrepreneurs, freelancers, and remote workers.',
    contact: {
      phone: '+977 9851357889',
      email: '',
    },
    googleMapsUrl: 'https://maps.app.goo.gl/88JRCRwL5ttdaPpu6',
  },
  kausimaa: {
    id: 'kausimaa',
    name: 'Kausimaa Co-working',
    fullAddress: 'Jwagal/Kupondole, Lalitpur, Nepal',
    image:
      'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/2-1639371534.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
    capacity: 40,
    rating: 4.6,
    features: ['WiFi', 'Outdoor Terrace', 'Phone Booths', 'Lounge Areas'],
    amenities: [
      'WiFi',
      'Lounge Area',
      'Outdoor Terrace',
      'Kitchen',
      'Phone Booths',
      'Event Space For Rent',
      'Free Drinking Water',
      'Parking',
    ],
    openingHours: {
      monday: { open: '10:00', close: '18:00' },
      tuesday: { open: '10:00', close: '18:00' },
      wednesday: { open: '10:00', close: '18:00' },
      thursday: { open: '10:00', close: '18:00' },
      friday: { open: '10:00', close: '18:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    available: true,
    popular: false,
    description:
      'Set on an airy terrace, Kausimaa provides a quiet, green workspace ideal for freelancers, students, and creative minds — with steady WiFi, unlimited tea/coffee, and basic printing services.',
    contact: {
      phone: '',
      email: '',
    },
    googleMapsUrl: '',
  },
  'jhamsikhel-loft': {
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft',
    fullAddress: 'Jhamsikhel, Lalitpur 44600, Nepal',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    capacity: 80,
    rating: 4.8,
    features: ['Rooftop Terrace', 'Cafe', 'Parking', 'Natural Light'],
    amenities: [
      'Outdoor Seating',
      'Kitchen Facilities',
      'Event Space',
      'Storage Lockers',
    ],
    openingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: { open: '09:00', close: '19:00' },
    },
    available: false,
    status: 'Reserved for 6 months',
    popular: false,
    description:
      'A beautiful loft space with rooftop terrace and natural lighting. Currently reserved for a long-term client.',
    contact: {
      phone: '+977 9803171819',
      email: '',
    },
  },
  // Baluwatar Studios temporarily hidden
}

const getLocationGalleryImages = (locationId: string) => {
  const galleries: Record<
    string,
    Array<{
      id: number
      src: string
      alt: string
      title: string
      span?: string
    }>
  > = {
    'dhobighat-hub': [
      {
        id: 1,
        src: '/images/locations/dhobighat-hub/dhobighat-dining-area.webp',
        alt: 'Dhobighat dining area',
        title: 'Dining Area',
        span: 'col-span-1',
      },
      {
        id: 2,
        src: '/images/locations/dhobighat-hub/dhobighat-productivity-space.webp',
        alt: 'Boost Your Productivity',
        title: 'Boost Your Productivity',
        span: 'sm:col-span-2',
      },
      {
        id: 3,
        src: '/images/locations/dhobighat-hub/dhobighat-office-back-view.webp',
        alt: 'Dhobighat office back view',
        title: 'Office Back View',
        span: 'col-span-1',
      },
      {
        id: 4,
        src: '/images/locations/dhobighat-hub/dhobighat-espresso-bar.webp',
        alt: 'Dhobighat espresso bar',
        title: 'Espresso Bar',
        span: 'col-span-1',
      },
      {
        id: 5,
        src: '/images/locations/dhobighat-hub/dhobighat-kitchen.webp',
        alt: 'Dhobighat kitchen',
        title: 'Kitchen',
        span: 'col-span-1',
      },
      {
        id: 6,
        src: '/images/locations/dhobighat-hub/creatrixspace-coworking-area-1.webp',
        alt: 'Dhobighat coworking area',
        title: 'Coworking Area',
        span: 'sm:col-span-2',
      },
      {
        id: 7,
        src: '/images/locations/dhobighat-hub/dhobighat-office-front-entrance.webp',
        alt: 'Dhobighat office front entrance',
        title: 'Office Front Entrance',
        span: 'col-span-1',
      },
      {
        id: 8,
        src: '/images/locations/dhobighat-hub/dhobighat-meeting-room.webp',
        alt: 'Dhobighat meeting room',
        title: 'Meeting Room',
        span: 'col-span-1',
      },
      {
        id: 9,
        src: '/images/locations/dhobighat-hub/creatrixspace-workspace-interior-1.webp',
        alt: 'Dhobighat workspace interior',
        title: 'Workspace Interior',
        span: 'col-span-1',
      },
      {
        id: 10,
        src: '/images/locations/dhobighat-hub/dhobighat-modern-workspace-desk.webp',
        alt: 'Dhobighat modern workspace desk',
        title: 'Modern Workspace Desk',
        span: 'col-span-1',
      },
      {
        id: 11,
        src: '/images/locations/dhobighat-hub/creatrixspace-modern-workspace-1.webp',
        alt: 'Dhobighat modern workspace',
        title: 'Modern Workspace',
        span: 'sm:col-span-2',
      },
      {
        id: 12,
        src: '/images/locations/dhobighat-hub/dhobighat-professional-workspace-desk.webp',
        alt: 'Dhobighat professional workspace desk',
        title: 'Professional Workspace Desk',
        span: 'col-span-1',
      },
      {
        id: 13,
        src: '/images/locations/dhobighat-hub/creatrixspace-office-space-1.webp',
        alt: 'Dhobighat office space',
        title: 'Office Space',
        span: 'col-span-1',
      },
      {
        id: 14,
        src: '/images/locations/dhobighat-hub/dhobighat-workspace-view-1.webp',
        alt: 'Dhobighat workspace view',
        title: 'Workspace View',
        span: 'col-span-1',
      },
    ],
    kausimaa: [
      {
        id: 1,
        src: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/1-1639371534.JPG?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
        alt: 'Kausimaa interior',
        title: 'Kausimaa Interior',
        span: 'col-span-1',
      },
      {
        id: 2,
        src: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/2-1639371534.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
        alt: 'Kausimaa workspace',
        title: 'Kausimaa Workspace',
        span: 'sm:col-span-2',
      },
      {
        id: 3,
        src: 'https://coworker.imgix.net/photos/nepal/lalitpur/kausimaa/main.jpg?w=800&h=0&q=90&auto=format,compress&fit=crop&mark=/template/img/wm_icon.png&markscale=5&markalign=center,middle',
        alt: 'Kausimaa main area',
        title: 'Kausimaa Main Area',
        span: 'col-span-1',
      },
    ],
    'jhamsikhel-loft': [
      {
        id: 1,
        src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Loft space',
        title: 'Loft Space',
        span: 'col-span-1',
      },
      {
        id: 2,
        src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Rooftop terrace',
        title: 'Rooftop Terrace',
        span: 'sm:col-span-2',
      },
      {
        id: 3,
        src: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Natural lighting',
        title: 'Natural Lighting',
        span: 'col-span-1',
      },
      {
        id: 4,
        src: 'https://images.unsplash.com/photo-1487088678257-3a541e6e3922?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Outdoor seating',
        title: 'Outdoor Seating',
        span: 'col-span-1',
      },
    ],
    // Baluwatar gallery temporarily hidden
  }

  return galleries[locationId] || []
}

function mapDbLocationDetail(db: any): Location {
  const cap = db.capacity || {}
  return {
    id: db.slug || db.id,
    name: db.name,
    slug: db.slug,
    description: db.description || '',
    fullAddress: db.full_address || '',
    image: db.image_url || db.images?.[0] || '',
    images: db.images || [],
    amenities: (db.amenities as string[]) || [],
    features: (db.features as string[]) || [],
    openingHours: db.opening_hours || {},
    capacity: cap.hotDesks != null ? cap : cap.total || 0,
    rating: db.rating ? Number(db.rating) : undefined,
    available: db.available ?? true,
    status: db.status || undefined,
    popular: db.popular ?? false,
    contact: {
      phone: db.contact_phone || '',
      email: '',
    },
    googleMapsUrl: db.google_maps_url || undefined,
  }
}

function toGoogleMapsUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed || !trimmed.includes('/embed')) return trimmed
  const lat = trimmed.match(/!3d(-?\d+\.?\d*)/)?.[1]
  const lng = trimmed.match(/!2d(-?\d+\.?\d*)/)?.[1]
  if (lat && lng) return `https://www.google.com/maps?q=${lat},${lng}`
  return trimmed
}

function toAmPm(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  if (isNaN(h)) return time
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const fallback = id ? locationData[id as keyof typeof locationData] : null
  const [location, setLocation] = useState<Location | null>(fallback)
  const [loading, setLoading] = useState(!fallback)
  const [imgError, setImgError] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)

  const hardcodedGallery = id ? getLocationGalleryImages(id) : []
  const galleryImages =
    hardcodedGallery.length > 0
      ? hardcodedGallery
      : (location?.images || []).map((src, i) => ({
          id: i + 1,
          src,
          alt: `${location?.name || 'Location'} gallery ${i + 1}`,
          title: `Gallery ${i + 1}`,
        }))

  const openModal = (src: string) => setModalImage(src)
  const closeModal = () => setModalImage(null)

  const DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const
  const validDays = location
    ? Object.entries(location.openingHours).filter(([day]) =>
        (DAYS as readonly string[]).includes(day)
      )
    : []

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    locationService
      .getLocationBySlug(id)
      .then((dbLocation) => {
        if (dbLocation) setLocation(mapDbLocationDetail(dbLocation))
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="overflow-hidden">
        <section className="section-padding bg-gradient-to-br from-bg via-bg to-clay/5">
          <div className="container text-center py-24">
            <div className="animate-pulse space-y-4 max-w-xl mx-auto">
              <div className="h-8 bg-rule rounded-sm w-3/4 mx-auto" />
              <div className="h-4 bg-rule rounded-sm w-1/2 mx-auto" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="overflow-hidden">
        <section className="section-padding bg-gradient-to-br from-bg via-bg to-clay/5">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                Location Not Found
              </h1>
              <p className="text-lg text-fg-2">
                The location you're looking for doesn't exist or may have been
                moved.
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
      <section className="py-8 bg-gradient-to-br from-bg via-bg to-clay/5">
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
                      <Badge className="bg-clay text-fg-on-ink-1">
                        🔥 Most Popular
                      </Badge>
                    )}
                    {location.status === 'reserved' && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 border-orange-200"
                      >
                        🔒 Reserved
                      </Badge>
                    )}
                    {!location.available &&
                      location.status &&
                      location.status !== 'reserved' && (
                        <Badge variant="destructive">{location.status}</Badge>
                      )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-display font-bold">
                    {location.name}
                  </h1>

                  <div className="flex items-center text-fg-2">
                    <MapPin className="h-5 w-5 mr-2 shrink-0" />
                    <span className="text-lg">{location.fullAddress}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                      <span className="text-lg font-medium">
                        {location.rating}
                      </span>
                    </div>
                    <div className="flex items-center text-fg-2">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="text-lg">
                        {typeof location.capacity === 'number'
                          ? location.capacity
                          : location.capacity.hotDesks +
                            location.capacity.dedicatedDesks +
                            location.capacity.privateOffices +
                            location.capacity.meetingRooms}{' '}
                        capacity
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-fg-2 leading-relaxed">
                  {location.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {location.available ? (
                    <>
                      <Button
                        size="lg"
                        icon={Calendar}
                        text="Book Now"
                        href={ROUTES.BOOKING}
                      />
                      <Button
                        size="lg"
                        icon={Calendar}
                        text="Schedule Tour"
                        href={ROUTES.CONTACT}
                      />
                    </>
                  ) : (
                    <Button size="lg" disabled>
                      {location.status}
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg-raised">
                {location.image && !imgError ? (
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-fg-3">
                    <div className="text-center">
                      <MapPin size={48} className="mx-auto mb-2 opacity-30" />
                      <span className="text-sm">{location.name}</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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
              <h2 className="text-3xl font-display font-normal">Features</h2>
              <div className="grid grid-cols-2 gap-3">
                {location.features?.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center space-x-3 p-4 bg-bg-band/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-clay rounded-full flex-shrink-0" />
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
              <h2 className="text-3xl font-display font-normal">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {location.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-3 p-4 bg-bg-band/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-clay rounded-full flex-shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opening Hours & Contact */}
      <section className="section-padding bg-bg-band/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {validDays.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-display font-normal">
                  Opening Hours
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {validDays.map(([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center py-2 border-b border-rule/50 last:border-b-0"
                        >
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-fg-2">
                            {toAmPm(hours.open)} - {toAmPm(hours.close)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-normal">
                Contact Information
              </h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-clay/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-clay" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-fg-2">{location.contact?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-clay/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-clay" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      {(() => {
                        const digits = (location.contact?.phone || '').replace(
                          /\D/g,
                          ''
                        )
                        const waNumber = digits
                          ? digits.startsWith('977')
                            ? digits
                            : `977${digits}`
                          : null
                        return waNumber ? (
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-clay hover:underline"
                          >
                            {location.contact?.phone}
                          </a>
                        ) : (
                          <span className="text-fg-2">
                            {location.contact?.phone || 'Not available'}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                  {location.googleMapsUrl && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-clay/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-clay" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <a
                          href={toGoogleMapsUrl(location.googleMapsUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-clay hover:underline flex items-center space-x-1"
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
        <section className="section-padding bg-clay text-fg-on-ink-1">
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
              <p className="text-lg text-fg-on-ink-1/80">
                Join our community of professionals and discover the perfect
                workspace for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  icon={Calendar}
                  text="Book Your Space"
                  href={ROUTES.BOOKING}
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-clay backdrop-blur-sm"
                  icon={Calendar}
                  text="Schedule a Tour"
                  href={ROUTES.CONTACT}
                />
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
