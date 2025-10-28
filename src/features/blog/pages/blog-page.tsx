import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const blogPosts = [
  {
    id: 'remote-work-revolution-nepal',
    title: 'The Remote Work Revolution: How Nepal is Embracing the Future of Work',
    excerpt: 'Discover how Nepal\'s tech industry is adapting to remote work trends and what it means for professionals in Kathmandu and beyond.',
    content: `The landscape of work in Nepal has undergone a dramatic transformation over the past few years. What started as a necessity during the pandemic has evolved into a permanent shift that's reshaping how Nepali professionals approach their careers.

**The Rise of Digital Nomadism in Nepal**

Kathmandu, Pokhara, and other major cities are witnessing an influx of digital nomads - both international and local. These remote workers are seeking spaces that offer reliable internet, professional environments, and community connections. Coworking spaces have emerged as the perfect solution, providing the infrastructure and networking opportunities that traditional home offices lack.

**Challenges and Opportunities**

While Nepal's tech sector grows rapidly, challenges remain. Internet connectivity, while improving, still faces occasional disruptions. Power outages, though less frequent than before, require backup solutions. These challenges have driven innovation in workspace design, with modern coworking spaces investing in UPS systems, backup internet connections, and generator facilities.

**The Future is Bright**

Government initiatives supporting IT exports and the growing number of tech startups indicate a promising future. With proper infrastructure and community support, Nepal is positioned to become a major hub for remote work in South Asia.`,
    author: 'Priya Sharma',
    date: '2024-09-20',
    readTime: '5 min read',
    category: 'Remote Work',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'coworking-productivity-tips',
    title: '10 Productivity Hacks Every Coworking Space User Should Know',
    excerpt: 'Maximize your efficiency and make the most of your coworking experience with these proven strategies from successful professionals.',
    content: `Working in a coworking space offers unique advantages, but it also requires specific strategies to maximize productivity. Here are the top 10 hacks that successful professionals swear by.

**1. Establish a Morning Routine**
Arrive at the same time each day and create a consistent morning ritual. This helps signal to your brain that it's time to work.

**2. Choose Your Spot Wisely**
Different areas serve different purposes. Use quiet zones for deep work, collaborative areas for team projects, and social spaces for networking.

**3. Use Noise-Canceling Headphones**
Invest in quality headphones to create your own focused environment when needed.

**4. Take Advantage of Meeting Rooms**
Book meeting rooms for important calls or when you need complete privacy.

**5. Network Strategically**
Engage with other members, but be mindful of their work time. Coffee breaks and lunch hours are ideal for networking.`,
    author: 'Rajesh Thapa',
    date: '2024-09-15',
    readTime: '7 min read',
    category: 'Productivity',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'startup-ecosystem-kathmandu',
    title: 'Building Nepal\'s Startup Ecosystem: The Role of Coworking Spaces',
    excerpt: 'How coworking spaces are fostering innovation and entrepreneurship in Nepal\'s capital, creating a thriving startup ecosystem.',
    content: `Kathmandu's startup ecosystem has experienced remarkable growth, with coworking spaces playing a crucial role in this transformation. These shared workspaces have become the breeding ground for innovation, collaboration, and entrepreneurial success.

**The Catalyst Effect**

Coworking spaces serve as more than just shared offices; they're catalysts for innovation. When entrepreneurs from different industries work side by side, cross-pollination of ideas naturally occurs. A fintech startup might learn marketing strategies from a fashion e-commerce company, while a software developer might find their next co-founder in the person working at the next desk.

**Success Stories from Kathmandu**

Several successful startups have emerged from coworking spaces in Kathmandu. From ride-sharing apps to digital payment solutions, these companies started with just an idea and a desk in a shared workspace.

**Government Support and Future Outlook**

The Nepal government's focus on digital transformation and IT exports has created a favorable environment for startups. Combined with the infrastructure and community provided by coworking spaces, Nepal is well-positioned to become a regional startup hub.`,
    author: 'Emma Davis',
    date: '2024-09-10',
    readTime: '6 min read',
    category: 'Entrepreneurship',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'work-life-balance-tips',
    title: 'Maintaining Work-Life Balance in a Coworking Environment',
    excerpt: 'Learn how to set boundaries and maintain healthy work-life balance while working in shared spaces.',
    content: `Working in a coworking space offers flexibility, but it can also blur the lines between work and personal life. Here's how to maintain a healthy balance.

**Setting Clear Boundaries**

Just because you're in a flexible workspace doesn't mean your schedule should be chaotic. Set clear start and end times for your workday.

**The Power of Rituals**

Create rituals that signal the transition between work and personal time. This could be as simple as packing up your laptop or taking a walk after work.

**Use Space Transitions**

Move to different areas of the coworking space for different activities. Use the work area for focused tasks and the lounge for casual interactions.

**Take Regular Breaks**

The social nature of coworking spaces makes it easy to take meaningful breaks. Use this to your advantage by engaging with other members or stepping outside for fresh air.`,
    author: 'Sophia Chen',
    date: '2024-09-05',
    readTime: '4 min read',
    category: 'Work-Life Balance',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'networking-coworking-spaces',
    title: 'The Art of Networking in Coworking Spaces: A Nepal Perspective',
    excerpt: 'Master the subtle art of building professional relationships in coworking environments while respecting cultural nuances.',
    content: `Networking in Nepal's coworking spaces requires understanding both professional etiquette and cultural sensitivities. Here's how to build meaningful connections.

**Understanding Nepali Business Culture**

In Nepal, relationships often precede business deals. Take time to build genuine connections before discussing work collaborations.

**The Tea Culture Advantage**

Use Nepal's tea culture to your advantage. Inviting someone for tea is a natural way to start conversations and build relationships.

**Respect and Hierarchy**

Be mindful of age and experience when networking. Show respect to senior professionals and be approachable to younger entrepreneurs.

**Events and Community Building**

Participate in community events, workshops, and festivals organized by your coworking space. These provide natural networking opportunities.

**Digital Networking**

Don't forget online networking. Connect with your coworking space community on LinkedIn and other professional platforms.`,
    author: 'Alex Rodriguez',
    date: '2024-08-30',
    readTime: '5 min read',
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'sustainable-workspace-design',
    title: 'Sustainable Workspace Design: Green Initiatives in Nepal\'s Coworking Spaces',
    excerpt: 'Explore how modern coworking spaces in Nepal are incorporating eco-friendly practices and sustainable design principles.',
    content: `As environmental consciousness grows in Nepal, coworking spaces are leading by example with sustainable practices and green design initiatives.

**Solar Power and Energy Efficiency**

Many coworking spaces in Kathmandu are investing in solar panels to reduce dependence on the grid and lower carbon footprints.

**Waste Reduction Programs**

From paperless operations to recycling programs, coworking spaces are implementing comprehensive waste reduction strategies.

**Green Building Materials**

New coworking spaces are using sustainable materials like bamboo, recycled wood, and low-VOC paints to create healthier work environments.

**Indoor Plants and Air Quality**

Strategic placement of indoor plants not only improves air quality but also creates a more pleasant and productive work environment.

**Community Gardens**

Some coworking spaces are incorporating rooftop gardens where members can grow herbs and vegetables, fostering a connection with nature.`,
    author: 'Michael Chen',
    date: '2024-08-25',
    readTime: '6 min read',
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  }
]

const categories = [
  { name: 'All Posts', count: blogPosts.length },
  { name: 'Remote Work', count: blogPosts.filter(post => post.category === 'Remote Work').length },
  { name: 'Productivity', count: blogPosts.filter(post => post.category === 'Productivity').length },
  { name: 'Entrepreneurship', count: blogPosts.filter(post => post.category === 'Entrepreneurship').length },
  { name: 'Work-Life Balance', count: blogPosts.filter(post => post.category === 'Work-Life Balance').length },
  { name: 'Networking', count: blogPosts.filter(post => post.category === 'Networking').length },
  { name: 'Sustainability', count: blogPosts.filter(post => post.category === 'Sustainability').length }
]

export function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

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
              CreatrixSpace Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Insights & Stories from the{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Future of Work
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover the latest trends, tips, and insights about remote work, productivity, 
              and building a thriving professional community in Nepal and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-8">Featured Articles</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${post.id}`}>
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Regular Posts */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">Categories</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Regular Posts */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-3xl font-display font-bold mb-8">Latest Articles</h2>
                <div className="grid gap-6">
                  {regularPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="hover:shadow-lg transition-shadow duration-300 group">
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-3">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <Badge variant="secondary">{post.category}</Badge>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(post.date).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {post.readTime}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed mb-4">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{post.author}</span>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/blog/${post.id}`}>
                                    Read More
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
