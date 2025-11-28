import type { Database } from '@/lib/database.types'

export type AdminBookingRecord = {
  id: string
  customerName: string
  email?: string
  phone?: string
  locationId?: string
  locationName: string
  planId?: string
  planName: string
  roomName?: string | null
  amount: number
  status: string
  createdAt: string
  addOns: {
    selectedAddOns: string[]
    meetingRoomHours: number
    guestPasses: number
  }
  notes?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  source?: 'supabase' | 'manual' | 'local'
  manualEntryId?: string
}

type AddOnRow = Database['public']['Tables']['add_ons']['Row']

export function transformBookingsToAdmin(
  bookings: Array<Record<string, any>>,
  addOnsData: AddOnRow[]
): AdminBookingRecord[] {
  const addOnsMap = new Map(addOnsData.map((addon) => [addon.id, addon.name]))

  return bookings.map((booking) => {
    const contactInfo = booking.contact_info as Record<string, any> | null
    const firstName = contactInfo?.firstName || ''
    const lastName = contactInfo?.lastName || ''
    const customerName = `${firstName} ${lastName}`.trim() || contactInfo?.name || 'Guest User'

    const addOnsPayload = (booking.add_ons as Record<string, any> | null) || {}
    const addOnIds: string[] = addOnsPayload.addOnIds || []
    const selectedAddOns = addOnIds
      .map((id) => addOnsMap.get(id) || 'Unknown Add-on')
      .filter(Boolean)

    return {
      id: booking.id,
      customerName,
      email: contactInfo?.email || undefined,
      phone: contactInfo?.phone || undefined,
      locationId: booking.location_id,
      locationName: booking.locations?.name || 'Unknown Location',
      planId: booking.plan_id,
      planName: booking.plans?.name || 'Unknown Plan',
      roomName: booking.rooms?.name || null,
      amount: Math.round(booking.total_amount || 0),
      status: booking.status || 'pending',
      createdAt: booking.created_at || new Date().toISOString(),
      addOns: {
        selectedAddOns,
        meetingRoomHours: addOnsPayload.meetingRoomHours || 0,
        guestPasses: addOnsPayload.guestPasses || 0,
      },
      notes: booking.notes || undefined,
      startDate: booking.start_date || undefined,
      endDate: booking.end_date || undefined,
      startTime: booking.start_time || undefined,
      endTime: booking.end_time || undefined,
      source: 'supabase',
    }
  })
}

