import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Calendar,
  ExternalLink,
  Loader2,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES, WHATSAPP, CONTACT } from '@/lib/constants'
import { locationService } from '@/services/supabase-service'
import { FAQSection } from '@/features/home/components/faq-section'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: CONTACT.PHONE,
    description: 'Call us for immediate assistance',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: WHATSAPP.DISPLAY,
    description: 'Message us anytime on WhatsApp',
  },
  {
    icon: MapPin,
    title: 'Head Office',
    content: 'Dhobighat Chowk, Kathmandu',
    description: 'Visit our main location',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    content: 'Mon-Fri: 8:00 AM - 8:00 PM',
    description: 'Sat-Sun: 9:00 AM - 6:00 PM',
  },
]

type LocationCard = {
  name: string
  fullAddress: string
  phone: string
  email: string
  hours: string
  status: string
  googleMapsUrl?: string
}

const fallbackLocations: LocationCard[] = [
  {
    name: 'Dhobighat (WashingTown) Hub',
    fullAddress: 'Dhobighat Chowk, Kathmandu 44600',
    phone: '+977 9851357889',
    email: 'dhobighat@creatrixspace.com',
    hours: '24/7 Access',
    status: 'Available',
    googleMapsUrl: 'https://maps.app.goo.gl/88JRCRwL5ttdaPpu6',
  },
  {
    name: 'Kausimaa Co-working',
    fullAddress: 'Jwagal/Kupondole, Lalitpur',
    phone: '9823900033',
    email: '',
    hours: 'Mon-Sun: 10:00 AM - 6:00 PM',
    status: 'Available',
  },
  {
    name: 'Jhamsikhel Loft',
    fullAddress: 'Jhamsikhel, Lalitpur 44600',
    phone: '+977 9803171819',
    email: 'jhamsikhel@creatrixspace.com',
    hours: 'Mon-Fri: 7:00 AM - 9:00 PM',
    status: 'Reserved',
  },
]

export function ContactPage() {
  const [isFormReady, setIsFormReady] = useState(false)
  const [formError, setFormError] = useState(false)
  const [locations, setLocations] = useState<LocationCard[]>(fallbackLocations)

  const getWhatsAppLink = (rawPhone: string) => {
    const digits = (rawPhone || '').replace(/\D/g, '')
    if (!digits) return undefined
    const withCountry = digits.startsWith('977') ? digits : `977${digits}`
    return `https://wa.me/${withCountry}`
  }

  useEffect(() => {
    locationService.getAllLocations().then((data) => {
      if (data && data.length > 0) {
        const mapped = data
          .filter((loc: any) => loc.available !== false)
          .map((loc: any) => ({
            name: loc.name,
            fullAddress: loc.full_address || '',
            phone: loc.contact_phone || '',
            email: loc.contact_email || '',
            hours: '',
            status: loc.status || 'Available',
            googleMapsUrl: loc.google_maps_url || undefined,
          }))
        if (mapped.length > 0) setLocations(mapped)
      }
    })
  }, [])

  useEffect(() => {
    const src = 'https://js.hsforms.net/forms/v2.js'
    const targetId = 'hubspot-contact-form'
    let readyTimeout: number | undefined

    const createHubspotForm = () => {
      const hbspt = (window as any)?.hbspt
      if (!hbspt?.forms?.create) return false

      const target = document.getElementById(targetId)
      if (!target) return false

      target.innerHTML = ''

      hbspt.forms.create({
        region: 'na1',
        portalId: '44777363',
        formId: '29e4175e-1983-4c51-9887-74bd94d8c42d',
        target: `#${targetId}`,
        onFormReady: () => {
          if (readyTimeout) window.clearTimeout(readyTimeout)
          setIsFormReady(true)
          setFormError(false)
        },
      })

      if (readyTimeout) window.clearTimeout(readyTimeout)
      readyTimeout = window.setTimeout(() => setFormError(true), 15000)
      return true
    }

    const existing = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null

    let attempts = 0
    const maxAttempts = 100
    const interval = window.setInterval(() => {
      attempts += 1
      if (createHubspotForm()) {
        setIsFormReady(true)
        window.clearInterval(interval)
      } else if (attempts >= maxAttempts) {
        setFormError(true)
        window.clearInterval(interval)
      }
    }, 200)

    if (!existing) {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onerror = () => setFormError(true)
      script.onload = () => {
        if (createHubspotForm()) setIsFormReady(true)
      }
      document.body.appendChild(script)
    }

    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-bg via-bg to-clay/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <div className="eyebrow text-clay">
              <MessageCircle className="h-4 w-4 inline mr-1.5" />
              We respond within 24 hours
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal">
              Let's <span className="text-clay italic">Connect</span>
            </h1>
            <p className="text-lg text-fg-2">
              Have questions about our coworking spaces? We're here to help!
              Reach out to us and we'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-bg">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="text-center h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 bg-clay/10 rounded-lg flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-clay" />
                      </div>
                      <h3 className="font-normal text-lg">{info.title}</h3>
                      <p className="font-medium text-clay">{info.content}</p>
                      <p className="text-sm text-fg-2">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Locations */}
      <section className="section-padding bg-bg-band/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-full rounded-2xl border border-clay/20 dark:border-clay/40 bg-bg shadow-lg overflow-hidden">
                <div className="bg-clay p-6 text-fg-on-ink-1">
                  <h2 className="text-2xl font-normal text-fg-on-ink-1 flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Send us a Message
                  </h2>
                  <p className="text-fg-on-ink-1/80 text-sm mt-2">
                    We'll respond within 24 hours
                  </p>
                </div>
                <div className="p-6">
                  {!isFormReady && !formError && (
                    <div className="flex items-center gap-3 text-sm text-fg-2 mb-4 p-4 bg-clay/5 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-clay" />
                      Loading form…
                    </div>
                  )}

                  {formError && !isFormReady && (
                    <div className="text-sm text-fg-2 mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      The form couldn't load (often blocked by
                      ad‑blockers/privacy settings). Please use WhatsApp or call
                      us above, or try disabling blockers and refresh.
                    </div>
                  )}

                  <div
                    id="hubspot-contact-form"
                    className="min-h-[420px] [&_.hs-form-header]:hidden"
                  />
                </div>
              </div>
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-normal">
                Our Locations
              </h2>
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-normal text-lg">
                              {location.name}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                location.status === 'Available'
                                  ? 'bg-green-100 text-green-800'
                                  : location.status === 'Reserved'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {location.status}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-fg-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 shrink-0" />
                              <span>{location.fullAddress}</span>
                            </div>
                            {location.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 shrink-0" />
                                <span>{location.phone}</span>
                              </div>
                            )}
                            {location.phone && (
                              <div className="flex items-center">
                                <MessageCircle className="h-4 w-4 mr-2 shrink-0" />
                                <a
                                  href={getWhatsAppLink(location.phone)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-clay hover:underline"
                                >
                                  WhatsApp
                                </a>
                              </div>
                            )}
                            {location.hours && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 shrink-0" />
                                <span>{location.hours}</span>
                              </div>
                            )}
                            {location.googleMapsUrl && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                                <a
                                  href={location.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-clay hover:underline flex items-center space-x-1"
                                >
                                  <span>View on Google Maps</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* CTA Section */}
      <section className="section-padding bg-ink text-fg-on-ink-1">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-normal text-fg-on-ink-1">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-fg-on-ink-1/80">
              Book a tour today and experience the perfect workspace for your
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-ink hover:bg-white/90"
                asChild
              >
                <a href={ROUTES.BOOKING}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Tour
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink border-2"
                asChild
              >
                <a href={`tel:${CONTACT.PHONE_HREF}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
