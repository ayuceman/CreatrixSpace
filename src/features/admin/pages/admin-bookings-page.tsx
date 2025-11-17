import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { bookingService, addOnService } from '@/services/supabase-service'

type AdminBooking = {
  id: string
  customerName: string
  email?: string
  phone?: string
  locationName: string
  planName: string
  amount: number // in paisa (multiply by 100 for display)
  status: string
  createdAt: string
  addOns: {
    selectedAddOns: string[] // Add-on names
    meetingRoomHours: number
    guestPasses: number
  }
  notes?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
}

export function AdminBookingsPage() {
  const [query, setQuery] = useState('')
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const [bookingsData, addOnsData] = await Promise.all([
        bookingService.getAllBookings(),
        addOnService.getAllAddOns()
      ])
      
      // Create a map of add-on IDs to names
      const addOnsMap = new Map(addOnsData.map(addon => [addon.id, addon.name]))
      
      // Transform Supabase bookings to AdminBooking format
      const transformed: AdminBooking[] = bookingsData.map((booking: any) => {
        // Extract contact info from JSONB field
        const contactInfo = booking.contact_info as any
        const firstName = contactInfo?.firstName || ''
        const lastName = contactInfo?.lastName || ''
        const customerName = `${firstName} ${lastName}`.trim() || 'Guest User'
        
        // Get location and plan names from joined data
        const locationName = booking.locations?.name || 'Unknown Location'
        const planName = booking.plans?.name || 'Unknown Plan'
        
        // Extract add-ons data from JSONB field
        const addOnsData = booking.add_ons as any
        const addOnIds = addOnsData?.addOnIds || []
        const selectedAddOns = addOnIds.map((id: string) => addOnsMap.get(id) || 'Unknown Add-on').filter(Boolean)
        
        return {
          id: booking.id,
          customerName,
          email: contactInfo?.email || undefined,
          phone: contactInfo?.phone || undefined,
          locationName,
          planName,
          amount: Math.round(booking.total_amount || 0), // Already in paisa from database
          status: booking.status || 'pending',
          createdAt: booking.created_at || new Date().toISOString(),
          addOns: {
            selectedAddOns,
            meetingRoomHours: addOnsData?.meetingRoomHours || 0,
            guestPasses: addOnsData?.guestPasses || 0,
          },
          notes: booking.notes || undefined,
          startDate: booking.start_date,
          endDate: booking.end_date,
          startTime: booking.start_time || undefined,
          endTime: booking.end_time || undefined,
        }
      })
      
      setBookings(transformed)

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

  const handleStatusToggle = async (bookingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending'
    
    setUpdatingIds(prev => new Set(prev).add(bookingId))
    
    try {
      // Clear any previous errors
      setError(null)
      
      await bookingService.updateBooking(bookingId, { status: newStatus as 'pending' | 'confirmed' })
      
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Bookings</h1>
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
                      onCheckedChange={() => handleStatusToggle(b.id, b.status)}
                    />
                    <Label 
                      htmlFor={`status-${b.id}`} 
                      className="text-xs uppercase tracking-wide cursor-pointer"
                    >
                      {b.status === 'confirmed' ? 'Verified' : 'Pending'}
                    </Label>
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


