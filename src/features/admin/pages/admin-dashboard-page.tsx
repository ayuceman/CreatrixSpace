import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { bookingService, manualEntryService } from '@/services/supabase-service'
import type { AdminBookingRecord } from '@/features/admin/utils/admin-bookings'

type MetricProps = { label: string; value: string | number; subLabel?: string }
function Metric({ label, value, subLabel }: MetricProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {subLabel && <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>}
      </CardContent>
    </Card>
  )
}

type ChartDatum = { label: string; value: number }
function BarList({ title, data }: { title: string; data: ChartDatum[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Not enough data yet.</p>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value)) || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <div className="h-2 rounded bg-muted overflow-hidden">
              <div
                className="h-full rounded bg-primary transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

type ManualEntryPayload = {
  customerName?: string
  planName?: string
  membershipType?: string
  amount?: number
  status?: string
  createdAt?: string
  created_at?: string
  locationName?: string
}

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [manualBookings, setManualBookings] = useState<ManualEntryPayload[]>([])
  const [manualMemberships, setManualMemberships] = useState<ManualEntryPayload[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [bookingRows, manualBookingRows, manualMembershipRows] = await Promise.all([
          bookingService.getAllBookings(),
          manualEntryService.getEntries('booking'),
          manualEntryService.getEntries('membership'),
        ])

        setBookings(bookingRows || [])
        setManualBookings(
          (manualBookingRows || []).map((entry) => ({
            ...(entry.data as AdminBookingRecord),
            createdAt: entry.created_at,
            status: (entry.data as AdminBookingRecord)?.status,
          }))
        )
        setManualMemberships(
          (manualMembershipRows || []).map((entry) => ({
            ...(entry.data as ManualEntryPayload),
            createdAt: entry.created_at,
          }))
        )
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const supabaseRevenue = bookings.reduce((sum, row) => sum + (row.total_amount || 0), 0)
    const manualRevenue = manualBookings.reduce((sum, row) => sum + (row.amount || 0), 0)
    const totalRevenue = (supabaseRevenue + manualRevenue) / 100

    const totalBookings = bookings.length + manualBookings.length
    const pendingPayments =
      bookings.filter((b) => String(b.status).toLowerCase() !== 'confirmed').length +
      manualBookings.filter((b) => String(b.status).toLowerCase() !== 'confirmed').length

    const activeMemberships = manualMemberships.length

    return {
      totalBookings,
      totalRevenue,
      pendingPayments,
      activeMemberships,
    }
  }, [bookings, manualBookings, manualMemberships])

  const bookingsByPlan = useMemo<ChartDatum[]>(() => {
    const counts: Record<string, number> = {}
    bookings.forEach((booking) => {
      const plan = booking.plans?.name || 'Unknown'
      counts[plan] = (counts[plan] || 0) + 1
    })
    manualBookings.forEach((booking) => {
      const plan = booking.planName || 'Manual'
      counts[plan] = (counts[plan] || 0) + 1
    })
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [bookings, manualBookings])

  const revenueByLocation = useMemo<ChartDatum[]>(() => {
    const sums: Record<string, number> = {}
    bookings.forEach((booking) => {
      const location = booking.locations?.name || 'Unknown'
      sums[location] = (sums[location] || 0) + (booking.total_amount || 0) / 100
    })
    manualBookings.forEach((booking) => {
      const location = booking.locationName || 'Manual'
      sums[location] = (sums[location] || 0) + (booking.amount || 0) / 100
    })
    return Object.entries(sums)
      .map(([label, value]) => ({ label, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [bookings, manualBookings])

  const recentManualEntries = useMemo(() => {
    const combined = [...manualBookings, ...manualMemberships]
      .map((entry) => ({
        type: (entry.membershipType || entry.planName) ? (entry.membershipType ? 'Membership' : 'Booking') : 'Manual',
        name: entry.customerName || 'Manual Entry',
        amount: entry.amount ? (entry.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—',
        createdAt: entry.createdAt || entry.created_at || '',
        status: entry.status || '—',
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return combined.slice(0, 6)
  }, [manualBookings, manualMemberships])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of live + manual entries.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading metrics…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Metric label="Total Bookings" value={metrics.totalBookings} />
            <Metric
              label="Revenue (NPR)"
              value={metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              subLabel="Includes manual entries"
            />
            <Metric label="Pending Payments" value={metrics.pendingPayments} />
            <Metric label="Manual Memberships" value={metrics.activeMemberships} subLabel="Active records" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarList title="Bookings by Plan" data={bookingsByPlan} />
            <BarList title="Revenue by Location" data={revenueByLocation} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Manual Entries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentManualEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No manual entries yet.</p>
              ) : (
                recentManualEntries.map((entry, idx) => (
                  <div
                    key={`${entry.name}-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.type} • {entry.status}
                      </p>
                    </div>
                    <div className="text-sm font-semibold">NPR {entry.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}


