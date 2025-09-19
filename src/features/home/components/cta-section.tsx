import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function CTASection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              Ready to Transform
              <span className="block">Your Work Experience?</span>
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join our community of ambitious professionals and take your productivity 
              to the next level. Your perfect workspace is just a click away.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary hover:text-primary"
              asChild
            >
              <Link to={ROUTES.BOOKING}>
                <Calendar className="mr-2 h-5 w-5" />
                Book a Tour
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to={ROUTES.LOCATIONS}>
                <MapPin className="mr-2 h-5 w-5" />
                View Locations
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-primary-foreground/20"
          >
            <p className="text-sm text-primary-foreground/60">
              No long-term commitments • Cancel anytime • 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
