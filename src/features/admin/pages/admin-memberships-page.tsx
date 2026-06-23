import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getMemberships,
  updateMembership,
  deleteMembership,
  type MembershipEvent,
} from '@/lib/membership-events'
import { MEMBERSHIP_STATUS } from '@/lib/constants'
import {
  bookingService,
  addOnService,
  locationService,
  manualEntryService,
} from '@/services/supabase-service'
import {
  transformBookingsToAdmin,
  type AdminBookingRecord,
} from '@/features/admin/utils/admin-bookings'
import {
  Plus,
  Trash2,
  Download,
  Filter,
  SortAsc,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Loader2,
  Edit,
} from 'lucide-react'
import { showToast } from '@/components/ui/toast'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'

type MembershipRow = AdminBookingRecord & {
  billingCycle?: string
  autoRenew?: boolean
  source: 'booking' | 'manual' | 'local_event'
  eventId?: string
  manualEntryId?: string
}

const MONTH_IN_DAYS = 28

const getStatusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1)

const durationInDays = (record: { startDate?: string; endDate?: string }) => {
  if (!record.startDate || !record.endDate) return null
  const start = new Date(record.startDate)
  const end = new Date(record.endDate)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const formatCountdown = (endDate?: string) => {
  if (!endDate)
    return {
      label: 'No end date',
      variant: 'secondary' as const,
      color: 'gray',
    }
  const end = new Date(endDate)
  const diffMs = end.getTime() - Date.now()
  if (diffMs <= 0) {
    const daysAgo = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    return {
      label: `Expired ${daysAgo}d ago`,
      variant: 'destructive' as const,
      color: 'red',
    }
  }
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days <= 7)
    return {
      label: `${days}d ${hours}h left`,
      variant: 'destructive' as const,
      color: 'red',
    }
  if (days <= 14)
    return {
      label: `${days}d ${hours}h left`,
      variant: 'secondary' as const,
      color: 'amber',
    }
  return {
    label: `${days}d ${hours}h left`,
    variant: 'default' as const,
    color: 'green',
  }
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
  locationName: membership.locationId
    ? locationLookup[membership.locationId] || 'Location'
    : 'Location',
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
  const [showManualForm, setShowManualForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MembershipRow | null>(null)
  const [manualForm, setManualForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    locationName: '',
    planName: '',
    roomName: '',
    amountNpr: '',
    startDate: '',
    endDate: '',
    billingCycle: 'monthly' as 'monthly' | 'annual',
    addOns: '',
    meetingRoomHours: '',
    guestPasses: '',
    notes: '',
  })
  const [locationLookup, setLocationLookup] = useState<Record<string, string>>(
    {}
  )
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'expiry' | 'name'>('expiry')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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

      const locationMap = locations.reduce<Record<string, string>>(
        (acc, loc) => {
          acc[loc.id] = loc.name
          return acc
        },
        {}
      )
      const manualBookingRecords: AdminBookingRecord[] =
        manualBookingEntries.map((entry) => {
          const data = entry.data as AdminBookingRecord
          return {
            ...data,
            id: entry.id,
            manualEntryId: entry.id,
            source: 'manual',
            addOns: normalizeAddOns(data.addOns),
          }
        })

      const normalizedBookings = [
        ...manualBookingRecords,
        ...transformBookingsToAdmin(bookingsData, addOnsData),
      ]

      const bookingRows = normalizedBookings
        .filter((record) => {
          const duration = durationInDays(record)
          // Include all bookings with dates set, regardless of duration
          return duration !== null
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
    let result = [...memberships]

    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter((m) =>
        [m.customerName, m.email, m.phone, m.planName, m.locationName, m.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'expiry':
          const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity
          const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity
          comparison = aEnd - bEnd
          break
        case 'name':
          comparison = a.customerName.localeCompare(b.customerName)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [memberships, query, statusFilter, sortBy, sortOrder])

  const stats = useMemo(() => {
    const total = memberships.length
    const active = memberships.filter((m) => m.status === 'active').length
    const expired = memberships.filter((m) => m.status === 'expired').length
    const pending = memberships.filter((m) => m.status === 'pending').length
    const expiringSoon = memberships.filter((m) => {
      if (!m.endDate) return false
      const daysLeft = Math.floor(
        (new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      return daysLeft > 0 && daysLeft <= 14
    }).length

    return { total, active, expired, pending, expiringSoon }
  }, [memberships])

  const handleStatusChange = async (row: MembershipRow, newStatus: string) => {
    if (row.source === 'manual' && row.manualEntryId) {
      await manualEntryService.updateEntry(row.manualEntryId, {
        ...row,
        status: newStatus,
      })
      loadMemberships()
      return
    }
    if (row.source === 'local_event' && row.eventId) {
      updateMembership(row.eventId, { status: newStatus as any })
      loadMemberships()
    }
  }

  const handleEditMembership = async (row: MembershipRow) => {
    const newCustomerName = prompt('Customer Name:', row.customerName)
    if (!newCustomerName) return

    const newEmail = prompt('Email:', row.email || '')
    const newPhone = prompt('Phone:', row.phone || '')
    const newAmount = prompt('Amount (NPR):', String(row.amount / 100))
    const newNotes = prompt('Notes:', row.notes || '')

    const updatedRow: MembershipRow = {
      ...row,
      customerName: newCustomerName,
      email: newEmail || undefined,
      phone: newPhone || undefined,
      amount: newAmount ? Math.round(Number(newAmount) * 100) : row.amount,
      notes: newNotes || undefined,
    }

    if (row.source === 'manual' && row.manualEntryId) {
      await manualEntryService.updateEntry(row.manualEntryId, updatedRow)
    } else if (row.source === 'local_event' && row.eventId) {
      updateMembership(row.eventId, {
        customerName: updatedRow.customerName,
        email: updatedRow.email,
        phone: updatedRow.phone,
        amount: updatedRow.amount,
        notes: updatedRow.notes,
      })
    }

    await loadMemberships()
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
    setDeleteTarget(row)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const row = deleteTarget
    setDeleteTarget(null)
    try {
      if (row.source === 'manual' && row.manualEntryId) {
        await manualEntryService.deleteEntry(row.manualEntryId)
      } else if (row.source === 'booking') {
        await bookingService.deleteBooking(row.id)
      } else if (row.source === 'local_event' && row.eventId) {
        deleteMembership(row.eventId)
      }
      await loadMemberships()
      showToast('Membership deleted', 'success')
    } catch (err) {
      console.error('Failed to delete membership record', err)
      showToast('Failed to delete membership. Please try again.', 'error')
    }
  }

  const handleManualMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !manualForm.customerName ||
      !manualForm.locationName ||
      !manualForm.planName
    ) {
      showToast(
        'Please fill in customer, location, and plan information.',
        'error'
      )
      return
    }

    const startDate =
      manualForm.startDate || new Date().toISOString().split('T')[0]
    const durationDays = manualForm.billingCycle === 'annual' ? 365 : 30
    const end = new Date(startDate)
    end.setDate(end.getDate() + durationDays)
    const endDate = manualForm.endDate || end.toISOString().split('T')[0]

    const payload = {
      id: '',
      customerName: manualForm.customerName,
      email: manualForm.email || undefined,
      phone: manualForm.phone || undefined,
      locationName: manualForm.locationName,
      planName: manualForm.planName,
      roomName: manualForm.roomName || undefined,
      amount: Math.round(Number(manualForm.amountNpr || 0) * 100),
      status: 'active',
      createdAt: new Date().toISOString(),
      startDate,
      endDate,
      billingCycle: manualForm.billingCycle,
      autoRenew: false,
      addOns: {
        selectedAddOns: manualForm.addOns
          ? manualForm.addOns
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        meetingRoomHours: Number(manualForm.meetingRoomHours || 0),
        guestPasses: Number(manualForm.guestPasses || 0),
      },
      notes: manualForm.notes || undefined,
      source: 'manual' as const,
    }

    try {
      const inserted = await manualEntryService.addEntry({
        entryType: 'membership',
        data: payload,
      })

      setMemberships((prev) => [
        {
          ...payload,
          id: inserted.id,
          manualEntryId: inserted.id,
          addOns: normalizeAddOns(payload.addOns),
        },
        ...prev,
      ])

      setManualForm({
        customerName: '',
        email: '',
        phone: '',
        locationName: '',
        planName: '',
        roomName: '',
        amountNpr: '',
        startDate: '',
        endDate: '',
        billingCycle: 'monthly',
        addOns: '',
        meetingRoomHours: '',
        guestPasses: '',
        notes: '',
      })
      setShowManualForm(false)
      showToast('Membership added successfully', 'success')
    } catch (err) {
      console.error('Failed to add membership:', err)
      showToast('Failed to add membership. Please try again.', 'error')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Customer',
      'Email',
      'Phone',
      'Location',
      'Plan',
      'Amount (NPR)',
      'Status',
      'Start Date',
      'End Date',
      'Days Left',
    ]
    const rows = filtered.map((m) => {
      const daysLeft = m.endDate
        ? Math.floor(
            (new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : ''
      return [
        new Date(m.createdAt).toLocaleDateString(),
        m.customerName,
        m.email || '',
        m.phone || '',
        m.locationName,
        m.planName,
        (m.amount / 100).toFixed(2),
        m.status,
        m.startDate ? new Date(m.startDate).toLocaleDateString() : '',
        m.endDate ? new Date(m.endDate).toLocaleDateString() : '',
        daysLeft,
      ]
    })

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memberships-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-normal">Memberships</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowManualForm((prev) => !prev)}
          >
            <Plus className="h-4 w-4 mr-1" />
            {showManualForm ? 'Close' : 'Add Membership'}
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={loadMemberships}>
            Refresh
          </Button>
        </div>
      </div>

      {showManualForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-lg">Manual Membership Entry</h2>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={handleManualMembershipSubmit}
            >
              <Input
                required
                placeholder="Customer name *"
                value={manualForm.customerName}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, customerName: e.target.value }))
                }
              />
              <Input
                placeholder="Email"
                value={manualForm.email}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, email: e.target.value }))
                }
              />
              <Input
                placeholder="Phone"
                value={manualForm.phone}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
              <Input
                required
                placeholder="Location name *"
                value={manualForm.locationName}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, locationName: e.target.value }))
                }
              />
              <Input
                required
                placeholder="Plan name *"
                value={manualForm.planName}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, planName: e.target.value }))
                }
              />
              <Input
                placeholder="Room name (optional)"
                value={manualForm.roomName}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, roomName: e.target.value }))
                }
              />
              <Input
                placeholder="Amount (NPR)"
                type="number"
                min="0"
                value={manualForm.amountNpr}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, amountNpr: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={manualForm.startDate}
                  onChange={(e) =>
                    setManualForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
                <Input
                  type="date"
                  value={manualForm.endDate}
                  onChange={(e) =>
                    setManualForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
              </div>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={manualForm.billingCycle}
                onChange={(e) =>
                  setManualForm((p) => ({
                    ...p,
                    billingCycle: e.target.value as 'monthly' | 'annual',
                  }))
                }
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
              <Input
                placeholder="Add-ons (comma separated)"
                value={manualForm.addOns}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, addOns: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Meeting room hours"
                  value={manualForm.meetingRoomHours}
                  onChange={(e) =>
                    setManualForm((p) => ({
                      ...p,
                      meetingRoomHours: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Guest passes"
                  value={manualForm.guestPasses}
                  onChange={(e) =>
                    setManualForm((p) => ({
                      ...p,
                      guestPasses: e.target.value,
                    }))
                  }
                />
              </div>
              <Textarea
                className="md:col-span-2"
                placeholder="Notes"
                value={manualForm.notes}
                onChange={(e) =>
                  setManualForm((p) => ({ ...p, notes: e.target.value }))
                }
              />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Save Membership</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-fg-2">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-fg-2">Active</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-fg-2">Expired</div>
            <div className="text-2xl font-bold text-gray-600">
              {stats.expired}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-fg-2">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
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

      {/* Memberships List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading memberships...
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => {
            const countdown = formatCountdown(m.endDate)
            const duration = durationInDays(m)

            return (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{m.customerName}</div>
                      <div className="text-fg-2 text-xs">{m.email || '—'}</div>
                      <div className="text-fg-2 text-xs">{m.phone || '—'}</div>
                    </div>
                    <div>
                      <div className="font-medium">{m.locationName}</div>
                      <div className="text-fg-2 text-xs">{m.planName}</div>
                      <div className="text-fg-2 text-xs mt-1">
                        Room: {m.roomName || 'Not assigned'}
                      </div>
                      {duration !== null && (
                        <div className="text-fg-2 text-xs mt-1">
                          Duration: {duration} days
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        NPR{' '}
                        {(m.amount / 100).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-fg-2 text-xs">
                        {m.billingCycle?.replace('-', ' ')}
                      </div>
                    </div>
                    <div>
                      {m.startDate && (
                        <div className="text-xs">
                          <span className="text-fg-2">Start: </span>
                          {new Date(m.startDate).toLocaleDateString()}
                        </div>
                      )}
                      {m.endDate && (
                        <div className="text-xs">
                          <span className="text-fg-2">End: </span>
                          {new Date(m.endDate).toLocaleDateString()}
                        </div>
                      )}
                      <Badge variant={countdown.variant} className="mt-2 w-fit">
                        {countdown.label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={
                          m.status === 'active' ? 'default' : 'secondary'
                        }
                        className="w-fit"
                      >
                        {getStatusLabel(m.status)}
                      </Badge>
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={m.status}
                        onChange={(e) => handleStatusChange(m, e.target.value)}
                        disabled={m.source === 'booking'}
                      >
                        {Object.values(MEMBERSHIP_STATUS).map((status) => (
                          <option key={status} value={status}>
                            {getStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMembership(m)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRenew(m)}
                        >
                          Renew Package
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteMembershipRow(m)}
                          title="Delete membership"
                        >
                          <Trash2 className="h-4 w-4 text-clay-deep" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {(m.addOns.selectedAddOns.length > 0 ||
                    m.addOns.meetingRoomHours > 0 ||
                    m.addOns.guestPasses > 0 ||
                    m.notes) && (
                    <div className="pt-3 border-t space-y-2">
                      <div className="text-xs font-medium text-fg-2">
                        Details
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.addOns.selectedAddOns.map((addOn, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
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
                        <div className="text-xs text-fg-2 bg-bg-band/50 p-2 rounded">
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
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No memberships found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Try adjusting your filters or search query
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Membership"
        message={`Delete membership for "${deleteTarget?.customerName}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
