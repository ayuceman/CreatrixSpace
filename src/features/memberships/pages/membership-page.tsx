import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Check, 
  Crown, 
  Zap, 
  Users, 
  Wifi, 
  Coffee, 
  Shield,
  Star,
  ArrowRight,
  Building,
  Clock,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

const membershipPlans = [
  {
    id: 'explorer',
    name: 'Explorer',
    subtitle: 'Perfect for trying us out',
    price: 800,
    period: 'day',
    popular: false,
    description: 'Ideal for freelancers and remote workers who need flexible access',
    features: [
      'Day pass access to all locations',
      'High-speed WiFi',
      'Coffee & tea',
      'Basic printing (10 pages)',
      'Lounge area access',
      'Community events access'
    ],
    limitations: [
      'No meeting room access',
      'No storage space',
      'Limited support hours'
    ],
    cta: 'Get Day Pass',
    icon: MapPin,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'Most popular choice',
    price: 8999,
    period: 'month',
    originalPrice: 12000,
    popular: true,
    description: 'Perfect for growing professionals and small teams',
    features: [
      'Unlimited access to all locations',
      'Hot desk workstation',
      '8 hours meeting room per month',
      'Premium printing (100 pages)',
      'Coffee, tea & snacks',
      'Personal storage locker',
      'Priority community events',
      '24/7 access',
      'Priority support'
    ],
    limitations: [],
    cta: 'Start Professional',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For teams and businesses',
    price: 10999,
    period: 'month',
    originalPrice: 18500,
    popular: false,
    description: 'Comprehensive solution for established businesses',
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
      'Custom billing options'
    ],
    limitations: [],
    cta: 'Go Enterprise',
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'private-office',
    name: 'Private Office',
    subtitle: 'Ultimate privacy and productivity',
    price: 25000,
    period: 'month',
    originalPrice: 35000,
    annualPrice: 300000, // NPR 300,000/year
    popular: false,
    description: 'Complete privacy and control for established teams',
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
      'Company signage'
    ],
    limitations: [],
    cta: 'Book Private Office',
    icon: Crown,
    gradient: 'from-emerald-500 to-teal-500'
  }
]

const benefits = [
  {
    icon: Building,
    title: 'Premium Locations',
    description: 'Access to all our beautifully designed workspaces across the city'
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with like-minded professionals and grow your network'
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: '24/7 access means you can work whenever inspiration strikes'
  },
  {
    icon: Shield,
    title: 'Secure Environment',
    description: 'Safe, clean, and professionally maintained workspaces'
  },
  {
    icon: Wifi,
    title: 'High-Speed Internet',
    description: 'Lightning-fast fiber internet that never lets you down'
  },
  {
    icon: Coffee,
    title: 'Premium Amenities',
    description: 'Free coffee, tea, snacks, and all the essentials you need'
  }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'UX Designer',
    company: 'TechStart Nepal',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    quote: 'CreatrixSpace transformed my productivity. The environment is inspiring and the community is incredibly supportive.',
    rating: 5
  },
  {
    name: 'Rajesh Thapa',
    role: 'Startup Founder',
    company: 'InnovateKTM',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    quote: 'The Professional membership gave me everything I needed to scale my business. Highly recommended!',
    rating: 5
  },
  {
    name: 'Sophia Chen',
    role: 'Digital Marketer',
    company: 'Remote Worker',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    quote: 'Best investment I made for my career. The networking opportunities alone are worth the membership.',
    rating: 5
  }
]

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '3', label: 'Prime Locations' },
  { value: '24/7', label: 'Access Available' }
]

export function MembershipPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background via-background to-primary/5 relative">
        <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6">
              <Star className="h-4 w-4 mr-2" />
              Premium Memberships
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Join the Future of{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Professional Work
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Unlock your potential with flexible membership plans designed for modern professionals. 
              Experience premium workspaces, vibrant community, and unmatched convenience.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Floating Graphics */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl -z-10" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl -z-10" />
      </section>

      {/* Membership Plans */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible membership options that grow with your needs. All plans include access to our premium amenities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {membershipPlans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        <Crown className="h-4 w-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/20' : ''}`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} p-4 mx-auto mb-4 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <p className="text-muted-foreground">{plan.subtitle}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="text-center mb-6">
                        {plan.id === 'private-office' && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Starting from
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-3xl font-bold">NPR {plan.price.toLocaleString()}</span>
                          <span className="text-muted-foreground">/{plan.period}</span>
                        </div>
                        {plan.originalPrice && (
                          <div className="text-sm text-muted-foreground">
                            <span className="line-through">NPR {plan.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="ml-2">
                              Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                            </Badge>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">What's Included:</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {plan.limitations.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 text-muted-foreground">Limitations:</h4>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-4 h-4 border border-muted-foreground/30 rounded-full mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <Button 
                        size="lg" 
                        className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        asChild
                      >
                        <Link to={`${ROUTES.BOOKING}?plan=${plan.id}`}>
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Why Choose CreatrixSpace?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than just a workspace - it's a community designed to help you succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              What Our Members Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of professionals who have transformed their work experience with CreatrixSpace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Transform Your Work Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join CreatrixSpace today and discover what it means to work in an environment 
              designed for success. Start with a day pass or dive into full membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to={ROUTES.BOOKING}>
                  Start Free Tour
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to={ROUTES.CONTACT}>
                  Contact Sales
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
