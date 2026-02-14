import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { useHotDeskPricing } from '@/features/home/hooks/use-hot-desk-pricing'

const planConfigs = [
  {
    key: 'daily',
    name: 'Hot Desk — Daily',
    description: 'Best for trying us out',
    period: 'day' as const,
    features: [
      'Hot desk access (day pass)',
      'High-speed WiFi',
      'Coffee & tea',
      'Basic printing (10 pages)',
      'Community events access'
    ],
    popular: false,
  },
  {
    key: 'weekly',
    name: 'Hot Desk — Weekly',
    description: 'Best value for regulars',
    period: 'week' as const,
    features: [
      'Hot desk access (weekly)',
      'High-speed WiFi',
      'Coffee & tea',
      'Community events access',
      'Flexible seating',
    ],
    popular: false,
  },
  {
    key: 'monthly',
    name: 'Hot Desk — Monthly',
    description: 'Most popular (hot desk)',
    period: 'month' as const,
    features: [
      'Unlimited hot desk access',
      'High-speed WiFi',
      'Coffee & tea',
      'Community events access',
      'Priority seating options',
    ],
    popular: true,
  },
]

export function PricingPreview() {
  const { daily, weekly, monthly, loading, formatted } = useHotDeskPricing()

  const getPrice = (period: 'day' | 'week' | 'month') => {
    const val = period === 'day' ? daily : period === 'week' ? weekly : monthly
    return val ?? 0
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/30 to-purple-50 dark:from-background dark:via-primary/5 dark:to-primary/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Hot Desk
            <span className="gradient-text"> Membership</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Private offices are fully booked right now — hot desks are available.
            Choose a plan that fits your schedule.
          </p>

          <div className="flex justify-center mt-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-200">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Membership from ${formatted.badge}`
              )}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {planConfigs.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-primary scale-105' : ''
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
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>

                  <div className="pt-4">
                    <div className="flex items-baseline justify-center">
                      {loading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <span className="text-3xl font-bold">
                            {formatCurrency(getPrice(plan.period), 'NPR')}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            /{plan.period}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to={ROUTES.BOOKING}>
                      Book Hot Desk
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="mt-10 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border bg-background/70 dark:bg-background/40 backdrop-blur p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="space-y-1">
              <p className="font-semibold">Need a private office?</p>
              <p className="text-sm text-muted-foreground">
                All private offices are currently fully booked. Join the waitlist and we'll notify you when one opens up.
              </p>
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" asChild>
                <Link to={ROUTES.CONTACT}>Join Private Office Waitlist</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link to={ROUTES.PRICING}>
              View All Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
