import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  Star,
  Zap,
  Crown,
  Phone,
  MessageCircle,
  Loader2,
  Globe2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/lib/database.types'
import {
  locationService,
  planService,
  locationPricingService,
} from '@/services/supabase-service'
import { useVirtualOfficeAddon } from '@/features/home/hooks/use-virtual-office-addon'

type LocationRow = Database['public']['Tables']['locations']['Row']
type LocationPlanPricingRow =
  Database['public']['Tables']['location_plan_pricing']['Row']
type PlanPricing = {
  daily?: number
  weekly?: number
  monthly?: number
  annual?: number
  originalDaily?: number
  originalMonthly?: number
}
type LocationPricingMap = Record<string, Record<string, PlanPricing>>
type BillingPeriod = 'weekly' | 'monthly' | 'annual'

const buildLocationPricingMap = (
  rows: LocationPlanPricingRow[]
): LocationPricingMap =>
  rows.reduce<LocationPricingMap>((acc, row) => {
    if (!acc[row.location_id]) {
      acc[row.location_id] = {}
    }
    acc[row.location_id][row.plan_id] = row.pricing as PlanPricing
    return acc
  }, {})

const plans = [
  {
    id: 'explorer',
    supabaseName: 'Explorer',
    planType: 'day_pass' as const,
    name: 'Explorer',
    description: 'Perfect for trying us out',
    icon: Zap,
    pricing: {
      daily: 50000, // NPR 500 per day (actual price)
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
    supabaseName: 'Professional',
    planType: 'hot_desk' as const,
    name: 'Professional',
    description: 'Most popular choice',
    icon: Star,
    pricing: {
      weekly: 199900, // NPR 1,999/week
      monthly: 899900, // NPR 8,999/month
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
    supabaseName: 'Enterprise',
    planType: 'dedicated_desk' as const,
    name: 'Enterprise',
    description: 'For teams and businesses',
    icon: Crown,
    pricing: {
      weekly: 299900, // NPR 2,999/week
      monthly: 1099900, // NPR 10,999/month
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
    supabaseName: 'Private Office',
    planType: 'private_office' as const,
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
      'Private locked office (4-6 people)',
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
    name: 'Phone Line',
    price: 400000, // NPR 4,000/month (20% reduction)
    description: 'Dedicated phone number',
  },
]

type PlanMetadata = {
  id: string
  pricing: PlanPricing
  type: string
  popular?: boolean
}

function VirtualOfficeProductSection() {
  const { pricePaisa, name, description, loading } = useVirtualOfficeAddon()

  return (
    <div
      id="virtual-office"
      className="mb-14 scroll-mt-24 rounded-3xl border border-emerald-500/35 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-10 text-slate-100 shadow-2xl shadow-emerald-950/30 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/40">
            <Sparkles className="h-3 w-3 mr-1" />
            Distinct from coworking & private office
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
            Virtual office package
          </h2>
          <p className="text-slate-400 max-w-xl leading-relaxed">
            Ideal if you need a credible Kathmandu business address and mail
            service without a physical desk or private room. This is a{' '}
            <span className="text-emerald-300/95 font-medium">
              registration & presence
            </span>{' '}
            product — not a hot desk or private suite.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-300">
            {[
              'Business address for company registration',
              'Mail & package receiving',
              'Professional image for clients & partners',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-xl bg-emerald-500/20 p-2.5">
              <Globe2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{name}</p>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-slate-700/80">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                From
              </p>
              {loading ? (
                <Loader2 className="h-7 w-7 animate-spin text-emerald-400 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-white tabular-nums mt-1">
                  {formatCurrency(pricePaisa, 'NPR')}
                  <span className="text-sm font-normal text-slate-400">
                    /month
                  </span>
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
              >
                <a
                  href="https://wa.me/9779803171819?text=Hi!%20I'm%20interested%20in%20the%20Virtual%20Office%20package."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enquire on WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-600 text-slate-100 hover:bg-slate-800"
              >
                <a href="tel:+9779700045256">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string>('')
  const [locationPricing, setLocationPricing] = useState<LocationPricingMap>({})
  const [planMetadata, setPlanMetadata] = useState<
    Record<string, PlanMetadata>
  >({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadPricingData() {
      setLoading(true)
      setError(null)
      try {
        const [locationRows, planRows, locationPricingRows] = await Promise.all(
          [
            locationService.getAllLocations(),
            planService.getAllPlans(),
            locationPricingService.getAllLocationPricing(),
          ]
        )

        if (ignore) return

        const availableLocations = locationRows.filter((loc) => loc.available)
        setLocations(availableLocations)
        setLocationPricing(buildLocationPricingMap(locationPricingRows))

        const metadata = planRows.reduce<Record<string, PlanMetadata>>(
          (acc, plan) => {
            acc[plan.name] = {
              id: plan.id,
              pricing: (plan.pricing as PlanPricing) || {},
              type: plan.type,
              popular: plan.popular,
            }
            return acc
          },
          {}
        )
        setPlanMetadata(metadata)
      } catch (err) {
        if (ignore) return
        console.error(err)
        setError('Failed to load pricing data. Please refresh the page.')
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadPricingData()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      setSelectedLocationId(locations[0].id)
    }
  }, [locations, selectedLocationId])

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId),
    [locations, selectedLocationId]
  )

  const getPlanPricingForCard = useCallback(
    (planConfig: (typeof plans)[number]): PlanPricing => {
      const metadata = planMetadata[planConfig.supabaseName]
      const basePricing = planConfig.pricing

      // Ensure public pricing stays consistent even if Supabase pricing is stale.
      const applyOverrides = (pricing: PlanPricing): PlanPricing => {
        if (planConfig.id === 'explorer') {
          return { ...pricing, daily: 50000 }
        }
        return pricing
      }

      if (!metadata) {
        return applyOverrides(basePricing)
      }

      if (selectedLocationId) {
        const locationSpecific =
          locationPricing[selectedLocationId]?.[metadata.id]
        if (locationSpecific) {
          return applyOverrides(locationSpecific)
        }
      }

      return applyOverrides((metadata.pricing as PlanPricing) || basePricing)
    },
    [planMetadata, locationPricing, selectedLocationId]
  )

  const getPlanIdForCard = useCallback(
    (planConfig: (typeof plans)[number]) =>
      planMetadata[planConfig.supabaseName]?.id,
    [planMetadata]
  )

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-bg via-bg to-clay/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
              Simple, Transparent
              <span className="gradient-text block">Memberships</span>
            </h1>
            <p className="text-lg text-fg-2">
              Choose the perfect plan for your needs. All plans include our core
              amenities and access to our vibrant community of professionals.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 bg-bg-band rounded-lg p-1 w-fit mx-auto">
              <button
                onClick={() => setBillingPeriod('weekly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'weekly'
                    ? 'bg-bg shadow-sm'
                    : 'text-fg-2 hover:text-fg-1'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-bg shadow-sm'
                    : 'text-fg-2 hover:text-fg-1'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'annual'
                    ? 'bg-bg shadow-sm'
                    : 'text-fg-2 hover:text-fg-1'
                }`}
              >
                Annual
                <Badge variant="secondary" className="ml-2">
                  Save up to 23%
                </Badge>
              </button>
            </div>

            {/* Location Toggle */}
            {locations.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {locations.map((location) => (
                  <Button
                    key={location.id}
                    size="sm"
                    variant={
                      selectedLocationId === location.id ? 'default' : 'outline'
                    }
                    onClick={() => setSelectedLocationId(location.id)}
                    className="px-4"
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-8">
        <div className="container">
          <VirtualOfficeProductSection />

          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Workspace memberships
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Coworking &amp; private office
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Day passes, hot desks, dedicated desks, and private suites — all
              on-site at our locations.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-clay mb-4" />
              <p className="text-fg-2">
                Loading the latest plan and location data…
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon
                const planId = getPlanIdForCard(plan)
                const planPricing = getPlanPricingForCard(plan)
                const planType =
                  planMetadata[plan.supabaseName]?.type || plan.planType
                const isPopular =
                  plan.popular || planMetadata[plan.supabaseName]?.popular
                const priceForSelectedPeriod =
                  planType === 'day_pass'
                    ? planPricing.daily
                    : planPricing[billingPeriod]
                const fallbackPrice =
                  planType === 'day_pass'
                    ? planPricing.daily
                    : planPricing.monthly ||
                      planPricing.weekly ||
                      planPricing.annual
                const price = priceForSelectedPeriod ?? fallbackPrice ?? 0
                const period =
                  planType === 'day_pass'
                    ? 'day'
                    : priceForSelectedPeriod
                      ? billingPeriod === 'annual'
                        ? 'year'
                        : billingPeriod === 'weekly'
                          ? 'week'
                          : 'month'
                      : planPricing.monthly
                        ? 'month'
                        : planPricing.weekly
                          ? 'week'
                          : planPricing.annual
                            ? 'year'
                            : 'month'
                const missingSelectedPeriod =
                  planType !== 'day_pass' &&
                  !priceForSelectedPeriod &&
                  Boolean(fallbackPrice)

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        isPopular ? 'ring-2 ring-primary scale-105' : ''
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-clay text-fg-on-ink-1">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 w-12 h-12 bg-clay/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-clay" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <p className="text-sm text-fg-2">{plan.description}</p>

                        <div className="pt-4">
                          {plan.id === 'private-office' && (
                            <p className="text-sm text-fg-2 text-center mb-1">
                              Starting from
                            </p>
                          )}
                          <div className="flex items-baseline justify-center">
                            <span className="text-3xl font-bold">
                              {price > 0
                                ? formatCurrency(price, 'NPR')
                                : 'Contact'}
                            </span>
                            <span className="text-fg-2 ml-1">/{period}</span>
                          </div>
                          {plan.planType === 'day_pass' &&
                            (plan.pricing as PlanPricing).originalDaily && (
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <span className="text-sm text-fg-2 line-through">
                                  {formatCurrency(
                                    (plan.pricing as PlanPricing)
                                      .originalDaily!,
                                    'NPR'
                                  )}
                                </span>
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Save{' '}
                                  {formatCurrency(
                                    (plan.pricing as PlanPricing)
                                      .originalDaily! - (price || 0),
                                    'NPR'
                                  )}
                                </Badge>
                              </div>
                            )}
                          {plan.planType === 'private_office' &&
                            plan.pricing.originalMonthly &&
                            billingPeriod === 'monthly' && (
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <span className="text-sm text-fg-2 line-through">
                                  {formatCurrency(
                                    plan.pricing.originalMonthly,
                                    'NPR'
                                  )}
                                </span>
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Save{' '}
                                  {formatCurrency(
                                    plan.pricing.originalMonthly - (price || 0),
                                    'NPR'
                                  )}
                                </Badge>
                              </div>
                            )}
                          {plan.planType === 'day_pass' && (
                            <p className="text-xs text-amber-600 mt-1">
                              Promotional price — limited time only
                            </p>
                          )}
                          {plan.planType === 'private_office' &&
                            billingPeriod === 'monthly' && (
                              <p className="text-xs text-amber-600 mt-1">
                                Special offer — limited time only
                              </p>
                            )}
                          {billingPeriod === 'annual' &&
                            planPricing.annual &&
                            planPricing.monthly && (
                              <p className="text-xs text-green-600 mt-1">
                                Save{' '}
                                {formatCurrency(
                                  planPricing.monthly * 12 - planPricing.annual,
                                  'NPR'
                                )}{' '}
                                per year
                              </p>
                            )}
                          {billingPeriod === 'weekly' &&
                            planPricing.weekly &&
                            planPricing.monthly && (
                              <p className="text-xs text-fg-2 mt-1">
                                Monthly:{' '}
                                {formatCurrency(planPricing.monthly, 'NPR')}
                              </p>
                            )}
                          {missingSelectedPeriod && (
                            <p className="text-xs text-amber-600 mt-1">
                              No {billingPeriod} pricing at{' '}
                              {selectedLocation?.name || 'this location'} yet.
                              Showing {period} rate.
                            </p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <Check className="h-4 w-4 text-clay mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.planType === 'private_office' ? (
                          <div className="space-y-3">
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 space-y-3">
                              <p className="text-sm font-semibold text-center">
                                Enquire Now for Private Office
                              </p>
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
                                  href="tel:+9779700045256"
                                  className="flex items-center justify-center gap-2 bg-clay hover:bg-clay/90 text-fg-on-ink-1 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                  <Phone className="h-4 w-4" />
                                  Call: +977 9700045256
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : planId ? (
                          <>
                            <Button
                              className="w-full"
                              variant={isPopular ? 'default' : 'outline'}
                              asChild
                            >
                              <Link
                                to={`${ROUTES.BOOKING}?plan=${planId}${selectedLocationId ? `&location=${selectedLocationId}` : ''}`}
                              >
                                {plan.cta}
                              </Link>
                            </Button>

                            <p className="text-xs text-fg-2 text-center">
                              No setup fees • Cancel anytime
                            </p>
                          </>
                        ) : (
                          <>
                            <Button
                              className="w-full"
                              variant="secondary"
                              disabled
                            >
                              Plan not available yet
                            </Button>
                            <p className="text-xs text-fg-2 text-center">
                              Add “{plan.supabaseName}” to Supabase to enable
                              bookings.
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
          {error && (
            <p className="text-center text-clay-deep mt-6 text-sm">{error}</p>
          )}
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-bg-band/30">
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
            <p className="text-lg text-fg-2 max-w-2xl mx-auto">
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
                    <p className="text-2xl font-bold text-clay">
                      {formatCurrency(addon.price, 'NPR')}
                    </p>
                    <p className="text-sm text-fg-2">{addon.description}</p>
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
                question: 'Can I upgrade or downgrade my plan?',
                answer:
                  'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.',
              },
              {
                question: 'Is there a minimum commitment?',
                answer:
                  'No minimum commitment required. You can cancel your membership at any time with 30 days notice.',
              },
              {
                question: "What's included in meeting room credits?",
                answer:
                  'Meeting room credits allow you to book our conference rooms. Each credit represents one hour of room usage during business hours.',
              },
              {
                question: 'Can I use multiple locations?',
                answer:
                  'Yes, all plans include access to any of our locations across Kathmandu. Just book your preferred spot through our app.',
              },
              {
                question:
                  'How is Virtual Office different from coworking/private office?',
                answer:
                  'Virtual Office is a business-presence product (professional address + mail handling) without a physical desk or room. Coworking and Private Office are physical workspace products.',
              },
              {
                question: 'What happens if I exceed my printing allowance?',
                answer:
                  'Additional printing is charged at NPR 2 per page for black & white and NPR 5 per page for color printing.',
              },
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
                    <p className="text-fg-2">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              Ready to Get Started?
            </h2>
            <p className="text-lg text-fg-on-ink-1/80">
              Join hundreds of professionals who have made CreatrixSpace their
              workspace of choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to={ROUTES.BOOKING}>Start Your Journey</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-clay backdrop-blur-sm"
                asChild
              >
                <Link to={ROUTES.CONTACT}>Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
