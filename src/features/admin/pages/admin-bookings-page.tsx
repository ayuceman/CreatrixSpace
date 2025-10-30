import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

type AdminBooking = {
  id: string
  customerName: string
  email?: string
  phone?: string
  locationName: string
  planName: string
  amount: number // in paisa
  status: string
  createdAt: string
}

function readBookings(): AdminBooking[] {
  try {
    const raw = localStorage.getItem('bookings')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function AdminBookingsPage() {
  const [query, setQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBooking[]>([])

  useEffect(() => {
    const data = readBookings()
    setBookings(data)

    // derive simple metrics for dashboard
    const total = data.length
    const revenue = data.reduce((sum, b) => sum + (b.amount || 0), 0) / 100
    const pending = data.filter((b) => /pending/i.test(b.status)).length
    localStorage.setItem('bookings_count', String(total))
    localStorage.setItem('bookings_revenue_npr', String(revenue))
    localStorage.setItem('bookings_pending', String(pending))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return bookings
    return bookings.filter((b) =>
      [b.customerName, b.email, b.phone, b.locationName, b.planName, b.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [bookings, query])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <div className="max-w-md">
        <Input placeholder="Search name, email, plan, status..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Separator />
      <div className="grid gap-4">
        {filtered.map((b) => (
          <Card key={b.id} className="">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
              <div>
                <div className="font-medium">{b.customerName}</div>
                <div className="text-muted-foreground">{b.email || '—'}</div>
              </div>
              <div>
                <div>{b.locationName}</div>
                <div className="text-muted-foreground">{b.planName}</div>
              </div>
              <div>
                <div>NPR {(b.amount / 100).toLocaleString()}</div>
                <div className="text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <div className="uppercase tracking-wide text-xs">{b.status}</div>
              <div className="text-muted-foreground">{b.phone || '—'}</div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No bookings found.</p>
        )}
      </div>
    </div>
  )
}


