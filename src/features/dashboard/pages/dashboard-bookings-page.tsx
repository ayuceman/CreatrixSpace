import { useEffect, useState } from 'react'
import { authService, bookingService } from '@/services/supabase-service'
import type { Database } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  locations?: { name: string }
  plans?: { name: string }
}

const STATUS_COLORS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
}

export function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        let allBookings: Booking[] = []

        try {
          const user = await authService.getCurrentUser()
          if (user) {
            allBookings = await bookingService.getUserBookings(user.id)
          }
        } catch {}

        const storedId = localStorage.getItem('lastBookingId')
        if (storedId) {
          try {
            const stored = await bookingService.getBooking(storedId)
            if (stored && !allBookings.some((b) => b.id === stored.id)) {
              allBookings.unshift(stored)
            }
          } catch {}
        }

        setBookings(allBookings)
      } catch (err) {
        console.error('Failed to load bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Bookings</h2>
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-clay/20 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-fg-2">No bookings yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const contactInfo: any = b.contact_info
            const name =
              contactInfo?.customerName ||
              contactInfo?.firstName + ' ' + (contactInfo?.lastName || '') ||
              'Booking'
            return (
              <Card key={b.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {name}
                    </CardTitle>
                    <p className="text-sm text-fg-2 mt-1">
                      {formatDate(b.start_date, 'long')}
                      {b.start_date !== b.end_date &&
                        ` — ${formatDate(b.end_date, 'long')}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={STATUS_COLORS[b.status] || 'default'}>
                      {b.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatCurrency(b.total_amount * 100, b.currency)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-fg-2">
                    {b.locations?.name && (
                      <span>Location: {b.locations.name}</span>
                    )}
                    {b.plans?.name && <span>Plan: {b.plans.name}</span>}
                    {b.start_time && (
                      <span>
                        {b.start_time}
                        {b.end_time && ` — ${b.end_time}`}
                      </span>
                    )}
                    {b.payment_method && (
                      <span>
                        Method:{' '}
                        <span className="capitalize">{b.payment_method}</span>
                      </span>
                    )}
                    {b.payment_status && (
                      <span>
                        Payment:{' '}
                        <span className="capitalize">{b.payment_status}</span>
                      </span>
                    )}
                    {b.stripe_session_id && (
                      <span>Stripe: {b.stripe_session_id.slice(0, 16)}...</span>
                    )}
                    {b.esewa_transaction_id && (
                      <span>eSewa: {b.esewa_transaction_id}</span>
                    )}
                    {b.khalti_transaction_id && (
                      <span>Khalti: {b.khalti_transaction_id}</span>
                    )}
                    {b.payment_method === 'bank_transfer' && (
                      <span>Bank Transfer</span>
                    )}
                    {b.start_date >= today && b.status === 'confirmed' && (
                      <span className="text-green-600 font-medium">
                        Upcoming
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
