import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Trash2,
  Download,
  Filter,
  SortAsc,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Edit,
  Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  bookingService,
  addOnService,
  manualEntryService,
} from '@/services/supabase-service'
import {
  transformBookingsToAdmin,
  type AdminBookingRecord,
} from '@/features/admin/utils/admin-bookings'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export function AdminBookingsPage() {
  const [query, setQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [showManualForm, setShowManualForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminBookingRecord | null>(
    null
  )
  const [editingBooking, setEditingBooking] =
    useState<AdminBookingRecord | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [manualForm, setManualForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    locationName: '',
    planName: '',
    roomName: '',
    amountNpr: '',
    paymentStatus: 'pending',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    addOns: '',
    meetingRoomHours: '',
    guestPasses: '',
    notes: '',
  })

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const [bookingsData, addOnsData] = await Promise.all([
        bookingService.getAllBookings(),
        addOnService.getAllAddOns(),
      ])

      const transformed = transformBookingsToAdmin(bookingsData, addOnsData)

      const manualEntries = await manualEntryService.getEntries('booking')
      const manualRows: AdminBookingRecord[] = manualEntries.map((entry) => ({
        ...(entry.data as AdminBookingRecord),
        id: entry.id,
        manualEntryId: entry.id,
        source: 'manual',
      }))

      setBookings([...manualRows, ...transformed])

      // Update metrics for dashboard
      const total = transformed.length
      const revenue =
        transformed.reduce((sum, b) => sum + (b.amount || 0), 0) / 100
      const pending = transformed.filter((b) =>
        /pending/i.test(b.status)
      ).length
      localStorage.setItem('bookings_count', String(total))
      localStorage.setItem('bookings_revenue_npr', String(revenue))
      localStorage.setItem('bookings_pending', String(pending))
    } catch (err) {
      console.error('Error loading bookings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const stats = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length
    const pending = bookings.filter((b) => b.status === 'pending').length
    const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0) / 100
    const avgBooking = total > 0 ? revenue / total : 0
    return { total, confirmed, pending, revenue, avgBooking }
  }, [bookings])

  const filtered = useMemo(() => {
    let result = [...bookings]

    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter((b) =>
        [
          b.customerName,
          b.email,
          b.phone,
          b.locationName,
          b.planName,
          b.status,
          b.paymentStatus,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'amount':
          comparison = (a.amount || 0) - (b.amount || 0)
          break
        case 'name':
          comparison = a.customerName.localeCompare(b.customerName)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [bookings, query, statusFilter, sortBy, sortOrder])

  const handleStatusToggle = async (
    bookingId: string,
    currentStatus: string,
    booking: AdminBookingRecord
  ) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending'

    setUpdatingIds((prev) => new Set(prev).add(bookingId))

    try {
      setError(null)

      if (booking.source === 'manual' && booking.manualEntryId) {
        await manualEntryService.updateEntry(booking.manualEntryId, {
          ...booking,
          status: newStatus,
        })
      } else {
        await bookingService.updateBooking(bookingId, {
          status: newStatus as 'pending' | 'confirmed',
        })
      }

      // Reload bookings from database to ensure UI matches database state
      await loadBookings()
    } catch (err: any) {
      console.error('Error updating booking status:', err)

      // Provide more detailed error message
      let errorMessage = 'Failed to update booking status'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      } else if (err?.code) {
        errorMessage = `Database error (${err.code}). Please try again.`
      }

      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(bookingId)
        return next
      })
    }
  }

  const handleEditBooking = (booking: AdminBookingRecord) => {
    setEditingBooking(booking)
    setManualForm({
      customerName: booking.customerName,
      email: booking.email || '',
      phone: booking.phone || '',
      locationName: booking.locationName,
      planName: booking.planName,
      roomName: booking.roomName || '',
      amountNpr: String(booking.amount / 100),
      paymentStatus: booking.paymentStatus || 'pending',
      startDate: booking.startDate || '',
      endDate: booking.endDate || '',
      startTime: booking.startTime || '',
      endTime: booking.endTime || '',
      addOns: booking.addOns.selectedAddOns.join(', '),
      meetingRoomHours: String(booking.addOns.meetingRoomHours || 0),
      guestPasses: String(booking.addOns.guestPasses || 0),
      notes: booking.notes || '',
    })
    setShowManualForm(true)
  }

  const PAYMENT_STATUSES = [
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
  ] as const

  const handlePaymentStatusChange = async (
    bookingId: string,
    newPaymentStatus: string,
    booking: AdminBookingRecord
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(bookingId))
    try {
      if (booking.source === 'manual' && booking.manualEntryId) {
        await manualEntryService.updateEntry(booking.manualEntryId, {
          ...booking,
          paymentStatus: newPaymentStatus,
        })
      } else {
        await bookingService.updateBooking(bookingId, {
          payment_status: newPaymentStatus as any,
        })
      }
      await loadBookings()
      showToast('Payment status updated', 'success')
    } catch (err) {
      console.error('Error updating payment status:', err)
      showToast('Failed to update payment status', 'error')
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(bookingId)
        return next
      })
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
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

    const payload: AdminBookingRecord = {
      id: editingBooking?.id || '',
      customerName: manualForm.customerName,
      email: manualForm.email || undefined,
      phone: manualForm.phone || undefined,
      locationName: manualForm.locationName,
      planName: manualForm.planName,
      roomName: manualForm.roomName || undefined,
      amount: Math.round(Number(manualForm.amountNpr || 0) * 100),
      status: editingBooking?.status || 'pending',
      paymentStatus: manualForm.paymentStatus,
      createdAt: editingBooking?.createdAt || new Date().toISOString(),
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
      startDate: manualForm.startDate || undefined,
      endDate: manualForm.endDate || undefined,
      startTime: manualForm.startTime || undefined,
      endTime: manualForm.endTime || undefined,
      locationId: editingBooking?.locationId,
      planId: editingBooking?.planId,
      source: editingBooking?.source || 'manual',
    }

    try {
      if (editingBooking) {
        if (
          editingBooking.source === 'manual' &&
          editingBooking.manualEntryId
        ) {
          await manualEntryService.updateEntry(
            editingBooking.manualEntryId,
            payload
          )
        } else {
          await bookingService.updateBooking(editingBooking.id, {
            status: payload.status as 'pending' | 'confirmed',
          })
        }
        await loadBookings()
        showToast('Booking updated successfully', 'success')
      } else {
        const inserted = await manualEntryService.addEntry({
          entryType: 'booking',
          data: payload,
        })
        setBookings((prev) => [
          {
            ...payload,
            id: inserted.id,
            manualEntryId: inserted.id,
            source: 'manual',
          },
          ...prev,
        ])
        showToast('Manual booking added successfully', 'success')
      }
    } catch (err) {
      console.error('Failed to save booking:', err)
      showToast('Failed to save booking. Please try again.', 'error')
    }

    setManualForm({
      customerName: '',
      email: '',
      phone: '',
      locationName: '',
      planName: '',
      roomName: '',
      amountNpr: '',
      paymentStatus: 'pending',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      addOns: '',
      meetingRoomHours: '',
      guestPasses: '',
      notes: '',
    })
    setShowManualForm(false)
    setEditingBooking(null)
  }

  const handleDeleteBooking = async (booking: AdminBookingRecord) => {
    setDeleteTarget(booking)
  }

  const confirmDeleteBooking = async () => {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    try {
      if (target.source === 'manual' && target.manualEntryId) {
        await manualEntryService.deleteEntry(target.manualEntryId)
      } else {
        await bookingService.deleteBooking(target.id)
      }
      await loadBookings()
      showToast('Booking deleted', 'success')
    } catch (err) {
      console.error('Failed to delete booking', err)
      showToast('Failed to delete booking. Please try again.', 'error')
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
    ]
    const rows = filtered.map((b) => [
      new Date(b.createdAt).toLocaleDateString(),
      b.customerName,
      b.email || '',
      b.phone || '',
      b.locationName,
      b.planName,
      (b.amount / 100).toFixed(2),
      b.status,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-normal">Bookings</h1>
          <p className="text-sm text-fg-2 mt-1">
            Manage all workspace bookings
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setShowManualForm((prev) => !prev)
              if (!showManualForm) setEditingBooking(null)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showManualForm ? 'Close Form' : 'Add Booking'}
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Total Bookings</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-clay/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-clay" />
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Confirmed</p>
                  <p className="text-3xl font-bold mt-2">{stats.confirmed}</p>
                  <p className="text-xs text-fg-2 mt-1">
                    {stats.total > 0
                      ? Math.round((stats.confirmed / stats.total) * 100)
                      : 0}
                    % of total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                  <p className="text-xs text-fg-2 mt-1">
                    Awaiting confirmation
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.revenue.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-fg-2 mt-1">
                    NPR {stats.avgBooking.toFixed(0)} avg/booking
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Manual Entry Form */}
      {showManualForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <div className="bg-clay p-6 text-white">
              <h2 className="text-xl font-bold">
                {editingBooking ? 'Edit Booking' : 'Add Manual Booking'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {editingBooking
                  ? 'Update booking details'
                  : 'Record offline or phone bookings'}
              </p>
            </div>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleManualSubmit}>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">
                    Customer Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      required
                      placeholder="Customer name *"
                      value={manualForm.customerName}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={manualForm.email}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Phone"
                      value={manualForm.phone}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Booking Details</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      required
                      placeholder="Location name *"
                      value={manualForm.locationName}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          locationName: e.target.value,
                        }))
                      }
                    />
                    <Input
                      required
                      placeholder="Plan name *"
                      value={manualForm.planName}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          planName: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Room name (optional)"
                      value={manualForm.roomName}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          roomName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      placeholder="Amount (NPR)"
                      type="number"
                      min="0"
                      value={manualForm.amountNpr}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          amountNpr: e.target.value,
                        }))
                      }
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-fg-2">Payment Status</span>
                      <select
                        className="border rounded px-3 py-2 text-sm"
                        value={manualForm.paymentStatus}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            paymentStatus: e.target.value,
                          }))
                        }
                      >
                        {PAYMENT_STATUSES.map((ps) => (
                          <option key={ps} value={ps}>
                            {ps.charAt(0).toUpperCase() + ps.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Start"
                        value={manualForm.startDate}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="date"
                        placeholder="End"
                        value={manualForm.endDate}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      type="time"
                      placeholder="Start time"
                      value={manualForm.startTime}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="time"
                      placeholder="End time"
                      value={manualForm.endTime}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Add-ons (Optional)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      placeholder="Add-ons (comma separated)"
                      value={manualForm.addOns}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          addOns: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Meeting room hours"
                      value={manualForm.meetingRoomHours}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
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
                        setManualForm((prev) => ({
                          ...prev,
                          guestPasses: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Textarea
                    className="md:col-span-3"
                    placeholder="Notes (optional)"
                    value={manualForm.notes}
                    onChange={(e) =>
                      setManualForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowManualForm(false)
                      setEditingBooking(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBooking ? 'Update Booking' : 'Save Booking'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search name, email, plan, status..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-clay" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border rounded px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-clay" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border rounded px-3 py-2"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="name">Name</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  className="px-2 py-1 rounded border hover:bg-bg-band text-sm"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-clay" />
          <span className="ml-2 text-fg-2">Loading bookings...</span>
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-clay-deep/10">
          <CardContent className="p-4">
            <p className="text-sm text-clay-deep">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, index) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-clay flex items-center justify-center text-white font-bold">
                            {b.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{b.customerName}</div>
                            <div className="text-xs text-fg-2">
                              {b.email || 'No email'}
                            </div>
                            <div className="text-xs text-fg-2">
                              {b.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-fg-2 mb-1">
                          Location & Plan
                        </div>
                        <div className="font-medium text-sm">
                          {b.locationName}
                        </div>
                        <div className="text-xs text-clay">{b.planName}</div>
                        {b.roomName && (
                          <div className="text-xs text-fg-2 mt-1">
                            Room: {b.roomName}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-fg-2 mb-1">Amount</div>
                        <div className="font-bold text-lg">
                          NPR{' '}
                          {(b.amount / 100).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-xs text-fg-2">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        {b.startDate && (
                          <div className="space-y-1">
                            <div className="text-xs text-fg-2">Schedule</div>
                            <div className="text-xs">
                              {new Date(b.startDate).toLocaleDateString()}
                              {b.endDate && b.endDate !== b.startDate && (
                                <>
                                  {' '}
                                  - {new Date(b.endDate).toLocaleDateString()}
                                </>
                              )}
                            </div>
                            {b.startTime && (
                              <div className="text-xs text-fg-2">
                                {b.startTime}
                                {b.endTime ? ` - ${b.endTime}` : ''}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`status-${b.id}`}
                            checked={b.status === 'confirmed'}
                            disabled={updatingIds.has(b.id)}
                            onCheckedChange={() =>
                              handleStatusToggle(b.id, b.status, b)
                            }
                          />
                          <Label
                            htmlFor={`status-${b.id}`}
                            className="text-xs cursor-pointer"
                          >
                            <Badge
                              variant={
                                b.status === 'confirmed'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {b.status === 'confirmed'
                                ? 'Confirmed'
                                : 'Pending'}
                            </Badge>
                          </Label>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-fg-2">Payment</span>
                          <select
                            className="text-xs border rounded px-2 py-1"
                            value={b.paymentStatus || 'pending'}
                            disabled={updatingIds.has(b.id)}
                            onChange={(e) =>
                              handlePaymentStatusChange(b.id, e.target.value, b)
                            }
                          >
                            {PAYMENT_STATUSES.map((ps) => (
                              <option key={ps} value={ps}>
                                {ps.charAt(0).toUpperCase() + ps.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditBooking(b)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteBooking(b)}
                          >
                            <Trash2 className="h-4 w-4 text-clay-deep" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {(b.addOns.selectedAddOns.length > 0 ||
                      b.addOns.meetingRoomHours > 0 ||
                      b.addOns.guestPasses > 0 ||
                      b.notes) && (
                      <div className="pt-4 border-t">
                        <div className="text-xs font-semibold mb-2">
                          Add-ons & Extras
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {b.addOns.selectedAddOns.map((addOn, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {addOn}
                            </Badge>
                          ))}
                          {b.addOns.meetingRoomHours > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Meeting Room: {b.addOns.meetingRoomHours}h
                            </Badge>
                          )}
                          {b.addOns.guestPasses > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Guest Passes: {b.addOns.guestPasses}
                            </Badge>
                          )}
                        </div>
                        {b.notes && (
                          <div className="mt-3 p-3 bg-bg-band/50 rounded">
                            <div className="text-xs font-medium text-fg-2 mb-1">
                              Notes:
                            </div>
                            <div className="text-sm text-fg-1">{b.notes}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <Card className="border-dashed border-2 border-rule">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-fg-3 mx-auto mb-4" />
                <p className="text-fg-2">No bookings found</p>
                <p className="text-sm text-fg-3 mt-1">
                  Try adjusting your filters or search query
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Booking"
        message={`Delete booking for "${deleteTarget?.customerName}"? This cannot be undone.`}
        onConfirm={confirmDeleteBooking}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
