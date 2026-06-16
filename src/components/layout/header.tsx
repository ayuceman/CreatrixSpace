import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, WHATSAPP } from '@/lib/constants'
import { Button } from '../ui/button'
import { useBookTour } from '@/lib/book-tour-context'

const navigation = [
  { name: 'Amenities', href: '#amenities' },
  { name: 'Locations', href: ROUTES.LOCATIONS },
  { name: 'Pricing', href: ROUTES.PRICING },
  { name: 'FAQ', href: '#faq' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { openTour } = useBookTour()

  return (
    <header className="sticky top-0 z-50 w-full bg-bg border-b border-rule">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
        >
          <span className="font-serif text-xl font-bold text-fg-1">
            Creatrix
          </span>
          <span className="font-serif text-xl italic font-normal text-clay">
            Space
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'text-sm font-medium transition-colors',
                location.pathname === item.href
                  ? 'text-fg-1'
                  : 'text-fg-2 hover:text-fg-1'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            icon={MessageCircle}
            text="WhatsApp"
            className="py-2 px-3.5"
            href={WHATSAPP.url}
            target="_blank"
          />
          <Button
            variant="dark"
            text="Book a tour"
            className="py-2 px-3.5"
            onClick={() => openTour()}
          />
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-fg-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-rule bg-bg">
          <div className="container py-4 space-y-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'block px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'text-fg-1 bg-bg-band'
                      : 'text-fg-2 hover:text-fg-1 hover:bg-bg-band'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-rule">
              <Link
                to={ROUTES.BOOKING}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-5 py-2.5 text-sm font-medium rounded-full bg-clay text-bg"
              >
                Book now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
