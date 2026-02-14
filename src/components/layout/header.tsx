import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, Calendar, Phone, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { useHotDeskPricing } from '@/features/home/hooks/use-hot-desk-pricing'

const navigation = [
  { name: 'Locations', href: ROUTES.LOCATIONS },
  { name: 'Membership', href: ROUTES.PRICING },
  { name: 'Blog', href: ROUTES.BLOG },
  { name: 'About', href: ROUTES.ABOUT },
  { name: 'Contact', href: ROUTES.CONTACT },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { loading, formatted } = useHotDeskPricing()

  const phoneNumbers = ["+977 9851357889", "+977 9700045256"]
  const whatsappNumber = "9779803171819" // Format for WhatsApp link (no + or -)
  const whatsappMessage = encodeURIComponent("Hi! I'm interested in learning more about CreatrixSpace.")

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto">
            {phoneNumbers.map((phone, index) => (
              <a 
                key={index}
                href={`tel:${phone}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">{phone}</span>
              </a>
            ))}
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">WhatsApp</span>
            </a>
          </div>
          <div className="text-xs sm:text-sm">
            <span className="hidden md:inline">Hot desks available: </span>
            <span className="font-semibold">
              {loading ? <Loader2 className="h-3 w-3 animate-spin inline" /> : formatted.badge}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <img 
            src="/creatrix-logo.png" 
            alt="CreatrixSpace Logo" 
            className="h-16 md:h-20 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling
              if (fallback) fallback.classList.remove('hidden')
            }}
          />
          <div className="hidden flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">CS</span>
            </div>
            <span className="font-display font-bold text-xl">{APP_NAME}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button size="sm" asChild>
            <Link to={ROUTES.BOOKING}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button size="sm" asChild>
                <Link to={ROUTES.BOOKING} onClick={() => setIsMenuOpen(false)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  )
}
