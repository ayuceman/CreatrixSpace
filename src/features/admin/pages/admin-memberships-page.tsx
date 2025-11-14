import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMemberships, updateMembership, type MembershipEvent } from '@/lib/membership-events'
import { MEMBERSHIP_STATUS } from '@/lib/constants'

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'expired': return 'bg-gray-500'
    case 'cancelled': return 'bg-red-500'
    case 'pending': return 'bg-yellow-500'
    case 'suspended': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

function getStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function isExpired(endDate: string): boolean {
  return new Date(endDate) < new Date()
}

export function AdminMembershipsPage() {
  const [query, setQuery] = useState('')
  const [memberships, setMemberships] = useState<MembershipEvent[]>([])
  const [selectedMembership, setSelectedMembership] = useState<MembershipEvent | null>(null)

  useEffect(() => {
    loadMemberships()
  }, [])

  const loadMemberships = () => {
    const data = getMemberships()
    // Auto-expire memberships
    const updated = data.map((m) => {
      if (m.status === 'active' && isExpired(m.endDate)) {
        updateMembership(m.id, { status: 'expired' })
        return { ...m, status: 'expired' as const }
      }
      return m
    })
    setMemberships(updated)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return memberships
    return memberships.filter((m) =>
      [m.customerName, m.email, m.phone, m.membershipType, m.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [memberships, query])

  const handleStatusChange = (id: string, newStatus: string) => {
    updateMembership(id, { status: newStatus as any })
    loadMemberships()
  }

  const stats = useMemo(() => {
    return {
      total: memberships.length,
      active: memberships.filter((m) => m.status === 'active').length,
      expired: memberships.filter((m) => m.status === 'expired').length,
      pending: memberships.filter((m) => m.status === 'pending').length,
    }
  }, [memberships])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Memberships</h1>
        <Button variant="outline" onClick={loadMemberships}>Refresh</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Expired</div>
            <div className="text-2xl font-bold text-gray-600">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input 
          placeholder="Search name, email, type, status..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
      </div>

      <Separator />

      {/* List */}
      <div className="grid gap-4">
        {filtered.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* Customer */}
                <div className="md:col-span-2">
                  <div className="font-medium">{m.customerName}</div>
                  <div className="text-sm text-muted-foreground">{m.email || '—'}</div>
                  <div className="text-xs text-muted-foreground">{m.phone || '—'}</div>
                </div>

                {/* Membership Type */}
                <div>
                  <div className="text-sm font-medium capitalize">{m.membershipType.replace('-', ' ')}</div>
                  <div className="text-xs text-muted-foreground">{m.billingCycle}</div>
                </div>

                {/* Dates */}
                <div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Start: </span>
                    {new Date(m.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">End: </span>
                    {new Date(m.endDate).toLocaleDateString()}
                  </div>
                  {isExpired(m.endDate) && m.status === 'active' && (
                    <div className="text-xs text-red-600">Expired</div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <div className="text-sm font-medium">NPR {(m.amount / 100).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.autoRenew ? 'Auto-renew' : 'Manual'}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col gap-2">
                  <Badge className={`${getStatusColor(m.status)} text-white w-fit`}>
                    {getStatusLabel(m.status)}
                  </Badge>
                  <select 
                    className="text-xs border rounded px-2 py-1"
                    value={m.status}
                    onChange={(e) => handleStatusChange(m.id, e.target.value)}
                  >
                    {Object.values(MEMBERSHIP_STATUS).map((status) => (
                      <option key={status} value={status}>{getStatusLabel(status)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {m.notes && (
                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <span className="font-medium">Notes: </span>{m.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No memberships found.</p>
        )}
      </div>
    </div>
  )
}

