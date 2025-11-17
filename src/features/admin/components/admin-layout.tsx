import { Link, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { logoutAdmin, getAdminSession } from '@/lib/admin-auth'
import { useEffect, useState } from 'react'
import { onNewBooking, NewBookingEvent } from '@/lib/booking-events'

export function AdminLayout() {
  const { pathname } = useLocation()
  const session = typeof window !== 'undefined' ? getAdminSession() : null
  const [toast, setToast] = useState<NewBookingEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const off = onNewBooking((b) => {
      setToast(b)
      const t = setTimeout(() => setToast(null), 6000)
      return () => clearTimeout(t)
    })
    return () => { off() }
  }, [])

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white rounded-md shadow-lg p-4 w-80">
          <div className="font-semibold">New booking confirmed</div>
          <div className="text-xs opacity-90 mt-1">
            {toast.customerName} — {toast.planName || 'Plan'} — NPR {(toast.amount/100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] opacity-70 mt-1">{new Date(toast.createdAt).toLocaleString()}</div>
        </div>
      )}
      <header className="border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link to={ROUTES.ADMIN} className="font-semibold">Admin</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link to={ROUTES.ADMIN} className={pathname === ROUTES.ADMIN ? 'text-primary' : 'text-muted-foreground'}>Dashboard</Link>
              <Link to={ROUTES.ADMIN_BOOKINGS} className={pathname === ROUTES.ADMIN_BOOKINGS ? 'text-primary' : 'text-muted-foreground'}>Bookings</Link>
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


