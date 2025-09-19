import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Startup Founder',
    company: 'TechNepal',
    content: 'CreatrixSpace has been instrumental in our startup journey. The networking opportunities and professional environment have helped us grow exponentially.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rajesh Khadka',
    role: 'Digital Marketer',
    company: 'Freelancer',
    content: 'The flexibility of hot desking combined with premium amenities makes this the perfect workspace for digital nomads like me.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 3,
    name: 'Samiksha Adhikari',
    role: 'UX Designer',
    company: 'Design Studio',
    content: 'The creative atmosphere and modern facilities inspire me every day. The meeting rooms are perfect for client presentations.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 4,
    name: 'Arjun Thapa',
    role: 'Software Developer',
    company: 'Remote Worker',
    content: 'Fast internet, comfortable seating, and a great community. Everything I need to be productive while working remotely.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 5,
    name: 'Binita Maharjan',
    role: 'Business Consultant',
    company: 'Independent',
    content: 'The professional environment and excellent facilities have significantly improved my productivity and work-life balance.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    id: 6,
    name: 'Kiran Shrestha',
    role: 'Content Creator',
    company: 'YouTube Channel',
    content: 'The community events and networking opportunities have opened doors to amazing collaborations and partnerships.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Loved by
            <span className="gradient-text"> Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of satisfied members who have made CreatrixSpace their 
            workspace of choice for productivity and growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Quote className="h-6 w-6 text-primary" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
