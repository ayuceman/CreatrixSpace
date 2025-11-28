import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMemberships, updateMembership, deleteMembership, type MembershipEvent } from '@/lib/membership-events'
import { MEMBERSHIP_STATUS } from '@/lib/constants'
import { bookingService, addOnService, locationService, manualEntryService } from '@/services/supabase-service'
import { transformBookingsToAdmin, type AdminBookingRecord } from '@/features/admin/utils/admin-bookings'
import { Trash2 } from 'lucide-react'

type MembershipRow = AdminBookingRecord & {
  billingCycle?: string
  autoRenew?: boolean
  source: 'booking' | 'manual' | 'local_event'
  eventId?: string
  manualEntryId?: string
}

const MONTH_IN_DAYS = 28

const getStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1)

const durationInDays = (record: { startDate?: string; endDate?: string }) => {
  if (!record.startDate || !record.endDate) return null
  const start = new Date(record.startDate)
  const end = new Date(record.endDate)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const formatCountdown = (endDate?: string) => {
  if (!endDate) return { label: 'No end date', variant: 'secondary' as const }
  const end = new Date(endDate)
  const diffMs = end.getTime() - Date.now()
  if (diffMs <= 0) {
    const daysAgo = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    return { label: `Expired ${daysAgo}d ago`, variant: 'destructive' as const }
  }
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let variant: 'secondary' | 'destructive' | 'default' = 'default'
  if (days <= 7) variant = 'destructive'
  else if (days <= 14) variant = 'secondary'
  return { label: `${days}d ${hours}h left`, variant }
}

const normalizeAddOns = (addOns?: AdminBookingRecord['addOns']) => ({
  selectedAddOns: addOns?.selectedAddOns ?? [],
  meetingRoomHours: addOns?.meetingRoomHours ?? 0,
  guestPasses: addOns?.guestPasses ?? 0,
})

const mapMembershipEventToRow = (
  membership: MembershipEvent,
  locationLookup: Record<string, string>
): MembershipRow => ({
  id: `event-${membership.id}`,
  eventId: membership.id,
  source: 'local_event',
  customerName: membership.customerName,
  email: membership.email,
  phone: membership.phone,
  locationId: membership.locationId,
  locationName: membership.locationId ? locationLookup[membership.locationId] || 'Location' : 'Location',
  planId: membership.membershipType,
  planName: membership.membershipType,
  roomName: null,
  amount: membership.amount,
  status: membership.status,
  createdAt: membership.createdAt,
  addOns: normalizeAddOns(),
  notes: membership.notes,
  startDate: membership.startDate,
  endDate: membership.endDate,
  startTime: undefined,
  endTime: undefined,
  billingCycle: membership.billingCycle,
  autoRenew: membership.autoRenew,
})

export function AdminMembershipsPage() {
  const [query, setQuery] = useState('')
  const [memberships, setMemberships] = useState<MembershipRow[]>([])
  const [loading, setLoading] = useState(true)
  const [locationLookup, setLocationLookup] = useState<Record<string, string>>({})

  const loadMemberships = async () => {
    setLoading(true)
    try {
      const [
        bookingsData,
        addOnsData,
        storedMemberships,
        locations,
        manualMembershipEntries,
        manualBookingEntries,
      ] = await Promise.all([
        bookingService.getAllBookings(),
        addOnService.getAllAddOns(),
        Promise.resolve(getMemberships()),
        locationService.getAllLocations(),
        manualEntryService.getEntries('membership'),
        manualEntryService.getEntries('booking'),
      ])

      const locationMap = locations.reduce<Record<string, string>>((acc, loc) => {
        acc[loc.id] = loc.name
        return acc
      }, {})
      setLocationLookup(locationMap)

      const manualBookingRecords: AdminBookingRecord[] = manualBookingEntries.map((entry) => {
        const data = entry.data as AdminBookingRecord
        return {
          ...data,
          id: entry.id,
          manualEntryId: entry.id,
          source: 'manual',
          addOns: normalizeAddOns(data.addOns),
        }
      })

      const normalizedBookings = [...manualBookingRecords, ...transformBookingsToAdmin(bookingsData, addOnsData)]

      const bookingRows = normalizedBookings
        .filter((record) => {
          const duration = durationInDays(record)
          return duration !== null && duration >= MONTH_IN_DAYS
        })
        .map<MembershipRow>((record) => ({
          ...record,
          billingCycle: 'monthly',
          autoRenew: false,
          source: record.source === 'manual' ? 'manual' : 'booking',
          addOns: normalizeAddOns(record.addOns),
        }))

      const localRows = storedMemberships
        .filter((m) => m.billingCycle !== 'daily')
        .map((m) => mapMembershipEventToRow(m, locationMap))

      const manualRows = manualMembershipEntries.map((entry) => {
        const data = entry.data as MembershipRow
        return {
          ...data,
          id: entry.id,
          manualEntryId: entry.id,
          source: 'manual' as const,
          addOns: normalizeAddOns(data.addOns),
        }
      })

      setMemberships([...manualRows, ...localRows, ...bookingRows])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMemberships()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return memberships
    return memberships.filter((m) =>
      [
        m.customerName,
        m.email,
        m.phone,
        m.planName,
        m.locationName,
        m.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [memberships, query])

  const stats = useMemo(() => {
    return {
      total: memberships.length,
      active: memberships.filter((m) => m.status === 'active').length,
      expired: memberships.filter((m) => m.status === 'expired').length,
      pending: memberships.filter((m) => m.status === 'pending').length,
    }
  }, [memberships])

const handleStatusChange = async (row: MembershipRow, newStatus: string) => {
  if (row.source === 'manual' && row.manualEntryId) {
    await manualEntryService.updateEntry(row.manualEntryId, { ...row, status: newStatus })
    loadMemberships()
    return
  }
  if (row.source === 'local_event' && row.eventId) {
    updateMembership(row.eventId, { status: newStatus as any })
    loadMemberships()
  }
}

const handleRenew = async (row: MembershipRow) => {
    const duration = durationInDays(row) || 30
    const start = row.endDate ? new Date(row.endDate) : new Date()
    const end = new Date(start)
    end.setDate(end.getDate() + duration)
  await manualEntryService.addEntry({
    entryType: 'membership',
    data: {
    id: '',
    customerName: row.customerName,
    email: row.email,
    phone: row.phone,
    planName: row.planName,
    membershipType: row.planName,
    roomName: row.roomName || undefined,
    status: 'active',
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    amount: row.amount,
    billingCycle: row.billingCycle === 'annual' ? 'annual' : 'monthly',
    locationId: row.locationId,
    locationName: row.locationName,
    autoRenew: false,
    createdAt: new Date().toISOString(),
      notes: `Renewed from ${row.id}`,
      addOns: normalizeAddOns(row.addOns),
    },
  })
  loadMemberships()
  }

const handleDeleteMembershipRow = async (row: MembershipRow) => {
  if (!confirm('Delete this membership record?')) return
  try {
    if (row.source === 'manual' && row.manualEntryId) {
      await manualEntryService.deleteEntry(row.manualEntryId)
    } else if (row.source === 'booking') {
      await bookingService.deleteBooking(row.id)
    } else if (row.source === 'local_event' && row.eventId) {
      deleteMembership(row.eventId)
    }
    await loadMemberships()
  } catch (err) {
    console.error('Failed to delete membership record', err)
    alert('Failed to delete membership. Please try again.')
  }
}

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Memberships</h1>
        <Button variant="outline" onClick={loadMemberships}>Refresh</Button>
      </div>

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

      <div className="max-w-md">
        <Input 
          placeholder="Search name, email, type, status..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
      </div>

      <Separator />

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading memberships...</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((m) => {
            const countdown = formatCountdown(m.endDate)
            const duration = durationInDays(m)
            return (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{m.customerName}</div>
                      <div className="text-muted-foreground text-xs">{m.email || '—'}</div>
                      <div className="text-muted-foreground text-xs">{m.phone || '—'}</div>
                    </div>
                    <div>
                      <div className="font-medium">{m.locationName}</div>
                      <div className="text-muted-foreground text-xs">{m.planName}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Room: {m.roomName || 'Not assigned'}
                    </div>
                      {duration !== null && (
                        <div className="text-muted-foreground text-xs mt-1">
                          Duration: {duration} days
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        NPR {(m.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {m.billingCycle?.replace('-', ' ')}
                      </div>
                    </div>
                    <div>
                      {m.startDate && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Start: </span>
                          {new Date(m.startDate).toLocaleDateString()}
                        </div>
                      )}
                      {m.endDate && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">End: </span>
                          {new Date(m.endDate).toLocaleDateString()}
                        </div>
                      )}
                      <Badge variant={countdown.variant} className="mt-2 w-fit">
                        {countdown.label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={m.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                        {getStatusLabel(m.status)}
                      </Badge>
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={m.status}
                        onChange={(e) => handleStatusChange(m, e.target.value)}
                        disabled={m.source === 'booking'}
                      >
                        {Object.values(MEMBERSHIP_STATUS).map((status) => (
                          <option key={status} value={status}>{getStatusLabel(status)}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleRenew(m)}>
                        Renew Package
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteMembershipRow(m)}
                          title="Delete membership"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {(m.addOns.selectedAddOns.length > 0 ||
                    m.addOns.meetingRoomHours > 0 ||
                    m.addOns.guestPasses > 0 ||
                    m.notes) && (
                    <div className="pt-3 border-t space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Details</div>
                      <div className="flex flex-wrap gap-2">
                        {m.addOns.selectedAddOns.map((addOn, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {addOn}
                          </Badge>
                        ))}
                        {m.addOns.meetingRoomHours > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Meeting Room: {m.addOns.meetingRoomHours}h
                          </Badge>
                        )}
                        {m.addOns.guestPasses > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Guest Passes: {m.addOns.guestPasses}
                          </Badge>
                        )}
                      </div>
                      {m.notes && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          {m.notes}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No memberships found.</p>
          )}
        </div>
      )}
    </div>
  )
}
