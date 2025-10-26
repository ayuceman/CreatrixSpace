import { motion } from 'framer-motion'
import { Users, Heart, Target, Award, MapPin, Calendar, Briefcase, Coffee } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Happy Members', value: '500+', icon: Users },
  { label: 'Locations', value: '3', icon: MapPin },
  { label: 'Years of Experience', value: '5+', icon: Calendar },
  { label: 'Events Hosted', value: '100+', icon: Briefcase },
]

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'We believe in fostering connections and building a supportive community where everyone can thrive.',
  },
  {
    icon: Target,
    title: 'Innovation Focus',
    description: 'We provide cutting-edge facilities and technology to help our members stay ahead in their fields.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in everything we do, from our spaces to our service.',
  },
  {
    icon: Coffee,
    title: 'Work-Life Balance',
    description: 'We create environments that promote productivity while ensuring comfort and well-being.',
  },
]

export function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6">
              About CreatrixSpace
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Redefining the Future of{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Workspaces
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're on a mission to create inspiring workspaces that foster innovation, 
              collaboration, and personal growth. Join a community of forward-thinking 
              professionals who are shaping the future of work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2019, CreatrixSpace began with a simple vision: to create 
                  workspaces that inspire creativity and foster meaningful connections. 
                  What started as a single location in Kathmandu has grown into a thriving 
                  network of premium coworking spaces across Nepal.
                </p>
                <p>
                  Our founders, Sarah and Michael, were frustrated with traditional office 
                  environments that stifled creativity and isolated workers. They envisioned 
                  spaces that would break down barriers, encourage collaboration, and provide 
                  the flexibility that modern professionals need.
                </p>
                <p>
                  Today, we're proud to serve over 500 members across our locations, 
                  providing not just desks and meeting rooms, but a community where 
                  ideas flourish and businesses grow.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="CreatrixSpace workspace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do and shape the experience 
              we create for our community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              To empower professionals and entrepreneurs by providing inspiring, 
              flexible workspaces that foster innovation, collaboration, and growth. 
              We believe that the right environment can unlock human potential and 
              create positive change in our community.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
              <blockquote className="text-2xl font-medium italic">
                "The future of work is flexible, collaborative, and community-driven. 
                We're here to make that future a reality."
              </blockquote>
              <cite className="block mt-4 text-muted-foreground">
                — Ayushman Bajracharya
              </cite>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
