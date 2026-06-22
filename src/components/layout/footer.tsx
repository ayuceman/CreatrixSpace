import { useState, useEffect } from 'react'
import { ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'
import {
  locationService,
  membershipService,
  formSubmissionService,
} from '@/services/supabase-service'

interface FooterLocation {
  name: string
  address: string
  slug: string
}

interface MembershipLink {
  name: string
  price: string
  period: string
}

const defaultFooterLocations: FooterLocation[] = [
  {
    name: 'Dhobighat Hub',
    address: 'Mandala St, Kathmandu',
    slug: 'dhobighat',
  },
  {
    name: 'Kausimaa Co-working',
    address: 'Kupondole, Lalitpur',
    slug: 'kausimaa',
  },
  {
    name: 'Jhamsikhel Loft',
    address: 'Jhamsikhel, Lalitpur',
    slug: 'jhamsikhel',
  },
]

const defaultMembershipLinks: MembershipLink[] = [
  { name: 'Day pass', price: '800', period: '/ day' },
  { name: 'Week pass', price: '3,000', period: '/ week' },
  { name: 'Dedicated desk', price: '8,000', period: '/ month' },
  { name: 'Private offices', price: '5 available', period: '' },
  { name: 'Virtual office', price: '6,000', period: '/ month' },
]

export function Footer() {
  const [locations, setLocations] = useState<FooterLocation[]>(
    defaultFooterLocations
  )
  const [membershipLinks, setMembershipLinks] = useState<MembershipLink[]>(
    defaultMembershipLinks
  )
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    locationService.getAllLocations().then((data) => {
      if (data && data.length > 0) {
        setLocations(
          data.map((l: any) => ({
            name: l.name,
            address: l.address || l.city || l.full_address || '',
            slug: l.slug || l.id,
          }))
        )
      }
    })

    membershipService.get().then((data) => {
      if (data) {
        const tabs = (data.tabs as any[]) ?? []
        if (tabs.length > 0) {
          const links: MembershipLink[] = []
          for (const tab of tabs) {
            if (tab.mode === 'grid' && tab.cards) {
              for (const card of tab.cards) {
                links.push({
                  name: card.name,
                  price: card.price ? `NPR ${card.price}` : '',
                  period: card.period || '',
                })
              }
            } else if (tab.mode === 'single' && tab.single) {
              links.push({
                name: tab.single.name,
                price: tab.single.price ? `NPR ${tab.single.price}` : '',
                period: tab.single.period || '',
              })
            }
          }
          if (links.length > 0) setMembershipLinks(links)
        }
      }
    })
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await formSubmissionService.create({
        form_type: 'newsletter',
        name: email,
        email,
      })
      setSubscribed(true)
      setEmail('')
    } catch {
      // silently fail
    }
  }

  const formatPrice = (link: MembershipLink) => {
    if (link.price === '5 available') return link.price
    if (!link.price) return ''
    return `${link.price}${link.period ? ` · ${link.period}` : ''}`
  }

  return (
    <footer className="bg-ink text-fg-on-ink-1 pt-24 pb-8 border-t border-[rgba(243,239,231,0.06)]">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-rule-on-ink">
          <div className="col-span-1">
            <div className="font-display text-[40px] tracking-[-0.01em] leading-none">
              Creatrix<em className="text-clay not-italic">Space</em>
            </div>
            <p className="text-[15px] leading-[1.6] text-fg-on-ink-2 mt-[22px] max-w-[320px]">
              A small, premium coworking outfit in Kathmandu and Lalitpur. Three
              rooms, open from morning to morning.
            </p>
            {subscribed ? (
              <div className="mt-7 text-sm text-moss">
                You're on the list. Check your inbox.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-7 flex gap-0 border-b border-rule-on-ink pb-2 max-w-[320px]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for the letter"
                  required
                  className="flex-1 bg-transparent border-0 outline-0 text-fg-on-ink-1 font-body text-sm"
                />
                <button
                  type="submit"
                  className="bg-transparent border-0 text-clay cursor-pointer font-body text-sm font-medium inline-flex items-center gap-1 shrink-0"
                >
                  Subscribe
                  <ArrowRight size={12} />
                </button>
              </form>
            )}
            <div className="text-xs text-fg-3 mt-2">
              Monthly. Field notes, openings, member interviews.
            </div>
          </div>

          <div>
            <div className="eyebrow text-clay mb-4.5">Locations</div>
            {locations.map((loc) => (
              <a
                key={loc.slug}
                href={`/locations#${loc.slug}`}
                className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
              >
                {loc.name}
                {loc.address && (
                  <>
                    <br />
                    <span className="font-mono text-xs text-fg-3">
                      {loc.address}
                    </span>
                  </>
                )}
              </a>
            ))}
          </div>

          <div>
            <div className="eyebrow text-clay mb-4.5">Membership</div>
            {membershipLinks.map((link, i) => (
              <a
                key={`${link.name}-${i}`}
                href="/#membership"
                className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
              >
                {link.name}{' '}
                {formatPrice(link) && <>&middot; {formatPrice(link)}</>}
              </a>
            ))}
            <a
              href="/#spaces"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Event &amp; training rooms
            </a>
            <a
              href="/booking"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Book a tour
            </a>
          </div>

          <div>
            <div className="eyebrow text-clay mb-4.5">Talk to us</div>
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={14} />
                WhatsApp
              </span>
              <br />
              <span className="font-mono text-xs text-fg-3">
                {WHATSAPP.DISPLAY}
              </span>
            </a>
            <a
              href="tel:+97715453000"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              <span className="inline-flex items-center gap-2">
                <Phone size={14} />
                Call us
              </span>
              <br />
              <span className="font-mono text-xs text-fg-3">
                +977 1 5453000
              </span>
            </a>
            <a
              href="mailto:hello@creatrixventures.space"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              <span className="inline-flex items-center gap-2">
                <Mail size={14} />
                Email
              </span>
              <br />
              <span className="font-mono text-xs text-fg-3">
                hello@creatrixventures.space
              </span>
            </a>
            <a
              href="/#concierge"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Concierge chat
            </a>
            <a
              href="/#faq"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="pt-7 flex justify-between items-center flex-wrap gap-4">
          <div className="font-mono text-xs text-fg-3">
            &copy; CreatrixSpace 2026 &middot; Kathmandu &amp; Lalitpur &middot;
            Powered by{' '}
            <a
              href="#"
              className="text-fg-on-ink-2 underline underline-offset-3"
            >
              Creatrix Technologies
            </a>
          </div>
          <div className="flex gap-5.5 text-[13px]">
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Instagram
            </a>
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Substack
            </a>
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Privacy
            </a>
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
