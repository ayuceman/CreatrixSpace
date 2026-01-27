import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'What is a co working space?',
    answer: 'A co working space is a shared office environment where freelancers, entrepreneurs, remote workers, and small teams can work independently while sharing common facilities like internet, meeting rooms, and amenities. CreatrixSpace offers premium co working spaces in Nepal with locations in Kathmandu and Lalitpur.'
  },
  {
    question: 'Where are your coworking spaces located in Nepal?',
    answer: 'We have three locations: Dhobighat Hub in Kathmandu, Kausimaa Co-working in Kupondole (Lalitpur), and Jhamsikhel Loft in Lalitpur. All locations offer modern facilities, high-speed internet, and 24/7 access options.'
  },
  {
    question: 'What amenities are included in your co working space?',
    answer: 'Our coworking spaces include high-speed internet, meeting rooms, phone booths, printing services, coffee and tea, lounge areas, event spaces, secure lockers, and 24/7 access at select locations. Some locations also feature outdoor terraces and parking facilities.'
  },
  {
    question: 'How much does it cost to use a coworking space in Nepal?',
    answer: 'We offer flexible pricing plans starting from NPR 800.00/day for Explorer passes to NPR 58,500/month for private offices. Professional plans start at NPR 8,999/month. All plans include access to amenities and can be upgraded, downgraded, or cancelled anytime with no setup fees.'
  },
  {
    question: 'Do you offer meeting rooms in your coworking space?',
    answer: 'Yes, all our locations have professional meeting rooms equipped with AV technology. Meeting rooms can be booked by members and are available for both small team meetings and larger presentations.'
  },
  {
    question: 'Is internet included in the coworking space membership?',
    answer: 'Yes, high-speed fiber internet with 99.9% uptime guarantee is included in all membership plans. Our coworking spaces in Kathmandu and Lalitpur provide reliable connectivity essential for remote work.'
  },
  {
    question: 'Can I access the coworking space 24/7?',
    answer: '24/7 access is available at select locations including our Dhobighat Hub in Kathmandu. This allows members to work on their own schedule, perfect for freelancers and remote workers with flexible hours.'
  },
  {
    question: 'What makes CreatrixSpace the best coworking space in Nepal?',
    answer: 'CreatrixSpace combines premium facilities, strategic locations in Kathmandu and Lalitpur, flexible membership plans, vibrant community, and modern amenities. With over 500 members and multiple locations, we provide the infrastructure and networking opportunities that make us a leading co working space in Nepal.'
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate FAQ schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <>
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="section-padding bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our co working spaces in Nepal
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                      aria-expanded={openIndex === index}
                    >
                      <span className="font-semibold text-lg pr-8">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform',
                          openIndex === index && 'transform rotate-180'
                        )}
                      />
                    </button>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
