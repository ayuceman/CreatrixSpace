import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '+977 9851357889',
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
    googleMapsUrl: 'https://maps.app.goo.gl/Pw4KLyfjaj2Wdrsw9?g_st=ipc'
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
  const getWhatsAppLink = (rawPhone: string) => {
    const digits = (rawPhone || '').replace(/\D/g, '')
    if (!digits) return undefined
    const withCountry = digits.startsWith('977') ? digits : `977${digits}`
    return `https://wa.me/${withCountry}`
  }

  useEffect(() => {
    const src = 'https://js.hsforms.net/forms/embed/44777363.js'
    const existing = document.querySelector(`script[src="${src}"]`)
    if (!existing) {
      const script = document.createElement('script')
      script.src = src
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our coworking spaces? We're here to help! 
              Reach out to us and we'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{info.title}</h3>
                      <p className="font-medium text-primary">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Locations */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div
                      className="hs-form-frame"
                      data-region="na1"
                      data-form-id="29e4175e-1983-4c51-9887-74bd94d8c42d"
                      data-portal-id="44777363"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-bold">Our Locations</h2>
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
                            <h3 className="font-semibold text-lg">{location.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              location.status === 'Available' 
                                ? 'bg-green-100 text-green-800' 
                                : location.status === 'Reserved'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {location.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{location.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{location.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {location.phone ? (
                                <a
                                  href={getWhatsAppLink(location.phone)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  WhatsApp
                                </a>
                              ) : (
                                <span>WhatsApp</span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{location.hours}</span>
                            </div>
                            {location.googleMapsUrl && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <a 
                                  href={location.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center space-x-1"
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

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions about our coworking spaces.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Book a tour today and experience the perfect workspace for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href={ROUTES.BOOKING}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book a Tour
                </a>
              </Button>
              <Button size="lg" variant="secondary" className="border-primary-foreground/20  hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="tel:+9779851357889">
                  <Phone className="mr-2 h-4 w-4" />
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