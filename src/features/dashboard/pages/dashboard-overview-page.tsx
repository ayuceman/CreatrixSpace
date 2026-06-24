import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  authService,
  bookingService,
  profileService,
} from '@/services/supabase-service'
import type { Database } from '@/lib/database.types'
import { ROUTES } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  locations?: { name: string }
  plans?: { name: string }
}
type Profile = Database['public']['Tables']['profiles']['Row']

const STATUS_COLORS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-fg-2">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

export function DashboardOverviewPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        let prof: Profile | null = null
        let allBookings: Booking[] = []

        try {
          const user = await authService.getCurrentUser()
          if (user) {
            const [p, books] = await Promise.all([
              profileService.getProfile(user.id),
              bookingService.getUserBookings(user.id),
            ])
            prof = p
            allBookings = books
          }
        } catch {
          // not logged in — still check sessionStorage below
        }

        const storedId = localStorage.getItem('lastBookingId')
        if (storedId) {
          try {
            const stored = await bookingService.getBooking(storedId)
            if (stored && !allBookings.some((b) => b.id === stored.id)) {
              allBookings = [stored, ...allBookings]
            }
          } catch {
            // booking not found or expired
          }
        }

        setProfile(prof)
        setBookings(allBookings)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter(
    (b) => b.start_date >= today && b.status !== 'cancelled'
  )
  const totalSpent = bookings
    .filter((b) => b.payment_status === 'completed')
    .reduce((sum, b) => sum + b.total_amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-clay/20 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-clay/20 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const name =
    profile?.full_name || profile?.first_name || profile?.email || 'User'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {name}</h2>
        <p className="text-fg-2 mt-1">Here's an overview of your activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric label="Total Bookings" value={bookings.length} />
        <Metric label="Upcoming" value={upcoming.length} />
        <Metric
          label="Total Spent"
          value={formatCurrency(totalSpent * 100, 'NPR')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Upcoming Bookings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.DASHBOARD_BOOKINGS)}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-fg-2 text-sm">No upcoming bookings.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-2 border-b border-rule last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {formatDate(b.start_date, 'short')}
                        {b.start_date !== b.end_date &&
                          ` - ${formatDate(b.end_date, 'short')}`}
                      </p>
                      <p className="text-xs text-fg-2">
                        {b.locations?.name ||
                          b.plans?.name ||
                          b.location_id.slice(0, 8)}
                        ...
                      </p>
                    </div>
                    <Badge variant={STATUS_COLORS[b.status] || 'default'}>
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Bookings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.DASHBOARD_BOOKINGS)}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-fg-2 text-sm">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-2 border-b border-rule last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {formatDate(b.created_at, 'short')}
                      </p>
                      <p className="text-xs text-fg-2">
                        {formatCurrency(b.total_amount * 100, b.currency)}
                      </p>
                    </div>
                    <Badge variant={STATUS_COLORS[b.status] || 'default'}>
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(ROUTES.DASHBOARD_BOOKINGS)}
        >
          <CardContent className="p-6">
            <p className="font-semibold">My Bookings</p>
            <p className="text-sm text-fg-2">
              View and manage all your bookings
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(ROUTES.DASHBOARD_PROFILE)}
        >
          <CardContent className="p-6">
            <p className="font-semibold">Profile</p>
            <p className="text-sm text-fg-2">
              Update your personal information
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(ROUTES.DASHBOARD_BILLING)}
        >
          <CardContent className="p-6">
            <p className="font-semibold">Billing</p>
            <p className="text-sm text-fg-2">
              View invoices and payment history
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
