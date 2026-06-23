import { Link, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { logoutAdmin, getAdminSession } from '@/lib/admin-auth'
import { useEffect, useState, useRef } from 'react'
import { onNewBooking, NewBookingEvent } from '@/lib/booking-events'
import { onNewMembership, type MembershipEvent } from '@/lib/membership-events'
import { cn } from '@/lib/utils'
import { ToastContainer } from '@/components/ui/toast'
import { ChevronDown } from 'lucide-react'

const pageTitles: Record<string, string> = {
  [ROUTES.ADMIN]: 'Dashboard',
  [ROUTES.ADMIN_BOOKINGS]: 'Bookings',
  [ROUTES.ADMIN_MEMBERSHIPS]: 'Memberships',
  [ROUTES.ADMIN_PRICING]: 'Location Pricing',
  [ROUTES.ADMIN_LOCATIONS]: 'Locations',
  [ROUTES.ADMIN_SITE_STATS]: 'Site Stats',
  [ROUTES.ADMIN_HERO]: 'Hero Section',
  [ROUTES.ADMIN_MEMBERSHIP]: 'Membership Section',
  [ROUTES.ADMIN_SPACES]: 'Spaces Section',
  [ROUTES.ADMIN_AMENITIES]: 'Amenities Section',
  [ROUTES.ADMIN_BOOK_TOUR]: 'Book a Tour Content',
  [ROUTES.ADMIN_TESTIMONIALS]: 'Testimonials',
  [ROUTES.ADMIN_FAQ]: 'FAQs',
  [ROUTES.ADMIN_MEMBER_COMPANIES]: 'Member Companies',
  [ROUTES.ADMIN_CTA]: 'CTA Section',
  [ROUTES.ADMIN_FORM_SUBMISSIONS]: 'Form Submissions',
  [ROUTES.ADMIN_PLANS]: 'Plans',
  [ROUTES.ADMIN_ADDONS]: 'Add-ons',
}

// ── Nav structure ────────────────────────────────────────────────────────────
// Flat items stay flat; grouped items collapse into a dropdown.

type FlatItem = { kind: 'flat'; name: string; path: string }
type GroupItem = {
  kind: 'group'
  name: string
  items: { name: string; path: string }[]
}
type NavEntry = FlatItem | GroupItem

const navEntries: NavEntry[] = [
  { kind: 'flat', name: 'Dashboard', path: ROUTES.ADMIN },
  { kind: 'flat', name: 'Bookings', path: ROUTES.ADMIN_BOOKINGS },
  { kind: 'flat', name: 'Memberships', path: ROUTES.ADMIN_MEMBERSHIPS },
  {
    kind: 'group',
    name: 'Content',
    items: [
      { name: 'Hero', path: ROUTES.ADMIN_HERO },
      { name: 'Membership', path: ROUTES.ADMIN_MEMBERSHIP },
      { name: 'Spaces', path: ROUTES.ADMIN_SPACES },
      { name: 'Amenities', path: ROUTES.ADMIN_AMENITIES },
      { name: 'Locations', path: ROUTES.ADMIN_LOCATIONS },
      { name: 'Book Tour', path: ROUTES.ADMIN_BOOK_TOUR },
      { name: 'Testimonials', path: ROUTES.ADMIN_TESTIMONIALS },
      { name: 'FAQs', path: ROUTES.ADMIN_FAQ },
      { name: 'Member Companies', path: ROUTES.ADMIN_MEMBER_COMPANIES },
      { name: 'Form Submissions', path: ROUTES.ADMIN_FORM_SUBMISSIONS },
    ],
  },
  {
    kind: 'group',
    name: 'Settings',
    items: [
      { name: 'Plans', path: ROUTES.ADMIN_PLANS },
      { name: 'Add-ons', path: ROUTES.ADMIN_ADDONS },
      { name: 'Pricing', path: ROUTES.ADMIN_PRICING },
      { name: 'Site Stats', path: ROUTES.ADMIN_SITE_STATS },
    ],
  },
]

// ── Dropdown component ────────────────────────────────────────────────────────
function NavDropdown({
  entry,
  currentPath,
}: {
  entry: GroupItem
  currentPath: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = entry.items.some((i) => i.path === currentPath)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 px-3 py-1.5 text-sm rounded-sm transition-colors duration-200',
          isActive
            ? 'text-fg-1 bg-clay-soft font-medium'
            : 'text-fg-2 hover:text-fg-1 hover:bg-clay-soft/50'
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {entry.name}
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            'absolute left-0 top-full mt-1.5 min-w-[160px] z-50',
            'bg-[rgba(243,239,231,0.97)] backdrop-blur-md',
            'border border-rule rounded-sm shadow-soft',
            'py-1 flex flex-col'
          )}
          role="menu"
        >
          {entry.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                'px-3 py-2 text-sm no-underline transition-colors duration-150',
                currentPath === item.path
                  ? 'text-fg-1 bg-clay-soft font-medium'
                  : 'text-fg-2 hover:text-fg-1 hover:bg-clay-soft/50'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ── AdminLayout ───────────────────────────────────────────────────────────────
export function AdminLayout() {
  const { pathname } = useLocation()
  const session = typeof window !== 'undefined' ? getAdminSession() : null
  const [bookingToast, setBookingToast] = useState<NewBookingEvent | null>(null)

  useEffect(() => {
    const title = pageTitles[pathname]
    if (title) document.title = `${title} | CreatrixSpace Admin`
  }, [pathname])
  const [membershipToast, setMembershipToast] =
    useState<MembershipEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const offBooking = onNewBooking((b) => {
      setBookingToast(b)
      setTimeout(() => setBookingToast(null), 6000)
    })
    const offMembership = onNewMembership((m) => {
      setMembershipToast(m)
      setTimeout(() => setMembershipToast(null), 6000)
    })
    return () => {
      offBooking()
      offMembership()
    }
  }, [])

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      {/* ── Toast stack ── */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {bookingToast && (
          <div className="bg-moss text-white rounded-sm shadow-soft p-4 w-80">
            <div className="font-semibold">New booking confirmed</div>
            <div className="text-caption text-fg-on-ink-2 mt-1">
              {bookingToast.customerName} — {bookingToast.planName || 'Plan'} —
              NPR{' '}
              {(bookingToast.amount / 100).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        )}
        {membershipToast && (
          <div className="bg-clay text-white rounded-sm shadow-soft p-4 w-80">
            <div className="font-semibold">New membership</div>
            <div className="text-caption opacity-90 mt-1">
              {membershipToast.customerName} — {membershipToast.membershipType}
            </div>
          </div>
        )}
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-rule bg-[rgba(243,239,231,0.86)] backdrop-blur-md saturate-[1.4]">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.ADMIN} className="no-underline">
              <div className="font-display text-[22px] tracking-[-0.01em] text-fg-1 leading-none">
                Creatrix<em className="text-clay">Space</em>
                <span className="text-label text-fg-3 ml-1.5 tracking-normal font-body">
                  Admin
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navEntries.map((entry) =>
                entry.kind === 'flat' ? (
                  <Link
                    key={entry.name}
                    to={entry.path}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-sm transition-colors duration-200 no-underline',
                      pathname === entry.path
                        ? 'text-fg-1 bg-clay-soft font-medium'
                        : 'text-fg-2 hover:text-fg-1 hover:bg-clay-soft/50'
                    )}
                  >
                    {entry.name}
                  </Link>
                ) : (
                  <NavDropdown
                    key={entry.name}
                    entry={entry}
                    currentPath={pathname}
                  />
                )
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-caption text-fg-3 hidden sm:block">
              {session?.email}
            </span>
            <Button
              size="sm"
              variant="ghost"
              href={ROUTES.HOME}
              text="Visit site"
            />
            <Button
              size="sm"
              variant="dark"
              text="Logout"
              onClick={() => {
                logoutAdmin()
                window.location.href = '/'
              }}
            />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}
