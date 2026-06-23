import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, WHATSAPP } from '@/lib/constants'
import { Button } from '../ui/button'
import { useBookTour } from '@/lib/book-tour-context'

const navItems = [
  { name: 'Locations', hash: 'locations' },
  { name: 'Membership', hash: 'membership' },
  { name: 'Events & training', hash: 'spaces' },
  { name: 'Amenities', hash: 'amenities' },
  { name: 'FAQ', hash: 'faq' },
]

function getActiveHash(): string {
  const ids = navItems.map((n) => n.hash)
  for (const id of ids.reverse()) {
    const el = document.getElementById(id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= 200) return id
  }
  return ''
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const location = useLocation()
  const { openTour } = useBookTour()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0)
      if (location.pathname === '/') {
        setActiveHash(getActiveHash())
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const scrollTo = useCallback((hash: string) => {
    const el = document.getElementById(hash)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
    window.history.pushState(null, '', `/#${hash}`)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background,border-color] duration-300 ease-out py-4.5',
        scrolled || isMenuOpen
          ? 'bg-[rgba(243,239,231,0.86)] backdrop-blur-md saturate-[1.4] border-b border-rule'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to={ROUTES.HOME} className="no-underline">
            <div className="font-display text-[26px] tracking-[-0.01em] text-fg-1 leading-none">
              Creatrix<em className="text-clay">Space</em>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7.5">
            {navItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => scrollTo(item.hash)}
                className={cn(
                  'bg-transparent border-0 cursor-pointer text-sm transition-colors duration-200 ease-out pb-1 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-px after:bg-clay after:transition-all after:duration-200 after:origin-center hover:after:w-full',
                  activeHash === item.hash
                    ? 'text-fg-1 font-medium after:w-full'
                    : 'text-fg-2 font-normal hover:text-fg-1 after:w-0'
                )}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={MessageCircle}
              text="WhatsApp"
              className="py-2 px-3.5 hidden lg:flex"
              href={WHATSAPP.url}
              target="_blank"
            />
            <Button
              variant="dark"
              text="Book a tour"
              className="py-2 px-5.5"
              onClick={() => openTour()}
            />
            <button
              type="button"
              className="lg:hidden p-2 pr-0 rounded-md text-fg-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-out',
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container py-4 space-y-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  scrollTo(item.hash)
                  setIsMenuOpen(false)
                }}
                className={cn(
                  'block w-full text-left py-2.5 text-sm font-medium transition-colors border-0 cursor-pointer',
                  activeHash === item.hash
                    ? 'text-fg-1'
                    : 'text-fg-2 hover:text-fg-1'
                )}
              >
                {item.name}
              </button>
            ))}
            <Link
              to={ROUTES.LOCATIONS}
              className="block py-2.5 text-clay text-sm mt-1 underline hover:text-clay-deep transition-colors"
            >
              All addresses →
            </Link>
            <Link
              to={WHATSAPP.url}
              target="_blank"
              rel="noopener"
              className="flex py-2.5 items-center gap-1.5 text-clay text-sm underline hover:text-clay-deep transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {`WhatsApp ${WHATSAPP.DISPLAY}`}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
