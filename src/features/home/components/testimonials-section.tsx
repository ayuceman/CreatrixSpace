import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Co-founder & CTO',
    company: 'TechNepal',
    content: 'We moved our 8-person dev team to CreatrixSpace and saw immediate productivity gains. The infrastructure is enterprise-grade, and the flexibility to scale up was a deciding factor.',
    rating: 5,
    initials: 'PS',
    color: 'bg-purple-600',
  },
  {
    id: 2,
    name: 'Rajesh Khadka',
    role: 'Managing Director',
    company: 'Khadka Consulting',
    content: 'The meeting rooms and professional environment have elevated our client-facing operations significantly. It is our primary workspace across two locations now.',
    rating: 5,
    initials: 'RK',
    color: 'bg-blue-600',
  },
  {
    id: 3,
    name: 'Samiksha Adhikari',
    role: 'Lead Designer',
    company: 'Pixel Studio Nepal',
    content: 'Creative atmosphere, fast internet, and great meeting rooms for client presentations. The community events have led to three client referrals in four months.',
    rating: 5,
    initials: 'SA',
    color: 'bg-indigo-600',
  },
  {
    id: 4,
    name: 'Arjun Thapa',
    role: 'Engineering Lead',
    company: 'RemoteFirst Nepal',
    content: 'Our distributed team needed a reliable anchor office. The 24/7 access, dedicated desks, and stable connectivity make CreatrixSpace the obvious choice.',
    rating: 4,
    initials: 'AT',
    color: 'bg-violet-600',
  },
  {
    id: 5,
    name: 'Binita Maharjan',
    role: 'Strategy Consultant',
    company: 'Maharjan Advisory',
    content: 'Moving from a home office to CreatrixSpace transformed my client relationships. The professional address and meeting facilities add credibility that translates to revenue.',
    rating: 5,
    initials: 'BM',
    color: 'bg-fuchsia-600',
  },
  {
    id: 6,
    name: 'Kiran Shrestha',
    role: 'Founder',
    company: 'Valley Digital',
    content: 'Started with a hot desk, now have a private office for six. The seamless scaling and month-to-month flexibility is exactly what a growing startup needs.',
    rating: 4,
    initials: 'KS',
    color: 'bg-purple-700',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-24 bg-white dark:bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Trusted by Teams Across Nepal
          </h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            From solo founders to growing teams, professionals choose CreatrixSpace 
            for productivity, infrastructure, and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="h-full p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all hover:shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Quote className="h-5 w-5 text-purple-400" />
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3.5 w-3.5 ${
                          i < testimonial.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
