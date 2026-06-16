import { motion } from 'framer-motion'
import { Section, SectionHeading } from '@/components/ui/section'

const testimonials = [
  {
    quote:
      "I was at a traditional coworking space before. There, everyone was loud on Zoom calls. Here? People actually work. It's like a library with better coffee.",
    name: 'Priya Sharma',
    role: 'Software Engineer',
  },
  {
    quote:
      "I've been here four months now. My team thought I was working from home — that's how uninterrupted my days are. The internet alone is worth it.",
    name: 'Rajesh Khadka',
    role: 'UX Consultant',
  },
  {
    quote:
      'I used to rent a small office. It was lonely, expensive, and the WiFi was terrible. CreatrixSpace costs a third and I get ten times the environment.',
    name: 'Samiksha Adhikari',
    role: 'Freelance Writer',
  },
]

const companies = [
  'Bhote Books',
  'Patan Records',
  'Sherpa Software',
  'Khumbu & Co.',
  'Pokhi Notes',
  'Lipi Cartography',
  'Kathmandu',
  'Bhote Books',
  'Patan Records',
  'Sherpa Software',
  'Khumbu & Co.',
  'Pokhi Notes',
  'Lipi Cartography',
  'Kathmandu',
]

export function CommunitySection() {
  return (
    <Section>
      <SectionHeading>
        A floor full of people doing serious work —{' '}
        <em className="text-clay not-italic italic">quietly</em>.
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-bg-raised border border-rule/30"
          >
            <p className="text-sm leading-relaxed mb-6 text-fg-2">
              "{testimonial.quote}"
            </p>
            <div className="border-t border-rule/50 pt-4">
              <div className="font-medium text-sm text-fg-1">
                {testimonial.name}
              </div>
              <div className="text-xs text-fg-3">{testimonial.role}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="overflow-hidden border-t border-rule pt-8"
      >
        <p className="text-xs text-center mb-6 text-fg-3">
          Members from these companies work here
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {companies.map((company, index) => (
              <span
                key={`${company}-${index}`}
                className="mx-8 font-serif text-lg font-semibold flex-shrink-0 text-fg-3"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
