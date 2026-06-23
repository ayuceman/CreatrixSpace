import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { addOnService } from '@/services/supabase-service'
import { FAQSection } from '@/features/home/components/faq-section'
import { MembershipSection } from '@/features/home/components/membership-section'

const FALLBACK_ADDONS: { name: string; price: number; description: string }[] =
  [
    {
      name: 'Extra Meeting Room Hours',
      price: 80000,
      description: 'Additional meeting room access',
    },
    {
      name: 'Guest Day Passes',
      price: 30000,
      description: 'Bring colleagues for a day',
    },
    {
      name: 'Phone Line',
      price: 400000,
      description: 'Dedicated phone number',
    },
  ]

export function PricingPage() {
  const [addOns, setAddOns] = useState<typeof FALLBACK_ADDONS>([])

  useEffect(() => {
    addOnService.getAllAddOns().then((data: any) => {
      if (data && data.length > 0) setAddOns(data)
    })
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-bg via-bg to-clay/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal">
              Simple, Transparent
              <span className="text-clay block italic">Memberships</span>
            </h1>
            <p className="text-lg text-fg-2">
              Choose the perfect plan for your needs. All plans include our core
              amenities and access to our vibrant community of professionals.
            </p>
          </motion.div>
        </div>
      </section>
      <MembershipSection />

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
            <h2 className="text-3xl md:text-4xl font-display font-normal">
              Optional Add-ons
            </h2>
            <p className="text-lg text-fg-2 max-w-2xl mx-auto">
              Enhance your workspace experience with our additional services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {(addOns.length > 0 ? addOns : FALLBACK_ADDONS).map(
              (addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-normal">{addon.name}</h3>
                      <p className="text-2xl font-bold text-clay">
                        {formatCurrency(addon.price, 'NPR')}
                      </p>
                      <p className="text-sm text-fg-2">{addon.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      <FAQSection />

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
            <h2 className="text-3xl md:text-4xl font-display font-normal text-fg-on-ink-1">
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
    </>
  )
}
