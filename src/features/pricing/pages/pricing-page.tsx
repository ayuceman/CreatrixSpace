import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    id: 'day-pass',
    name: 'Day Pass',
    description: 'Perfect for trying us out',
    icon: Zap,
    pricing: {
      daily: 80000, // NPR 800
    },
    features: [
      'Hot desk access for 1 day',
      'High-speed internet',
      'Coffee & tea',
      'Basic printing (5 pages)',
      'Access to common areas',
    ],
    limitations: [
      'No meeting room access',
      'No locker access',
      'Limited to business hours',
    ],
    popular: false,
    cta: 'Get Day Pass',
  },
  {
    id: 'hot-desk',
    name: 'Hot Desk',
    description: 'Flexible workspace solution',
    icon: Star,
    pricing: {
      monthly: 1200000, // NPR 12,000 (equivalent to 15 days - good value)
      annual: 12960000, // NPR 129,600 (10% discount)
    },
    features: [
      'Hot desk access',
      'High-speed internet',
      'Meeting room credits (2 hours/month)',
      'All amenities included',
      'Community events access',
      'Locker access',
      'Phone booth access',
      'Printing credits (50 pages/month)',
    ],
    limitations: [],
    popular: true,
    cta: 'Start Hot Desking',
  },
  {
    id: 'dedicated-desk',
    name: 'Dedicated Desk',
    description: 'Your personal workspace',
    icon: Crown,
    pricing: {
      monthly: 2200000, // NPR 22,000
      annual: 23760000, // NPR 237,600 (10% discount)
    },
    features: [
      'Your own dedicated desk',
      'Personal storage drawer',
      'High-speed internet',
      'Meeting room credits (5 hours/month)',
      'All amenities included',
      '24/7 access',
      'Mail handling service',
      'Locker included',
      'Priority booking',
      'Printing credits (100 pages/month)',
    ],
    limitations: [],
    popular: false,
    cta: 'Reserve Your Desk',
  },
  {
    id: 'private-office',
    name: 'Private Office',
    description: 'Ultimate privacy and productivity',
    icon: Crown,
    pricing: {
      monthly: 6500000, // NPR 65,000
      annual: 70200000, // NPR 702,000 (10% discount)
    },
    features: [
      'Private locked office',
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
    price: 150000, // NPR 1,500/hour
    description: 'Additional meeting room access',
  },
  {
    name: 'Guest Day Passes',
    price: 60000, // NPR 600/day (25% discount from regular day pass)
    description: 'Bring colleagues for a day',
  },
  {
    name: 'Virtual Office Address',
    price: 800000, // NPR 8,000/month
    description: 'Use our address for your business',
  },
  {
    name: 'Phone Line',
    price: 500000, // NPR 5,000/month
    description: 'Dedicated phone number',
  },
]

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

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
                <Badge variant="secondary" className="ml-2">Save 10%</Badge>
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
              const period = billingPeriod === 'annual' ? 'year' : billingPeriod === 'monthly' ? 'month' : 'day'
              
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
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold">
                            {formatCurrency(price || 0, 'NPR')}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            /{period}
                          </span>
                        </div>
                        {billingPeriod === 'annual' && plan.pricing.annual && (
                          <p className="text-xs text-green-600 mt-1">
                            Save {formatCurrency((plan.pricing.monthly * 12) - plan.pricing.annual, 'NPR')} per year
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
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to={ROUTES.CONTACT}>Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
