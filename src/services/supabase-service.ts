import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'
import type { BookingData } from '@/store/booking-store'

type Profile = Database['public']['Tables']['profiles']['Row']
type Location = Database['public']['Tables']['locations']['Row']
type LocationRoom = Database['public']['Tables']['location_rooms']['Row']
type LocationRoomUpdate = Database['public']['Tables']['location_rooms']['Update']
type Plan = Database['public']['Tables']['plans']['Row']
type AddOn = Database['public']['Tables']['add_ons']['Row']
type LocationPlanPricing = Database['public']['Tables']['location_plan_pricing']['Row']
type LocationPlanPricingInsert = Database['public']['Tables']['location_plan_pricing']['Insert']
type RoomPlanPricing = Database['public']['Tables']['room_plan_pricing']['Row']
type RoomPlanPricingInsert = Database['public']['Tables']['room_plan_pricing']['Insert']
type ManualAdminEntry = Database['public']['Tables']['manual_admin_entries']['Row']
type ManualAdminEntryInsert = Database['public']['Tables']['manual_admin_entries']['Insert']
type Booking = Database['public']['Tables']['bookings']['Row']
type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
type Payment = Database['public']['Tables']['payments']['Row']
type PaymentInsert = Database['public']['Tables']['payments']['Insert']
type PlanPricingPayload = {
  daily?: number
  weekly?: number
  monthly?: number
  annual?: number
}

// ============================================
// AUTHENTICATION SERVICES
// ============================================

export const authService = {
  async signUp(email: string, password: string, metadata?: { full_name?: string; first_name?: string; last_name?: string; phone?: string; company?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// ============================================
// PROFILE SERVICES
// ============================================

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async getCurrentProfile(): Promise<Profile | null> {
    const user = await authService.getCurrentUser()
    if (!user) return null
    return this.getProfile(user.id)
  },

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCurrentProfile(updates: ProfileUpdate): Promise<Profile> {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('No user logged in')
    return this.updateProfile(user.id, updates)
  },
}

// ============================================
// LOCATION SERVICES
// ============================================

export const locationService = {
  async getAllLocations(): Promise<Location[]> {
    try {
      // Try to query locations table
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('available', true)
        .order('name', { ascending: true })
      
      // If any error occurs (table doesn't exist, RLS error, 500 error, etc.), return empty array
      if (error) {
        // Log warning but don't throw - return empty array so app can use fallback data
        console.warn('Could not load locations from Supabase:', error.message || error)
        return []
      }
      return data || []
    } catch (error: any) {
      // Catch all errors including network errors, 500 errors, etc.
      console.warn('Error loading locations (using fallback):', error?.message || error)
      return []
    }
  },

  async getLocation(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getLocationBySlug(slug: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },
}

// ============================================
// ROOM SERVICES
// ============================================

export const roomService = {
  async getAllRooms(): Promise<LocationRoom[]> {
    try {
      const { data, error } = await supabase
        .from('location_rooms')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.warn('Could not load rooms from Supabase:', error.message || error)
        return []
      }

      return data || []
    } catch (error: any) {
      console.warn('Error loading rooms:', error?.message || error)
      return []
    }
  },

  async getRoomsByLocation(locationId: string): Promise<LocationRoom[]> {
    try {
      const { data, error } = await supabase
        .from('location_rooms')
        .select('*')
        .eq('location_id', locationId)
        .order('name', { ascending: true })

      if (error) {
        console.warn('Could not load rooms for location:', error.message || error)
        return []
      }

      return data || []
    } catch (error: any) {
      console.warn('Error loading rooms for location:', error?.message || error)
      return []
    }
  },

  async updateRoom(roomId: string, updates: Partial<LocationRoomUpdate>): Promise<LocationRoom | null> {
    const client = supabaseAdmin ?? supabase
    const { data, error } = await client
      .from('location_rooms')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', roomId)
      .select('*')
      .single()

    if (error) {
      console.error('Failed to update room:', error)
      throw error
    }

    return data
  },

  async setRoomStatus(roomId: string, status: LocationRoom['status']) {
    return this.updateRoom(roomId, { status })
  },
}

// ============================================
// PLAN SERVICES
// ============================================

export const planService = {
  async getAllPlans(): Promise<Plan[]> {
    try {
      // Try to query plans table
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true })
      
      // If any error occurs (table doesn't exist, RLS error, 500 error, etc.), return empty array
      if (error) {
        // Log warning but don't throw - return empty array so app can use fallback data
        console.warn('Could not load plans from Supabase:', error.message || error)
        return []
      }
      const plans = data || []

      // Pricing overrides (keeps the website consistent even if DB is stale)
      // Note: prices are stored in paisa (e.g. 80000 = NPR 800.00)
      return plans.map((plan) => {
        if (plan.type === 'day_pass' && plan.name?.toLowerCase() === 'explorer') {
          const pricing = (plan.pricing as PlanPricingPayload) || {}
          return {
            ...plan,
            pricing: {
              ...pricing,
              daily: 80000,
            } as any,
          }
        }
        return plan
      })
    } catch (error: any) {
      // Catch all errors including network errors, 500 errors, etc.
      console.warn('Error loading plans (using fallback):', error?.message || error)
      return []
    }
  },

  async getPlan(id: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
}

// ============================================
// LOCATION PLAN PRICING SERVICES
// ============================================

const transformPlanPricingPayload = (pricing: PlanPricingPayload): PlanPricingPayload => {
  const sanitized: PlanPricingPayload = {}
  if (typeof pricing.daily === 'number') sanitized.daily = pricing.daily
  if (typeof pricing.weekly === 'number') sanitized.weekly = pricing.weekly
  if (typeof pricing.monthly === 'number') sanitized.monthly = pricing.monthly
  if (typeof pricing.annual === 'number') sanitized.annual = pricing.annual
  return sanitized
}

export const locationPricingService = {
  async getAllLocationPricing(): Promise<LocationPlanPricing[]> {
    try {
      const { data, error } = await supabase
        .from('location_plan_pricing')
        .select('*')
      
      if (error) {
        console.warn('Could not load location pricing from Supabase:', error.message || error)
        return []
      }
      
      return data || []
    } catch (error: any) {
      console.warn('Error loading location pricing:', error?.message || error)
      return []
    }
  },

  async getLocationPricingForLocation(locationId: string): Promise<LocationPlanPricing[]> {
    try {
      const { data, error } = await supabase
        .from('location_plan_pricing')
        .select('*')
        .eq('location_id', locationId)
      
      if (error) {
        console.warn('Could not load location pricing for location:', error.message || error)
        return []
      }
      
      return data || []
    } catch (error: any) {
      console.warn('Error loading location pricing for location:', error?.message || error)
      return []
    }
  },

  async upsertLocationPricing(params: { locationId: string; planId: string; pricing: PlanPricingPayload; currency?: string }) {
    const { locationId, planId, pricing, currency = 'NPR' } = params
    const payload: LocationPlanPricingInsert = {
      location_id: locationId,
      plan_id: planId,
      pricing: transformPlanPricingPayload(pricing),
      currency,
      updated_at: new Date().toISOString(),
    }

    const client = supabaseAdmin ?? supabase

    const { error } = await client
      .from('location_plan_pricing')
      .upsert(payload, { onConflict: 'location_id,plan_id' })
    
    if (error) throw error
  },
}

// ============================================
// ROOM PLAN PRICING SERVICES
// ============================================

export const roomPricingService = {
  async getAllRoomPricing(): Promise<RoomPlanPricing[]> {
    try {
      const { data, error } = await supabase
        .from('room_plan_pricing')
        .select('*')

      if (error) {
        console.warn('Could not load room pricing from Supabase:', error.message || error)
        return []
      }

      return data || []
    } catch (error: any) {
      console.warn('Error loading room pricing:', error?.message || error)
      return []
    }
  },

  async getRoomPricingForRoom(roomId: string): Promise<RoomPlanPricing[]> {
    try {
      const { data, error } = await supabase
        .from('room_plan_pricing')
        .select('*')
        .eq('room_id', roomId)

      if (error) {
        console.warn('Could not load room pricing for room:', error.message || error)
        return []
      }

      return data || []
    } catch (error: any) {
      console.warn('Error loading room pricing for room:', error?.message || error)
      return []
    }
  },

  async upsertRoomPricing(params: { roomId: string; planId: string; pricing: PlanPricingPayload; currency?: string }) {
    const { roomId, planId, pricing, currency = 'NPR' } = params
    const payload: RoomPlanPricingInsert = {
      room_id: roomId,
      plan_id: planId,
      pricing: transformPlanPricingPayload(pricing),
      currency,
      updated_at: new Date().toISOString(),
    }

    const client = supabaseAdmin ?? supabase

    const { error } = await client
      .from('room_plan_pricing')
      .upsert(payload, { onConflict: 'room_id,plan_id' })

    if (error) throw error
  },
}

// ============================================
// ADD-ON SERVICES
// ============================================

export const addOnService = {
  async getAllAddOns(): Promise<AddOn[]> {
    try {
      // Try to query add_ons table
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true })
      
      // If any error occurs (table doesn't exist, RLS error, 500 error, etc.), return empty array
      if (error) {
        // Log warning but don't throw - return empty array so app can use fallback data
        console.warn('Could not load add-ons from Supabase:', error.message || error)
        return []
      }
      return data || []
    } catch (error: any) {
      // Catch all errors including network errors, 500 errors, etc.
      console.warn('Error loading add-ons (using fallback):', error?.message || error)
      return []
    }
  },

  async getAddOn(id: string): Promise<AddOn | null> {
    const { data, error } = await supabase
      .from('add_ons')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
}

// ============================================
// BOOKING SERVICES
// ============================================

// Helper function to check if a string is a valid UUID
const isValidUUID = (str: string): boolean => {
  if (!str) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export const bookingService = {
  async createBooking(bookingData: BookingData, userId: string | null): Promise<Booking> {
    // Validate required fields
    if (!bookingData.locationId || !bookingData.planId) {
      throw new Error('Location and plan are required')
    }

    if (!bookingData.startDate) {
      throw new Error('Start date is required')
    }

    // Validate that IDs are valid UUIDs (from Supabase)
    if (!isValidUUID(bookingData.locationId)) {
      console.error('Invalid location ID format:', bookingData.locationId)
      throw new Error('Invalid location selected. Please refresh the page and select a location again.')
    }

    if (!isValidUUID(bookingData.planId)) {
      console.error('Invalid plan ID format:', bookingData.planId)
      throw new Error('Invalid plan selected. Please refresh the page and select a plan again.')
    }

    if (bookingData.roomId && !isValidUUID(bookingData.roomId)) {
      console.error('Invalid room ID format:', bookingData.roomId)
      throw new Error('Invalid room selected. Please refresh the page and select a room again.')
    }

    // For day passes, endDate should be the same as startDate
    // For other plans, endDate is required
    let endDate = bookingData.endDate
    if (!endDate) {
      // Default to same as start date (for day passes)
      endDate = bookingData.startDate
    }

    // Format dates
    const startDate = bookingData.startDate.toISOString().split('T')[0]
    const formattedEndDate = endDate.toISOString().split('T')[0]

    // Validate dates
    if (formattedEndDate < startDate) {
      throw new Error('End date must be after or equal to start date')
    }

    // Always try to save to Supabase
    const bookingInsert: BookingInsert = {
      user_id: userId || null, // Allow null for guest bookings
      location_id: bookingData.locationId,
      room_id: bookingData.roomId || null,
      plan_id: bookingData.planId,
      start_date: startDate,
      end_date: formattedEndDate,
      start_time: bookingData.startTime || null,
      end_time: bookingData.endTime || null,
      total_amount: bookingData.totalAmount || 0,
      currency: bookingData.currency || 'NPR',
      status: 'pending',
      payment_status: 'pending',
      contact_info: bookingData.contactInfo || null,
      add_ons: {
        addOnIds: bookingData.addOns || [],
        meetingRoomHours: bookingData.meetingRoomHours || 0,
        guestPasses: bookingData.guestPasses || 0,
      },
      notes: bookingData.notes || null,
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingInsert)
      .select()
      .single()
    
    if (error) {
      // Check if it's a NOT NULL constraint error for user_id
      if (error.code === '23502' || error.message?.includes('null value in column "user_id"') || error.message?.includes('violates not-null constraint')) {
        console.error('Database schema error: user_id column is still set to NOT NULL. Please run the ALTER TABLE statement in schema.sql to make user_id nullable.')
        throw new Error('Database configuration error. Please contact support or ensure the database schema allows guest bookings.')
      }
      
      // Check if it's a foreign key constraint error (invalid location_id or plan_id)
      if (error.code === '23503' || error.message?.includes('foreign key') || error.message?.includes('violates foreign key')) {
        console.error('Invalid location or plan ID. Please ensure the location and plan exist in Supabase.')
        throw new Error('Invalid location or plan selected. Please refresh the page and try again.')
      }
      
      // Check if it's an invalid UUID format error
      if (error.code === '22P02' || error.message?.includes('invalid input syntax for type uuid')) {
        console.error('Invalid UUID format for location or plan ID.')
        throw new Error('Invalid location or plan format. Please refresh the page and try again.')
      }
      
      // Log detailed error for debugging
      console.error('Booking creation error:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        bookingData: {
          locationId: bookingData.locationId,
          roomId: bookingData.roomId,
          planId: bookingData.planId,
          startDate,
          formattedEndDate,
          userId,
        }
      })
      throw new Error(error.message || 'Failed to create booking')
    }
    
    return data
  },

  async getBooking(id: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getCurrentUserBookings(): Promise<Booking[]> {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('No user logged in')
    return this.getUserBookings(user.id)
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    // Ensure updated_at is set
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn('No authenticated user - update may fail due to RLS')
    }
    
    // First, update the booking
    const { data: updateResult, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()
    
    if (updateError) {
      console.error('Error updating booking:', {
        error: updateError,
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        userId: user?.id,
        bookingId: id,
        updates: updateData
      })
      throw updateError
    }
    
    if (!updateResult) {
      throw new Error('No data returned from update')
    }
    
    return updateResult
  },

  async cancelBooking(id: string): Promise<Booking> {
    return this.updateBooking(id, { status: 'cancelled' })
  },

  async confirmBooking(id: string): Promise<Booking> {
    return this.updateBooking(id, { status: 'confirmed' })
  },

  async deleteBooking(id: string): Promise<void> {
    const client = supabaseAdmin ?? supabase
    const { error } = await client
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getAllBookings(): Promise<Booking[]> {
    // First, get all bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      throw bookingsError
    }
    
    if (!bookings || bookings.length === 0) {
      return []
    }
    
    // Get unique location and plan IDs
    const locationIds = [...new Set(bookings.map(b => b.location_id))]
    const roomIds = [...new Set(bookings.map(b => b.room_id).filter(Boolean))] as string[]
    const planIds = [...new Set(bookings.map(b => b.plan_id))]
    
    // Fetch locations and plans
    const [locationsResult, roomsResult, plansResult] = await Promise.all([
      supabase.from('locations').select('id, name').in('id', locationIds),
      roomIds.length
        ? supabase.from('location_rooms').select('id, name').in('id', roomIds)
        : Promise.resolve({ data: [], error: null } as { data: LocationRoom[] | null; error: any }),
      supabase.from('plans').select('id, name').in('id', planIds)
    ])
    
    if (locationsResult.error) {
      console.error('Error fetching locations:', locationsResult.error)
    }
    if (plansResult.error) {
      console.error('Error fetching plans:', plansResult.error)
    }
    
    // Create lookup maps
    const locationsMap = new Map(
      (locationsResult.data || []).map(loc => [loc.id, loc.name])
    )
    const roomsMap = new Map(
      (roomsResult.data || []).map(room => [room.id, room.name])
    )
    const plansMap = new Map(
      (plansResult.data || []).map(plan => [plan.id, plan.name])
    )
    
    // Attach location and plan names to bookings
    return bookings.map(booking => ({
      ...booking,
      locations: { id: booking.location_id, name: locationsMap.get(booking.location_id) || 'Unknown Location' },
      rooms: booking.room_id ? { id: booking.room_id, name: roomsMap.get(booking.room_id) || 'Unassigned Room' } : null,
      plans: { id: booking.plan_id, name: plansMap.get(booking.plan_id) || 'Unknown Plan' }
    })) as any
  },

  async getBookingsByDateRange(startDate: string, endDate: string, locationId?: string, roomId?: string): Promise<Booking[]> {
    let query = supabase
      .from('bookings')
      .select('*')
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .in('status', ['pending', 'confirmed'])
    
    if (locationId) {
      query = query.eq('location_id', locationId)
    }

    if (roomId) {
      query = query.eq('room_id', roomId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },
}

// ============================================
// MANUAL ENTRY SERVICES
// ============================================

export const manualEntryService = {
  async getEntries(entryType?: ManualAdminEntry['entry_type']): Promise<ManualAdminEntry[]> {
    let query = supabase
      .from('manual_admin_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (entryType) {
      query = query.eq('entry_type', entryType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to load manual entries:', error)
      throw error
    }

    return data || []
  },

  async addEntry(params: { entryType: ManualAdminEntry['entry_type']; data: Record<string, any>; createdBy?: string | null }) {
    const sanitizedData = JSON.parse(JSON.stringify(params.data ?? {}))
    const payload: ManualAdminEntryInsert = {
      entry_type: params.entryType,
      data: sanitizedData,
      created_by: params.createdBy ?? null,
    }

    const client = supabaseAdmin ?? supabase
    const { data, error } = await client
      .from('manual_admin_entries')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      console.error('Failed to insert manual entry:', error)
      throw new Error(error.message || 'Failed to insert manual entry')
    }

    return data
  },

  async deleteEntry(id: string) {
    const client = supabaseAdmin ?? supabase
    const { error } = await client
      .from('manual_admin_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete manual entry:', error)
      throw new Error(error.message || 'Failed to delete manual entry')
    }
  },

  async updateEntry(id: string, data: Record<string, any>) {
    const sanitizedData = JSON.parse(JSON.stringify(data ?? {}))
    const client = supabaseAdmin ?? supabase
    const { error } = await client
      .from('manual_admin_entries')
      .update({ data: sanitizedData, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Failed to update manual entry:', error)
      throw new Error(error.message || 'Failed to update manual entry')
    }
  },
}

// ============================================
// PAYMENT SERVICES
// ============================================

export const paymentService = {
  async createPayment(paymentData: PaymentInsert): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getPayment(id: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getPaymentByBooking(bookingId: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  },

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePaymentStatus(id: string, status: Payment['status'], transactionId?: string): Promise<Payment> {
    const updates: Partial<Payment> = { status }
    if (transactionId) {
      updates.transaction_id = transactionId
    }
    return this.updatePayment(id, updates)
  },
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export const realtimeService = {
  subscribeToBookings(callback: (payload: any) => void) {
    return supabase
      .channel('bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        callback
      )
      .subscribe()
  },

  subscribeToUserBookings(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-bookings-${userId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },
}

