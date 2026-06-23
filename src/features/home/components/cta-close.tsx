import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { WHATSAPP } from '@/lib/constants'

interface CTACloseProps {
  onBookTour?: () => void
}

export function CTAClose({ onBookTour: _onBookTour }: CTACloseProps) {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] tracking-tight">
            Faster than a form.{' '}
            <em className="text-clay not-italic italic">Real answers</em>, in
            plain English.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-body leading-relaxed text-fg-2">
            We don't do contact forms. If you have a question, send us a message
            on WhatsApp or give us a call. You'll talk to a real person —
            usually within minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 bg-ink text-bg"
            >
              <MessageCircle className="h-4 w-4" />
              Message on WhatsApp
            </a>

            <a
              href="tel:+9779851357889"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 bg-transparent text-fg-1 border border-rule"
            >
              <Phone className="h-4 w-4" />
              +977 9851357889
            </a>
          </div>

          <p className="text-xs pt-2 text-fg-3">
            Available Sunday – Friday, 8am – 7pm. Saturday mornings too.
          </p>
        </motion.div>
      </div>
    </Section>
  )
}
