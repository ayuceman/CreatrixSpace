import { Link, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { logoutAdmin, getAdminSession } from '@/lib/admin-auth'
import { useEffect, useState } from 'react'
import { onNewBooking, NewBookingEvent } from '@/lib/booking-events'
import { onNewMembership, type MembershipEvent } from '@/lib/membership-events'

export function AdminLayout() {
  const { pathname } = useLocation()
  const session = typeof window !== 'undefined' ? getAdminSession() : null
  const [bookingToast, setBookingToast] = useState<NewBookingEvent | null>(null)
  const [membershipToast, setMembershipToast] = useState<MembershipEvent | null>(null)

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
      {bookingToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white rounded-md shadow-lg p-4 w-80">
          <div className="font-semibold">New booking confirmed</div>
          <div className="text-xs opacity-90 mt-1">
            {bookingToast.customerName} — {bookingToast.planName || 'Plan'} — NPR {(bookingToast.amount/100).toLocaleString()}
          </div>
          <div className="text-[10px] opacity-70 mt-1">{new Date(bookingToast.createdAt).toLocaleString()}</div>
        </div>
      )}
      {membershipToast && (
        <div className="fixed top-16 right-4 z-50 bg-blue-600 text-white rounded-md shadow-lg p-4 w-80">
          <div className="font-semibold">New membership created</div>
          <div className="text-xs opacity-90 mt-1">
            {membershipToast.customerName} — {membershipToast.membershipType.replace('-', ' ')} — NPR {(membershipToast.amount/100).toLocaleString()}
          </div>
          <div className="text-[10px] opacity-70 mt-1">
            Ends: {new Date(membershipToast.endDate).toLocaleDateString()}
          </div>
        </div>
      )}
      <header className="border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link to={ROUTES.ADMIN} className="font-semibold">Admin</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link to={ROUTES.ADMIN} className={pathname === ROUTES.ADMIN ? 'text-primary' : 'text-muted-foreground'}>Dashboard</Link>
              <Link to={ROUTES.ADMIN_BOOKINGS} className={pathname === ROUTES.ADMIN_BOOKINGS ? 'text-primary' : 'text-muted-foreground'}>Bookings</Link>
              <Link to={ROUTES.ADMIN_MEMBERSHIPS} className={pathname === ROUTES.ADMIN_MEMBERSHIPS ? 'text-primary' : 'text-muted-foreground'}>Memberships</Link>
              <Link to={ROUTES.ADMIN_PRICING} className={pathname === ROUTES.ADMIN_PRICING ? 'text-primary' : 'text-muted-foreground'}>Pricing</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{session?.email}</span>
            <Button size="sm" variant="ghost" asChild>
              <Link to={ROUTES.HOME}>View site</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => { logoutAdmin(); window.location.href = '/' }}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}


