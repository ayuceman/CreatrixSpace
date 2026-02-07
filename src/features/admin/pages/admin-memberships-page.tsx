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
import { Trash2, Download, Filter, SortAsc, Users, Calendar, TrendingUp, Clock, Loader2, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

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
  if (!endDate) return { label: 'No end date', variant: 'secondary' as const, color: 'gray' }
  const end = new Date(endDate)
  const diffMs = end.getTime() - Date.now()
  if (diffMs <= 0) {
    const daysAgo = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    return { label: `Expired ${daysAgo}d ago`, variant: 'destructive' as const, color: 'red' }
  }
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days <= 7) return { label: `${days}d ${hours}h left`, variant: 'destructive' as const, color: 'red' }
  if (days <= 14) return { label: `${days}d ${hours}h left`, variant: 'secondary' as const, color: 'amber' }
  return { label: `${days}d ${hours}h left`, variant: 'default' as const, color: 'green' }
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

  // Calculate stats
  const stats = useMemo(() => {
    const total = memberships.length
    const active = memberships.filter((m) => m.status === 'active').length
    const expired = memberships.filter((m) => m.status === 'expired').length
    const pending = memberships.filter((m) => m.status === 'pending').length
    const expiringSoon = memberships.filter((m) => {
      if (!m.endDate) return false
      const daysLeft = Math.floor((new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysLeft > 0 && daysLeft <= 14
    }).length

    return { total, active, expired, pending, expiringSoon }
  }, [memberships])

  const filtered = useMemo(() => {
    let result = [...memberships]

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter)
    }

    // Apply search
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter((m) =>
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
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  const exportToCSV = () => {
    const headers = ['Date', 'Customer', 'Email', 'Phone', 'Location', 'Plan', 'Amount (NPR)', 'Status', 'Start Date', 'End Date', 'Days Left']
    const rows = filtered.map(m => {
      const daysLeft = m.endDate ? Math.floor((new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : ''
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
        daysLeft
      ]
    })

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Memberships</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage member subscriptions and packages</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={loadMemberships}
            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          >
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-purple-100 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-2 border-green-100 dark:border-green-900/50 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.active}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-2 border-amber-100 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.expiringSoon}</p>
                  <p className="text-xs text-gray-500 mt-1">Within 14 days</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.expired}</p>
                  <p className="text-xs text-gray-500 mt-1">Need renewal</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-600 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <Card className="border-purple-100 dark:border-purple-900/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search name, email, phone, plan..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-purple-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-purple-200 dark:border-purple-800 rounded-md px-3 py-2 bg-white dark:bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-purple-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-purple-200 dark:border-purple-800 rounded-md px-3 py-2 bg-white dark:bg-background"
                >
                  <option value="expiry">Expiry Date</option>
                  <option value="date">Created Date</option>
                  <option value="name">Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-1 rounded-md border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memberships List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading memberships...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m, index) => {
            const countdown = formatCountdown(m.endDate)
            const duration = durationInDays(m)
            
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-2 border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Main Info Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                              {m.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">{m.customerName}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{m.email || 'No email'}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{m.phone || 'No phone'}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location & Plan</div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{m.locationName}</div>
                          <div className="text-xs text-purple-600 dark:text-purple-400">{m.planName}</div>
                          {m.roomName && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Room: {m.roomName}</div>
                          )}
                          {duration !== null && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Duration: {duration} days
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</div>
                          <div className="font-bold text-lg text-gray-900 dark:text-white">
                            NPR {(m.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {m.billingCycle?.replace('-', ' ') || 'One-time'}
                          </div>
                        </div>

                        <div>
                          {m.startDate && (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Period</div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {new Date(m.startDate).toLocaleDateString()}
                              </div>
                              {m.endDate && (
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {new Date(m.endDate).toLocaleDateString()}
                                </div>
                              )}
                              <Badge 
                                className={`mt-2 ${
                                  countdown.color === 'red' 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                    : countdown.color === 'amber'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}
                              >
                                {countdown.label}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="lg:col-span-2 flex flex-col gap-3">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Status</div>
                            <select
                              className={`text-sm border-2 rounded-lg px-3 py-2 w-full font-medium ${
                                m.status === 'active' 
                                  ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400'
                                  : m.status === 'expired'
                                  ? 'border-gray-200 bg-gray-50 text-gray-700 dark:bg-gray-950/20 dark:border-gray-800 dark:text-gray-400'
                                  : 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400'
                              }`}
                              value={m.status}
                              onChange={(e) => handleStatusChange(m, e.target.value)}
                              disabled={m.source === 'booking'}
                            >
                              {Object.values(MEMBERSHIP_STATUS).map((status) => (
                                <option key={status} value={status}>{getStatusLabel(status)}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleEditMembership(m)}
                              variant="ghost"
                              className="flex-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleRenew(m)}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Renew
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMembershipRow(m)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Add-ons and Details */}
                      {(m.addOns.selectedAddOns.length > 0 ||
                        m.addOns.meetingRoomHours > 0 ||
                        m.addOns.guestPasses > 0 ||
                        m.notes) && (
                        <div className="pt-4 border-t border-purple-100 dark:border-purple-900/50">
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Add-ons & Details</div>
                          <div className="flex flex-wrap gap-2">
                            {m.addOns.selectedAddOns.map((addOn, idx) => (
                              <Badge key={idx} className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                                {addOn}
                              </Badge>
                            ))}
                            {m.addOns.meetingRoomHours > 0 && (
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Meeting Room: {m.addOns.meetingRoomHours}h
                              </Badge>
                            )}
                            {m.addOns.guestPasses > 0 && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Guest Passes: {m.addOns.guestPasses}
                              </Badge>
                            )}
                          </div>
                          {m.notes && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes:</div>
                              <div className="text-sm text-gray-700 dark:text-gray-300">{m.notes}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {filtered.length === 0 && (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No memberships found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try adjusting your filters or search query</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
