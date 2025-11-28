import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trash2 } from 'lucide-react'
import { bookingService, addOnService, manualEntryService } from '@/services/supabase-service'
import { transformBookingsToAdmin, type AdminBookingRecord } from '@/features/admin/utils/admin-bookings'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function AdminBookingsPage() {
  const [query, setQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [showManualForm, setShowManualForm] = useState(false)
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return bookings
    return bookings.filter((b) =>
      [b.customerName, b.email, b.phone, b.locationName, b.planName, b.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [bookings, query])

  const handleStatusToggle = async (bookingId: string, currentStatus: string, booking: AdminBookingRecord) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending'
    
    setUpdatingIds(prev => new Set(prev).add(bookingId))
    
    try {
      // Clear any previous errors
      setError(null)
      
      if (booking.source === 'manual' && booking.manualEntryId) {
        await manualEntryService.updateEntry(booking.manualEntryId, { ...booking, status: newStatus })
      } else {
        await bookingService.updateBooking(bookingId, { status: newStatus as 'pending' | 'confirmed' })
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
      
      // Show error toast or alert
      alert(`Error: ${errorMessage}`)
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(bookingId)
        return next
      })
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualForm.customerName || !manualForm.locationName || !manualForm.planName) {
      alert('Please fill in customer, location, and plan information.')
      return
    }

    const payload: AdminBookingRecord = {
      id: '',
      customerName: manualForm.customerName,
      email: manualForm.email || undefined,
      phone: manualForm.phone || undefined,
      locationName: manualForm.locationName,
      planName: manualForm.planName,
      roomName: manualForm.roomName || undefined,
      amount: Math.round(Number(manualForm.amountNpr || 0) * 100),
      status: 'manual',
      createdAt: new Date().toISOString(),
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
      locationId: undefined,
      planId: undefined,
      roomName: null,
      source: 'manual',
    }

    const inserted = await manualEntryService.addEntry({ entryType: 'booking', data: payload })

    setBookings((prev) => [{ ...payload, id: inserted.id, manualEntryId: inserted.id, source: 'manual' }, ...prev])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowManualForm((prev) => !prev)}>
            {showManualForm ? 'Close Manual Entry' : 'Add Manual Booking'}
          </Button>
        </div>
      </div>
      {showManualForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-lg">Manual Booking Entry</h2>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleManualSubmit}>
              <Input
                required
                placeholder="Customer name"
                value={manualForm.customerName}
                onChange={(e) => setManualForm((prev) => ({ ...prev, customerName: e.target.value }))}
              />
              <Input
                placeholder="Email"
                value={manualForm.email}
                onChange={(e) => setManualForm((prev) => ({ ...prev, email: e.target.value }))}
              />
              <Input
                placeholder="Phone"
                value={manualForm.phone}
                onChange={(e) => setManualForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <Input
                required
                placeholder="Location name"
                value={manualForm.locationName}
                onChange={(e) => setManualForm((prev) => ({ ...prev, locationName: e.target.value }))}
              />
              <Input
                required
                placeholder="Plan name"
                value={manualForm.planName}
                onChange={(e) => setManualForm((prev) => ({ ...prev, planName: e.target.value }))}
              />
              <Input
                placeholder="Room name (optional)"
                value={manualForm.roomName}
                onChange={(e) => setManualForm((prev) => ({ ...prev, roomName: e.target.value }))}
              />
              <Input
                placeholder="Amount (NPR)"
                type="number"
                min="0"
                value={manualForm.amountNpr}
                onChange={(e) => setManualForm((prev) => ({ ...prev, amountNpr: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={manualForm.startDate}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
                <Input
                  type="date"
                  value={manualForm.endDate}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={manualForm.startTime}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, startTime: e.target.value }))}
                />
                <Input
                  type="time"
                  value={manualForm.endTime}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              <Input
                placeholder="Add-ons (comma separated)"
                value={manualForm.addOns}
                onChange={(e) => setManualForm((prev) => ({ ...prev, addOns: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Meeting room hours"
                  value={manualForm.meetingRoomHours}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, meetingRoomHours: e.target.value }))}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Guest passes"
                  value={manualForm.guestPasses}
                  onChange={(e) => setManualForm((prev) => ({ ...prev, guestPasses: e.target.value }))}
                />
              </div>
              <Textarea
                className="md:col-span-2"
                placeholder="Notes"
                value={manualForm.notes}
                onChange={(e) => setManualForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Save Manual Booking</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
          <div className="max-w-md">
        <Input placeholder="Search name, email, plan, status..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Separator />
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading bookings...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((b) => (
            <Card key={b.id} className="">
              <CardContent className="p-4 space-y-4">
                {/* Main Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-muted-foreground text-xs">{b.email || '—'}</div>
                    <div className="text-muted-foreground text-xs mt-1">{b.phone || '—'}</div>
                  </div>
                  <div>
                    <div className="font-medium">{b.locationName}</div>
                    <div className="text-muted-foreground text-xs">{b.planName}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Room: {b.roomName || 'Not assigned'}
                    </div>
                    {b.startDate && (
                      <div className="text-muted-foreground text-xs mt-1">
                        {new Date(b.startDate).toLocaleDateString()}
                        {b.endDate && b.endDate !== b.startDate && ` - ${new Date(b.endDate).toLocaleDateString()}`}
                        {b.startTime && ` • ${b.startTime}${b.endTime ? ` - ${b.endTime}` : ''}`}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">NPR {(b.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-muted-foreground text-xs">{new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`status-${b.id}`}
                      checked={b.status === 'confirmed'}
                      disabled={updatingIds.has(b.id)}
                      onCheckedChange={() => handleStatusToggle(b.id, b.status, b)}
                    />
                    <Label 
                      htmlFor={`status-${b.id}`} 
                      className="text-xs uppercase tracking-wide cursor-pointer"
                    >
                      {b.status === 'confirmed' ? 'Verified' : 'Pending'}
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBooking(b)}
                      title="Delete booking"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Payment: {b.status === 'confirmed' ? 'Completed' : 'Pending'}
                  </div>
                </div>
                
                {/* Add-ons and Extras */}
                {(b.addOns.selectedAddOns.length > 0 || b.addOns.meetingRoomHours > 0 || b.addOns.guestPasses > 0 || b.notes) && (
                  <div className="pt-3 border-t space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Add-ons & Extras:</div>
                    <div className="flex flex-wrap gap-2">
                      {b.addOns.selectedAddOns.map((addOn, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {addOn}
                        </Badge>
                      ))}
                      {b.addOns.meetingRoomHours > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Meeting Room: {b.addOns.meetingRoomHours} {b.addOns.meetingRoomHours === 1 ? 'hour' : 'hours'}
                        </Badge>
                      )}
                      {b.addOns.guestPasses > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Guest Passes: {b.addOns.guestPasses} {b.addOns.guestPasses === 1 ? 'pass' : 'passes'}
                        </Badge>
                      )}
                      {b.addOns.selectedAddOns.length === 0 && b.addOns.meetingRoomHours === 0 && b.addOns.guestPasses === 0 && (
                        <span className="text-xs text-muted-foreground">No add-ons selected</span>
                      )}
                    </div>
                    {b.notes && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Notes:</div>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          {b.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No bookings found.</p>
          )}
        </div>
      )}
    </div>
  )
}


