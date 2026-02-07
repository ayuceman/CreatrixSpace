import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trash2, Plus, Download, Filter, SortAsc, Calendar, DollarSign, TrendingUp, Users, Edit } from 'lucide-react'
import { bookingService, addOnService, manualEntryService } from '@/services/supabase-service'
import { transformBookingsToAdmin, type AdminBookingRecord } from '@/features/admin/utils/admin-bookings'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function AdminBookingsPage() {
  const [query, setQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [showManualForm, setShowManualForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<AdminBookingRecord | null>(null)
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
        addOnService.getAllAddOns()
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
      const revenue = transformed.reduce((sum, b) => sum + (b.amount || 0), 0) / 100
      const pending = transformed.filter((b) => /pending/i.test(b.status)).length
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

  // Calculate stats
  const stats = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const pending = bookings.filter(b => b.status === 'pending').length
    const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0) / 100
    const avgBooking = total > 0 ? revenue / total : 0

    return { total, confirmed, pending, revenue, avgBooking }
  }, [bookings])

  const filtered = useMemo(() => {
    let result = [...bookings]

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter)
    }

    // Apply search query
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter((b) =>
        [b.customerName, b.email, b.phone, b.locationName, b.planName, b.status]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  const handleStatusToggle = async (bookingId: string, currentStatus: string, booking: AdminBookingRecord) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending'
    
    setUpdatingIds(prev => new Set(prev).add(bookingId))
    
    try {
      setError(null)
      
      if (booking.source === 'manual' && booking.manualEntryId) {
        await manualEntryService.updateEntry(booking.manualEntryId, { ...booking, status: newStatus })
      } else {
        await bookingService.updateBooking(bookingId, { status: newStatus as 'pending' | 'confirmed' })
      }
      
      await loadBookings()
    } catch (err: any) {
      console.error('Error updating booking status:', err)
      
      let errorMessage = 'Failed to update booking status'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      } else if (err?.code) {
        errorMessage = `Database error (${err.code}). Please try again.`
      }
      
      setError(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setUpdatingIds(prev => {
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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualForm.customerName || !manualForm.locationName || !manualForm.planName) {
      alert('Please fill in customer, location, and plan information.')
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
      status: editingBooking?.status || 'manual',
      createdAt: editingBooking?.createdAt || new Date().toISOString(),
      addOns: {
        selectedAddOns: manualForm.addOns
          ? manualForm.addOns.split(',').map((item) => item.trim()).filter(Boolean)
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

    if (editingBooking) {
      // Update existing
      if (editingBooking.source === 'manual' && editingBooking.manualEntryId) {
        await manualEntryService.updateEntry(editingBooking.manualEntryId, payload)
      } else {
        await bookingService.updateBooking(editingBooking.id, { 
          status: payload.status as 'pending' | 'confirmed'
        })
      }
      await loadBookings()
    } else {
      // Create new
      const inserted = await manualEntryService.addEntry({ entryType: 'booking', data: payload })
      setBookings((prev) => [{ ...payload, id: inserted.id, manualEntryId: inserted.id, source: 'manual' }, ...prev])
    }

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
    if (!confirm('Delete this booking?')) return
    try {
      if (booking.source === 'manual' && booking.manualEntryId) {
        await manualEntryService.deleteEntry(booking.manualEntryId)
      } else {
        await bookingService.deleteBooking(booking.id)
      }
      await loadBookings()
    } catch (err) {
      console.error('Failed to delete booking', err)
      alert('Failed to delete booking. Please try again.')
    }
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Customer', 'Email', 'Phone', 'Location', 'Plan', 'Amount (NPR)', 'Status']
    const rows = filtered.map(b => [
      new Date(b.createdAt).toLocaleDateString(),
      b.customerName,
      b.email || '',
      b.phone || '',
      b.locationName,
      b.planName,
      (b.amount / 100).toFixed(2),
      b.status
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all workspace bookings</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={() => setShowManualForm((prev) => !prev)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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
          <Card className="border-2 border-purple-100 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.confirmed}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}% of total</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
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
          <Card className="border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">NPR {stats.avgBooking.toFixed(0)} avg/booking</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
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
          <Card className="border-2 border-purple-200 dark:border-purple-900/50 shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <h2 className="text-xl font-bold">{editingBooking ? 'Edit Booking' : 'Add Manual Booking'}</h2>
              <p className="text-purple-100 text-sm mt-1">{editingBooking ? 'Update booking details' : 'Record offline or phone bookings'}</p>
            </div>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleManualSubmit}>
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Customer Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      required
                      placeholder="Customer name *"
                      value={manualForm.customerName}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, customerName: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={manualForm.email}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      placeholder="Phone"
                      value={manualForm.phone}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Booking Details</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      required
                      placeholder="Location name *"
                      value={manualForm.locationName}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, locationName: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      required
                      placeholder="Plan name *"
                      value={manualForm.planName}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, planName: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      placeholder="Room name (optional)"
                      value={manualForm.roomName}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, roomName: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      placeholder="Amount (NPR)"
                      type="number"
                      min="0"
                      value={manualForm.amountNpr}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, amountNpr: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      type="date"
                      placeholder="Start date"
                      value={manualForm.startDate}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      type="date"
                      placeholder="End date"
                      value={manualForm.endDate}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      type="time"
                      placeholder="Start time"
                      value={manualForm.startTime}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      type="time"
                      placeholder="End time"
                      value={manualForm.endTime}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, endTime: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>

                <Separator />

                {/* Add-ons */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Add-ons (Optional)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      placeholder="Add-ons (comma separated)"
                      value={manualForm.addOns}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, addOns: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Meeting room hours"
                      value={manualForm.meetingRoomHours}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, meetingRoomHours: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Guest passes"
                      value={manualForm.guestPasses}
                      onChange={(e) => setManualForm((prev) => ({ ...prev, guestPasses: e.target.value }))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  <Textarea
                    placeholder="Notes (optional)"
                    value={manualForm.notes}
                    onChange={(e) => setManualForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowManualForm(false)
                    setEditingBooking(null)
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                    {editingBooking ? 'Update Booking' : 'Save Booking'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-purple-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-purple-200 dark:border-purple-800 rounded-md px-3 py-2 bg-white dark:bg-background"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
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

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading bookings...</span>
        </div>
      ) : error ? (
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
              <Card className="border-2 border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Main Info Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                            {b.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{b.customerName}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{b.email || 'No email'}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{b.phone || 'No phone'}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location & Plan</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{b.locationName}</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">{b.planName}</div>
                        {b.roomName && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Room: {b.roomName}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</div>
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                          NPR {(b.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        {b.startDate && (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Schedule</div>
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                              {new Date(b.startDate).toLocaleDateString()}
                              {b.endDate && b.endDate !== b.startDate && (
                                <> - {new Date(b.endDate).toLocaleDateString()}</>
                              )}
                            </div>
                            {b.startTime && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {b.startTime}{b.endTime ? ` - ${b.endTime}` : ''}
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
                            onCheckedChange={() => handleStatusToggle(b.id, b.status, b)}
                            className="data-[state=checked]:bg-purple-600"
                          />
                          <Label 
                            htmlFor={`status-${b.id}`} 
                            className="text-xs font-medium cursor-pointer"
                          >
                            {b.status === 'confirmed' ? (
                              <Badge className="bg-green-600">Confirmed</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditBooking(b)}
                            className="flex-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 justify-start"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteBooking(b)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Add-ons and Extras */}
                    {(b.addOns.selectedAddOns.length > 0 || b.addOns.meetingRoomHours > 0 || b.addOns.guestPasses > 0 || b.notes) && (
                      <div className="pt-4 border-t border-purple-100 dark:border-purple-900/50">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Add-ons & Extras</div>
                        <div className="flex flex-wrap gap-2">
                          {b.addOns.selectedAddOns.map((addOn, idx) => (
                            <Badge key={idx} className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                              {addOn}
                            </Badge>
                          ))}
                          {b.addOns.meetingRoomHours > 0 && (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              Meeting Room: {b.addOns.meetingRoomHours} {b.addOns.meetingRoomHours === 1 ? 'hour' : 'hours'}
                            </Badge>
                          )}
                          {b.addOns.guestPasses > 0 && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Guest Passes: {b.addOns.guestPasses}
                            </Badge>
                          )}
                          {b.addOns.selectedAddOns.length === 0 && b.addOns.meetingRoomHours === 0 && b.addOns.guestPasses === 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">No add-ons</span>
                          )}
                        </div>
                        {b.notes && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes:</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">{b.notes}</div>
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
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No bookings found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try adjusting your filters or search query</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
