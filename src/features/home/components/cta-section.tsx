import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function CTASection() {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-sm font-semibold text-purple-400 tracking-wide uppercase">
              Get Started
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              Ready to Upgrade
              <span className="block text-purple-400">Your Workspace?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Book a workspace today or schedule a tour. No long-term lock-in. 
              Flexible plans that scale with your team.
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
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8 text-base shadow-lg shadow-purple-600/25"
              asChild
            >
              <Link to={ROUTES.BOOKING}>
                <Calendar className="mr-2 h-5 w-5" />
                Book a Workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-600 bg-transparent text-white hover:bg-white hover:text-gray-900 h-12 px-8 text-base"
              asChild
            >
              <Link to={ROUTES.CONTACT}>
                <Phone className="mr-2 h-5 w-5" />
                Contact Sales
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-gray-800"
          >
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
              <span>No long-term commitment</span>
              <span className="hidden sm:inline">|</span>
              <span>Month-to-month flexibility</span>
              <span className="hidden sm:inline">|</span>
              <span>Scale anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
