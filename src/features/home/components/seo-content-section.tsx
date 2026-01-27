import { motion } from 'framer-motion'
import { MapPin, Users, Wifi, Coffee, Building2, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function SEOContentSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Best Co Working Space in Kathmandu - Premium Coworking Spaces
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Looking for the best <strong>co working space in kathmandu</strong>? CreatrixSpace is your premier destination for 
              flexible <strong>co working spaces in Kathmandu</strong> and Lalitpur. Our modern facilities provide everything 
              professionals need to thrive, from high-speed internet to professional meeting rooms. If you're searching for a 
              <strong> co working space in kathmandu</strong>, our Dhobighat Hub location offers premium amenities and 24/7 access.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Whether you're searching for a <strong>co working space in kathmandu</strong> or a coworking space in Lalitpur, 
              we have locations that suit your needs. Our <strong>Dhobighat Hub</strong> in Kathmandu is the perfect 
              <strong> co working space in kathmandu</strong> for freelancers, entrepreneurs, and remote workers. Our 
              <strong> Kausimaa Co-working</strong> in Kupondole, Lalitpur offers premium amenities including 24/7 access, 
              meeting rooms, event spaces, and vibrant communities of professionals.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4">
              Why Choose Our Co Working Space in Nepal?
            </h3>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Prime Locations</h4>
                      <p className="text-muted-foreground">
                        Our <strong>co working spaces in Kathmandu and Lalitpur</strong> are strategically located 
                        in accessible areas with excellent connectivity and amenities nearby.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Wifi className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">High-Speed Internet</h4>
                      <p className="text-muted-foreground">
                        Reliable fiber internet with 99.9% uptime guarantee, essential for any modern 
                        <strong> coworking space in Nepal</strong>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">24/7 Access</h4>
                      <p className="text-muted-foreground">
                        Work on your schedule with round-the-clock access to our <strong>co working spaces</strong>, 
                        perfect for freelancers and remote workers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Meeting Rooms & Event Spaces</h4>
                      <p className="text-muted-foreground">
                        Professional meeting rooms and event spaces available for booking at all our 
                        <strong> coworking locations in Nepal</strong>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4">
              Best Coworking Space Locations in Nepal
            </h3>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              <strong>CreatrixSpace</strong> operates premium <strong>co working spaces</strong> across Nepal:
            </p>

            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li><strong>Dhobighat Hub, Kathmandu</strong> - Our flagship location offering 24/7 access, meeting rooms, and event spaces</li>
              <li><strong>Kausimaa Co-working, Kupondole, Lalitpur</strong> - Modern workspace with outdoor terrace and phone booths</li>
              <li><strong>Jhamsikhel Loft, Lalitpur</strong> - Premium space with rooftop terrace and cafe facilities</li>
            </ul>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Each location offers flexible membership plans, from daily passes to private offices, making us the 
              ideal choice for anyone seeking a <strong>co working space in kathmandu</strong> or anywhere in Nepal. 
              Whether you need a <strong>co working space in kathmandu</strong> or coworking space in Lalitpur, 
              CreatrixSpace provides the perfect environment for productivity and growth. Our 
              <strong> co working space in kathmandu</strong> at Dhobighat Hub is specifically designed for modern 
              professionals seeking the best workspace experience in Nepal's capital city.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
