import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Perfect for trying us out',
    icon: Zap,
    pricing: {
      daily: 50000, // NPR 500 per day (promotional price)
      originalDaily: 100000, // NPR 1000 original price
    },
    features: [
      'Day pass access to all locations',
      'High-speed WiFi',
      'Coffee & tea',
      'Basic printing (10 pages)',
      'Lounge area access',
      'Community events access',
    ],
    limitations: [
      'No meeting room access',
      'No storage space',
      'Limited support hours',
    ],
    popular: false,
    cta: 'Get Day Pass',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Most popular choice',
    icon: Star,
    pricing: {
      weekly: 220000, // NPR 2,200/week
      monthly: 950000, // NPR 9,500/month
      annual: 6000000, // NPR 60,000/year (~37% savings)
    },
    features: [
      'Unlimited access to all locations',
      'Hot desk workstation',
      '8 hours meeting room per month',
      'Premium printing (100 pages)',
      'Coffee, tea & snacks',
      'Personal storage locker',
      'Priority community events',
      '24/7 access',
      'Priority support',
    ],
    limitations: [],
    popular: true,
    cta: 'Start Professional',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and businesses',
    icon: Crown,
    pricing: {
      weekly: 320000, // NPR 3,200/week
      monthly: 1150000, // NPR 11,500/month
      annual: 10800000, // NPR 108,000/year (~22% savings)
    },
    features: [
      'Dedicated desk at your chosen location',
      'Unlimited meeting room access',
      'Private phone booth priority',
      'Unlimited printing',
      'Personal storage cabinet',
      'Guest day passes (5/month)',
      'Exclusive networking events',
      'Priority booking system',
      'Dedicated account manager',
      'Custom billing options',
    ],
    limitations: [],
    popular: false,
    cta: 'Go Enterprise',
  },
  {
    id: 'private-office',
    name: 'Private Office',
    description: 'Ultimate privacy and productivity',
    icon: Crown,
    pricing: {
      weekly: 680000, // NPR 6,800/week
      monthly: 2500000, // NPR 25,000/month (offer price)
      originalMonthly: 3500000, // NPR 35,000/month (actual price)
      annual: 30000000, // NPR 300,000/year
    },
    features: [
      'Private locked office (2-4 people)',
      'Furniture included',
      'High-speed internet',
      'Unlimited meeting room access',
      'All amenities included',
      '24/7 access',
      'Mail handling service',
      'Cleaning service',
      'Phone line included',
      'Unlimited printing',
      'Company signage',
    ],
    limitations: [],
    popular: false,
    cta: 'Book Private Office',
  },
]

const addOns = [
  {
    name: 'Extra Meeting Room Hours',
    price: 80000, // NPR 800/hour
    description: 'Additional meeting room access',
  },
  {
    name: 'Guest Day Passes',
    price: 30000, // NPR 300/day (promotional price)
    description: 'Bring colleagues for a day',
  },
  {
    name: 'Virtual Office Address',
    price: 600000, // NPR 6,000/month (25% reduction)
    description: 'Use our address for your business',
  },
  {
    name: 'Phone Line',
    price: 400000, // NPR 4,000/month (20% reduction)
    description: 'Dedicated phone number',
  },
]

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'weekly' | 'monthly' | 'annual'>('monthly')

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
              Simple, Transparent
              <span className="gradient-text block">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your needs. All plans include our core amenities 
              and access to our vibrant community of professionals.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 bg-muted rounded-lg p-1 w-fit mx-auto">
              <button
                onClick={() => setBillingPeriod('weekly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'weekly'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'annual'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual
                <Badge variant="secondary" className="ml-2">Save up to 23%</Badge>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const price = plan.pricing[billingPeriod] || plan.pricing.daily
              const period = plan.id === 'explorer' 
                ? 'day' 
                : billingPeriod === 'annual' 
                  ? 'year' 
                  : billingPeriod === 'weekly' 
                    ? 'week' 
                    : 'month'
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    plan.popular ? 'ring-2 ring-primary scale-105' : ''
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      
                      <div className="pt-4">
                        {plan.id === 'private-office' && (
                          <p className="text-sm text-muted-foreground text-center mb-1">
                            Starting from
                          </p>
                        )}
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold">
                            {formatCurrency(price || 0, 'NPR')}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            /{period}
                          </span>
                        </div>
                        {plan.id === 'explorer' && plan.pricing.originalDaily && (
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(plan.pricing.originalDaily, 'NPR')}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              Save {formatCurrency(plan.pricing.originalDaily - (price || 0), 'NPR')}
                            </Badge>
                          </div>
                        )}
                        {plan.id === 'private-office' && plan.pricing.originalMonthly && billingPeriod === 'monthly' && (
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(plan.pricing.originalMonthly, 'NPR')}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              Save {formatCurrency(plan.pricing.originalMonthly - (price || 0), 'NPR')}
                            </Badge>
                          </div>
                        )}
                        {plan.id === 'explorer' && (
                          <p className="text-xs text-amber-600 mt-1">
                            Promotional price — limited time only
                          </p>
                        )}
                        {plan.id === 'private-office' && billingPeriod === 'monthly' && (
                          <p className="text-xs text-amber-600 mt-1">
                            Special offer — limited time only
                          </p>
                        )}
                        {billingPeriod === 'annual' && plan.pricing.annual && plan.pricing.monthly && (
                          <p className="text-xs text-green-600 mt-1">
                            Save {formatCurrency((plan.pricing.monthly * 12) - plan.pricing.annual, 'NPR')} per year
                          </p>
                        )}
                        {billingPeriod === 'weekly' && plan.pricing.weekly && plan.pricing.monthly && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Monthly: {formatCurrency(plan.pricing.monthly, 'NPR')}
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.id === 'private-office' ? (
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 space-y-3">
                            <p className="text-sm font-semibold text-center">Enquire Now for Private Office</p>
                            <div className="flex flex-col gap-2">
                              <a
                                href="https://wa.me/9779803171819?text=Hi!%20I'm%20interested%20in%20the%20Private%20Office%20plan."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                              >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp: +977 9803171819
                              </a>
                              <a
                                href="tel:+9779851357889"
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                              >
                                <Phone className="h-4 w-4" />
                                Call: +977 9851357889
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button 
                            className="w-full" 
                            variant={plan.popular ? 'default' : 'outline'}
                            asChild
                          >
                            <Link to={`${ROUTES.BOOKING}?plan=${plan.id}`}>
                              {plan.cta}
                            </Link>
                          </Button>

                          <p className="text-xs text-muted-foreground text-center">
                            No setup fees • Cancel anytime
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Optional Add-ons
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your workspace experience with our additional services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">{addon.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(addon.price, 'NPR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addon.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container max-w-3xl mx-auto">
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
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
              },
              {
                question: "Is there a minimum commitment?",
                answer: "No minimum commitment required. You can cancel your membership at any time with 30 days notice."
              },
              {
                question: "What's included in meeting room credits?",
                answer: "Meeting room credits allow you to book our conference rooms. Each credit represents one hour of room usage during business hours."
              },
              {
                question: "Can I use multiple locations?",
                answer: "Yes, all plans include access to any of our locations across Kathmandu. Just book your preferred spot through our app."
              },
              {
                question: "What happens if I exceed my printing allowance?",
                answer: "Additional printing is charged at NPR 2 per page for black & white and NPR 5 per page for color printing."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join hundreds of professionals who have made CreatrixSpace their workspace of choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to={ROUTES.BOOKING}>Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm" asChild>
                <Link to={ROUTES.CONTACT}>Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
