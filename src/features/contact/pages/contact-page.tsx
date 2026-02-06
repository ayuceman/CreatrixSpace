import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle, Calendar, ExternalLink, Loader2, Mail, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '+977 9851357889 / 9700045256',
    description: 'Call us for immediate assistance'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: '+977 9803171819',
    description: 'Message us anytime on WhatsApp'
  },
  {
    icon: MapPin,
    title: 'Head Office',
    content: 'Dhobighat Chowk, Kathmandu',
    description: 'Visit our main location'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    content: 'Mon-Fri: 8:00 AM - 8:00 PM',
    description: 'Sat-Sun: 9:00 AM - 6:00 PM'
  }
]

const locations = [
  {
    name: 'Dhobighat (WashingTown) Hub',
    address: 'Dhobighat Chowk, Kathmandu 44600',
    phone: '+977 9851357889',
    email: 'dhobighat@creatrixspace.com',
    hours: '24/7 Access',
    status: 'Available',
    googleMapsUrl: 'https://maps.app.goo.gl/88JRCRwL5ttdaPpu6'
  },
  {
    name: 'Kausimaa Co-working',
    address: 'Jwagal/Kupondole, Lalitpur',
    phone: '9823900033',
    email: '',
    hours: 'Mon-Sun: 10:00 AM - 6:00 PM',
    status: 'Available'
  },
  {
    name: 'Jhamsikhel Loft',
    address: 'Jhamsikhel, Lalitpur 44600',
    phone: '+977 9803171819',
    email: 'jhamsikhel@creatrixspace.com',
    hours: 'Mon-Fri: 7:00 AM - 9:00 PM',
    status: 'Reserved'
  },
]

const faqs = [
  {
    question: "How do I book a workspace?",
    answer: "You can book a workspace through our online booking system. Simply select your preferred location, choose your plan, and complete the booking process."
  },
  {
    question: "What amenities are included?",
    answer: "All our locations include high-speed WiFi, coffee & tea, printing services, meeting rooms, and access to our community events."
  },
  {
    question: "Can I cancel my membership?",
    answer: "Yes, you can cancel your membership at any time with 30 days notice. No long-term commitments required."
  },
  {
    question: "Do you offer day passes?",
    answer: "Yes, we offer flexible day passes starting from NPR 800 per day. Perfect for trying out our spaces."
  }
]

export function ContactPage() {
  const [isFormReady, setIsFormReady] = useState(false)
  const [formError, setFormError] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const getWhatsAppLink = (rawPhone: string) => {
    const digits = (rawPhone || '').replace(/\D/g, '')
    if (!digits) return undefined
    const withCountry = digits.startsWith('977') ? digits : `977${digits}`
    return `https://wa.me/${withCountry}`
  }

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

    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null

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
    } else {
      if (createHubspotForm()) setIsFormReady(true)
    }

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 dark:from-background dark:via-background dark:to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
              <MessageCircle className="h-4 w-4" />
              We respond within 24 hours
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
              Let's <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Connect</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-muted-foreground">
              Have questions about our coworking spaces? Our team is here to help you find the perfect workspace solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-20 bg-white dark:bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              const isClickable = info.title === 'Phone' || info.title === 'WhatsApp'
              const href = info.title === 'Phone' 
                ? `tel:+9779851357889` 
                : info.title === 'WhatsApp' 
                ? `https://wa.me/9779803171819` 
                : undefined
              
              const CardWrapper = isClickable ? 'a' : 'div'
              const cardProps = isClickable ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}
              
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <CardWrapper 
                    {...cardProps}
                    className={`block h-full ${isClickable ? 'group cursor-pointer' : ''}`}
                  >
                    <div className={`h-full p-6 rounded-2xl border transition-all ${
                      isClickable 
                        ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-purple-200 dark:border-purple-900/50 hover:shadow-lg hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-700' 
                        : 'bg-white dark:bg-background border-gray-200 dark:border-gray-800'
                    }`}>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform ${
                          isClickable 
                            ? 'bg-gradient-to-br from-purple-500 to-purple-700 group-hover:scale-110' 
                            : 'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          <Icon className={`h-6 w-6 ${isClickable ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">{info.title}</h3>
                          <p className={`font-bold text-base ${isClickable ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-white'}`}>
                            {info.content}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Locations */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-background dark:via-primary/5 dark:to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-full rounded-3xl border-2 border-purple-200 dark:border-purple-900/50 bg-white dark:bg-background shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Send us a Message
                  </h2>
                  <p className="text-purple-100 text-sm mt-2">We'll respond within 24 hours</p>
                </div>
                <div className="p-6">
                  {!isFormReady && !formError && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      Loading form…
                    </div>
                  )}

                  {formError && !isFormReady && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      The form couldn't load (often blocked by ad‑blockers/privacy settings). Please use WhatsApp or call us above, or try disabling blockers and refresh.
                    </div>
                  )}

                  <div id="hubspot-contact-form" className="min-h-[420px]" />
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
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
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
                    <div className="p-6 rounded-2xl border-2 border-purple-100 dark:border-purple-900/50 bg-white dark:bg-background hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400">{location.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                            location.status === 'Available' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {location.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2.5 text-sm">
                          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span>{location.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <a href={`tel:${location.phone}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                              {location.phone}
                            </a>
                          </div>
                          {location.phone && (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                              <a
                                href={getWhatsAppLink(location.phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                              >
                                Chat on WhatsApp
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span>{location.hours}</span>
                          </div>
                          {location.googleMapsUrl && (
                            <div className="pt-2">
                              <a 
                                href={location.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                              >
                                <MapPin className="h-4 w-4" />
                                View on Google Maps
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Accordion Style */}
      <section className="py-16 md:py-20 bg-white dark:bg-background">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground">
              Quick answers to common questions about our coworking spaces.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-purple-100 dark:border-purple-900/50 bg-white dark:bg-background hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                    <ChevronDown className={`h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 dark:text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 lg:py-28 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-purple-100">
              Book a tour today and experience the perfect workspace for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50" asChild>
                <a href={ROUTES.BOOKING}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Tour
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-purple-700" asChild>
                <a href="tel:+9779851357889">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
