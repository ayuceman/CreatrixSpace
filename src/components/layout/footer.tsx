import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Phone, Twitter, Linkedin } from 'lucide-react'

// Minimal TikTok icon (fallback because current lucide-react version lacks Tiktok export)
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 3v12.5a3.5 3.5 0 1 1-3.5-3.5c.5 0 1 .08 1.46.23V9.5c-1.29-.26-2.38-.97-3.21-2.01M13 3a6 6 0 0 0 6 6" />
  </svg>
)
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
  { name: 'Twitter', icon: Twitter, href: 'https://x.com/creatrix_tech' },
  { name: 'TikTok', iconPath: '/tiktok.svg', href: 'https://www.tiktok.com/@creatrixtechnologies' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/creatrixtechnologies' },
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
                  <MessageCircle className="h-4 w-4" />
                  <a 
                    href="https://wa.me/9779803171819"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    WhatsApp: +977 9803171819
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 mt-0.5" />
                  <div className="flex flex-col space-y-1">
                    <a href="tel:+9779851357889" className="hover:underline">+977 9851357889</a>
                    <a href="tel:+9779700045256" className="hover:underline">+977 9700045256</a>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon as any
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      {social.iconPath ? (
                        <img src={social.iconPath} alt={social.name} className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col items-center sm:items-start space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2024 {APP_NAME}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by{' '}
              <a 
                href="https://www.creatrixtechnologies.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
              >
                Creatrix Technologies
              </a>
            </p>
          </div>
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
