import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES, APP_NAME } from '@/lib/constants'

const footerLinks = {
  company: [
    { name: 'About', href: ROUTES.ABOUT },
    { name: 'Careers', href: ROUTES.CAREERS },
    { name: 'Blog', href: ROUTES.BLOG },
    { name: 'Contact', href: ROUTES.CONTACT },
  ],
  services: [
    { name: 'Locations', href: ROUTES.LOCATIONS },
    { name: 'Pricing', href: ROUTES.PRICING },
    { name: 'Membership', href: ROUTES.MEMBERSHIP },
    { name: 'Book a Tour', href: ROUTES.BOOKING },
  ],
  legal: [
    { name: 'Terms of Service', href: ROUTES.TERMS },
    { name: 'Privacy Policy', href: ROUTES.PRIVACY },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Link to={ROUTES.HOME} className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-xl">{APP_NAME}</span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                  Premium coworking spaces designed for modern professionals. 
                  Find your perfect workspace in the heart of the city.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Stay Updated</h4>
                <div className="flex max-w-sm">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="rounded-r-none"
                  />
                  <Button type="submit" className="rounded-l-none">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get the latest updates on new locations and special offers.
                </p>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@creatrixspace.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+977 9851357889</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 {APP_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
