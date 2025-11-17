import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export function AdminDashboardPage() {
  // Mock metrics; in real app fetch from API
  const metrics = {
    totalBookings: Number(localStorage.getItem('bookings_count') || 0),
    revenueNpr: Number(localStorage.getItem('bookings_revenue_npr') || 0),
    pendingPayments: Number(localStorage.getItem('bookings_pending') || 0),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric label="Total Bookings" value={metrics.totalBookings} />
        <Metric label="Revenue (NPR)" value={metrics.revenueNpr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
        <Metric label="Pending Payments" value={metrics.pendingPayments} />
      </div>
    </div>
  )
}


