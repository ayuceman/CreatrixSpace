import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowLeft, Share2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'

// This would normally come from an API or CMS
const blogPosts = [
  {
    id: 'remote-work-revolution-nepal',
    title: 'The Remote Work Revolution: How Nepal is Embracing the Future of Work',
    excerpt: 'Discover how Nepal\'s tech industry is adapting to remote work trends and what it means for professionals in Kathmandu and beyond.',
    content: `The landscape of work in Nepal has undergone a dramatic transformation over the past few years. What started as a necessity during the pandemic has evolved into a permanent shift that's reshaping how Nepali professionals approach their careers.

## The Rise of Digital Nomadism in Nepal

Kathmandu, Pokhara, and other major cities are witnessing an influx of digital nomads - both international and local. These remote workers are seeking spaces that offer reliable internet, professional environments, and community connections. Coworking spaces have emerged as the perfect solution, providing the infrastructure and networking opportunities that traditional home offices lack.

The appeal of Nepal for digital nomads is multifaceted. Beyond the stunning landscapes and rich culture, the country offers:

- **Cost-effective living**: Compared to major global cities, Nepal provides excellent value for money
- **Growing tech infrastructure**: Fiber internet and modern coworking spaces are becoming commonplace
- **English proficiency**: A large portion of the urban population speaks English, facilitating international business
- **Time zone advantages**: Nepal's time zone works well for businesses serving both Asian and European markets

## Challenges and Opportunities

While Nepal's tech sector grows rapidly, challenges remain. Internet connectivity, while improving, still faces occasional disruptions. Power outages, though less frequent than before, require backup solutions. These challenges have driven innovation in workspace design, with modern coworking spaces investing in UPS systems, backup internet connections, and generator facilities.

However, these challenges have also created unique opportunities:

- **Resilient infrastructure**: Coworking spaces are investing heavily in backup systems
- **Community support**: Shared challenges have fostered strong professional communities
- **Innovation**: Necessity has driven creative solutions to common problems
- **Competitive advantages**: Lower operational costs make Nepali services competitive globally

## Government Support and Digital Nepal

The Nepal government's "Digital Nepal Framework" aims to transform the country into a digitally empowered society and knowledge-based economy by 2025. Key initiatives include:

- **IT Park development**: Specialized zones for tech companies with modern infrastructure
- **Fiber internet expansion**: National fiber backbone reaching remote areas
- **Digital literacy programs**: Training programs to build digital skills
- **Startup support**: Incubation centers and funding programs for entrepreneurs

## Success Stories

Several Nepali companies have successfully embraced remote work:

- **Leapfrog Technology**: One of Nepal's largest IT companies, now operating with hybrid and remote models
- **Sastodeal**: E-commerce platform that scaled using distributed teams
- **CloudFactory**: Pioneering the concept of "distributed workforce" from Nepal

## The Future is Bright

Government initiatives supporting IT exports and the growing number of tech startups indicate a promising future. With proper infrastructure and community support, Nepal is positioned to become a major hub for remote work in South Asia.

The coworking space industry is at the forefront of this transformation, providing not just infrastructure but fostering the community and collaboration that remote work requires. As we look ahead, Nepal's unique combination of cost advantages, cultural richness, and growing tech infrastructure makes it an attractive destination for both local and international remote workers.

## What This Means for You

Whether you're a freelancer, startup founder, or remote employee, Nepal's evolving work landscape offers exciting opportunities:

- **Lower costs**: Stretch your budget further while maintaining quality of life
- **Growing community**: Connect with like-minded professionals in coworking spaces
- **Cultural richness**: Experience one of the world's most diverse and welcoming cultures
- **Strategic location**: Benefit from time zone advantages for global business

The remote work revolution in Nepal is just beginning, and coworking spaces like CreatrixSpace are leading the charge in creating environments where this new way of working can thrive.`,
    author: 'Priya Sharma',
    date: '2024-09-20',
    readTime: '5 min read',
    category: 'Remote Work',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'coworking-productivity-tips',
    title: '10 Productivity Hacks Every Coworking Space User Should Know',
    excerpt: 'Maximize your efficiency and make the most of your coworking experience with these proven strategies from successful professionals.',
    content: `Working in a coworking space offers unique advantages, but it also requires specific strategies to maximize productivity. Here are the top 10 hacks that successful professionals swear by.

## 1. Establish a Morning Routine

Arrive at the same time each day and create a consistent morning ritual. This helps signal to your brain that it's time to work. Your routine might include:

- Grabbing your favorite coffee or tea
- Reviewing your daily goals
- Checking and responding to urgent emails
- Setting up your workspace

## 2. Choose Your Spot Wisely

Different areas serve different purposes. Map out the space and understand where you work best:

- **Quiet zones**: Perfect for deep work requiring concentration
- **Collaborative areas**: Ideal for team projects and brainstorming
- **Social spaces**: Great for networking and casual meetings
- **Phone booths**: Essential for private calls and video conferences

## 3. Use Noise-Canceling Headphones

Invest in quality headphones to create your own focused environment when needed. Even if you're not playing music, they signal to others that you're in focus mode.

## 4. Take Advantage of Meeting Rooms

Book meeting rooms for important calls or when you need complete privacy. Most coworking spaces offer these as part of membership or for a small fee.

## 5. Network Strategically

Engage with other members, but be mindful of their work time. Coffee breaks and lunch hours are ideal for networking. Quality connections are better than quantity.

## 6. Manage Your Calendar

Block time for focused work, meetings, and breaks. Share your availability with potential collaborators and respect others' scheduled focus time.

## 7. Use the Community Board

Many coworking spaces have physical or digital community boards. Use these to:
- Find collaborators for projects
- Offer your services
- Discover local events and opportunities
- Share resources and recommendations

## 8. Optimize Your Digital Setup

- Use cloud storage for easy access to files
- Set up VPN if handling sensitive data
- Have backup plans for internet connectivity
- Keep your devices charged and organized

## 9. Practice the Pomodoro Technique

Work in focused 25-minute chunks followed by 5-minute breaks. This is especially effective in coworking environments where distractions are common.

## 10. Respect the Space and Community

- Keep shared areas clean
- Be mindful of noise levels
- Participate in community events
- Follow the space's guidelines and etiquette

## Bonus Tips for Nepal-Specific Challenges

- **Power backup awareness**: Know where backup power points are located
- **Festival calendar**: Plan around major festivals when spaces might be closed
- **Weather considerations**: During monsoon, have indoor backup plans
- **Cultural sensitivity**: Respect local customs and holidays

Remember, productivity in a coworking space isn't just about individual efficiency—it's about contributing to a positive community atmosphere that benefits everyone.`,
    author: 'Rajesh Thapa',
    date: '2024-09-15',
    readTime: '7 min read',
    category: 'Productivity',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'startup-ecosystem-kathmandu',
    title: 'Building Nepal\'s Startup Ecosystem: The Role of Coworking Spaces',
    excerpt: 'How coworking spaces are fostering innovation and entrepreneurship in Nepal\'s capital, creating a thriving startup ecosystem.',
    content: `Kathmandu's startup ecosystem has experienced remarkable growth, with coworking spaces playing a crucial role in this transformation. These shared workspaces have become the breeding ground for innovation, collaboration, and entrepreneurial success.

## The Catalyst Effect

Coworking spaces serve as more than just shared offices; they're catalysts for innovation. When entrepreneurs from different industries work side by side, cross-pollination of ideas naturally occurs. A fintech startup might learn marketing strategies from a fashion e-commerce company, while a software developer might find their next co-founder in the person working at the next desk.

## Success Stories from Kathmandu

Several successful startups have emerged from coworking spaces in Kathmandu. From ride-sharing apps to digital payment solutions, these companies started with just an idea and a desk in a shared workspace.

**Case Study: Local Success Stories**

- **Khalti**: Digital wallet that started from a small team in a coworking space
- **Foodmandu**: Food delivery platform that scaled using shared workspace infrastructure
- **Tootle**: Ride-sharing app that built its initial team through coworking connections

## Government Support and Future Outlook

The Nepal government's focus on digital transformation and IT exports has created a favorable environment for startups. Combined with the infrastructure and community provided by coworking spaces, Nepal is well-positioned to become a regional startup hub.

Recent government initiatives include:
- IT Park development in various cities
- Startup incubation programs
- Tax incentives for tech companies
- Digital literacy campaigns

## Building the Ecosystem

Coworking spaces contribute to the startup ecosystem by:
- Providing affordable infrastructure
- Facilitating networking and mentorship
- Hosting events and workshops
- Connecting startups with investors
- Creating a culture of innovation

The future of Nepal's startup ecosystem looks bright, with coworking spaces continuing to play a vital role in nurturing the next generation of entrepreneurs.`,
    author: 'Emma Davis',
    date: '2024-09-10',
    readTime: '6 min read',
    category: 'Entrepreneurship',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'work-life-balance-tips',
    title: 'Maintaining Work-Life Balance in a Coworking Environment',
    excerpt: 'Learn how to set boundaries and maintain healthy work-life balance while working in shared spaces.',
    content: `Working in a coworking space offers flexibility, but it can also blur the lines between work and personal life. Here's how to maintain a healthy balance.

## Setting Clear Boundaries

Just because you're in a flexible workspace doesn't mean your schedule should be chaotic. Set clear start and end times for your workday.

**Practical Boundary Setting:**
- Define your working hours and stick to them
- Communicate your availability to fellow members
- Use calendar blocking for focus time
- Create physical cues that signal work vs. personal time

## The Power of Rituals

Create rituals that signal the transition between work and personal time. This could be as simple as packing up your laptop or taking a walk after work.

**Effective Transition Rituals:**
- End-of-day shutdown routine
- Physical movement between spaces
- Changing clothes or accessories
- Brief meditation or reflection

## Use Space Transitions

Move to different areas of the coworking space for different activities. Use the work area for focused tasks and the lounge for casual interactions.

## Take Regular Breaks

The social nature of coworking spaces makes it easy to take meaningful breaks. Use this to your advantage by engaging with other members or stepping outside for fresh air.

Remember, maintaining work-life balance in a coworking space requires intentionality and self-awareness.`,
    author: 'Sophia Chen',
    date: '2024-09-05',
    readTime: '4 min read',
    category: 'Work-Life Balance',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'networking-coworking-spaces',
    title: 'The Art of Networking in Coworking Spaces: A Nepal Perspective',
    excerpt: 'Master the subtle art of building professional relationships in coworking environments while respecting cultural nuances.',
    content: `Networking in Nepal's coworking spaces requires understanding both professional etiquette and cultural sensitivities. Here's how to build meaningful connections.

## Understanding Nepali Business Culture

In Nepal, relationships often precede business deals. Take time to build genuine connections before discussing work collaborations.

**Cultural Considerations:**
- Respect for age and hierarchy
- Importance of personal relationships
- Informal communication styles
- Festival and cultural celebrations

## The Tea Culture Advantage

Use Nepal's tea culture to your advantage. Inviting someone for tea is a natural way to start conversations and build relationships.

**Tea Culture Networking:**
- Afternoon tea breaks as networking opportunities
- Sharing local tea varieties
- Creating informal meeting spaces
- Building trust through shared experiences

## Respect and Hierarchy

Be mindful of age and experience when networking. Show respect to senior professionals and be approachable to younger entrepreneurs.

## Events and Community Building

Participate in community events, workshops, and festivals organized by your coworking space. These provide natural networking opportunities.

## Digital Networking

Don't forget online networking. Connect with your coworking space community on LinkedIn and other professional platforms.`,
    author: 'Alex Rodriguez',
    date: '2024-08-30',
    readTime: '5 min read',
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'sustainable-workspace-design',
    title: 'Sustainable Workspace Design: Green Initiatives in Nepal\'s Coworking Spaces',
    excerpt: 'Explore how modern coworking spaces in Nepal are incorporating eco-friendly practices and sustainable design principles.',
    content: `As environmental consciousness grows in Nepal, coworking spaces are leading by example with sustainable practices and green design initiatives.

## Solar Power and Energy Efficiency

Many coworking spaces in Kathmandu are investing in solar panels to reduce dependence on the grid and lower carbon footprints.

**Energy Efficiency Measures:**
- LED lighting systems
- Energy-efficient equipment
- Smart temperature controls
- Natural lighting optimization

## Waste Reduction Programs

From paperless operations to recycling programs, coworking spaces are implementing comprehensive waste reduction strategies.

**Waste Management Initiatives:**
- Digital-first operations
- Recycling programs for paper, plastic, and electronics
- Composting for organic waste
- Reduction of single-use items

## Green Building Materials

New coworking spaces are using sustainable materials like bamboo, recycled wood, and low-VOC paints to create healthier work environments.

**Sustainable Materials:**
- Bamboo furniture and flooring
- Recycled and upcycled furniture
- Non-toxic paints and finishes
- Locally sourced materials

## Indoor Plants and Air Quality

Strategic placement of indoor plants not only improves air quality but also creates a more pleasant and productive work environment.

## Community Gardens

Some coworking spaces are incorporating rooftop gardens where members can grow herbs and vegetables, fostering a connection with nature.

These green initiatives not only benefit the environment but also create healthier, more inspiring workspaces for members.`,
    author: 'Michael Chen',
    date: '2024-08-25',
    readTime: '6 min read',
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    featured: false
  }
]

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.id === slug)

  if (!post) {
    return (
      <div className="container section-padding text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to={ROUTES.BLOG}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Button variant="ghost" className="mb-6" asChild>
              <Link to={ROUTES.BLOG}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
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

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{post.author}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <div className="aspect-[21/9] overflow-hidden rounded-2xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />').replace(/## (.*)/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- \*\*(.*?)\*\*: (.*)/g, '<li><strong>$1</strong>: $2</li>') 
                }}
              />
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Experience the Future of Work?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join CreatrixSpace and become part of Nepal's thriving professional community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <Link to={ROUTES.MEMBERSHIP}>
                        View Membership Plans
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to={ROUTES.CONTACT}>
                        Schedule a Tour
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
