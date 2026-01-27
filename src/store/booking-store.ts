import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { locationService, planService, addOnService, bookingService, authService, locationPricingService, roomService, roomPricingService } from '@/services/supabase-service'
import { calculatePricing } from '@/lib/pricing-calculator'
import type { Database } from '@/lib/database.types'

type Location = Database['public']['Tables']['locations']['Row']
type Plan = Database['public']['Tables']['plans']['Row']
type AddOn = Database['public']['Tables']['add_ons']['Row']
type LocationPlanPricingRow = Database['public']['Tables']['location_plan_pricing']['Row']
type Room = Database['public']['Tables']['location_rooms']['Row']
type RoomPlanPricingRow = Database['public']['Tables']['room_plan_pricing']['Row']
type PlanPricing = {
  daily?: number
  weekly?: number
  monthly?: number
  annual?: number
}
type LocationPlanPricingMap = Record<string, Record<string, PlanPricing>>
type RoomPlanPricingMap = Record<string, Record<string, PlanPricing>>

export interface BookingData {
  // Step 1: Location & Plan
  locationId: string
  roomId: string
  planId: string

  // Step 2: Date & Time  
  startDate: Date | null
  endDate: Date | null
  startTime: string
  endTime: string

  // Step 3: Add-ons & Extras
  addOns: string[]
  meetingRoomHours: number
  guestPasses: number
  notes: string

  // Step 4: Contact Info
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
  }

  // Pricing
  totalAmount: number
  currency: string

  // Booking ID (set after creation)
  bookingId?: string
}

interface BookingStore {
  // Current step
  currentStep: number

  // Booking data
  bookingData: BookingData

  // Available options
  locations: Array<{
    id: string
    name: string
    address: string
    available: boolean
    city?: string | null
    popular?: boolean
    slug?: string | null
  }>

  rooms: Array<{
    id: string
    locationId: string
    name: string
    slug?: string | null
    description?: string | null
    imageUrl?: string | null
    capacity?: number | null
    status: 'available' | 'booked' | 'maintenance'
    tags?: string[] | null
    amenities?: string[] | null
    size?: string | null
  }>

  plans: Array<{
    id: string
    name: string
    type: string
    description?: string
    features?: string[]
    popular?: boolean
    pricing: PlanPricing
    available?: boolean
    status?: string
  }>

  addOns: Array<{
    id: string
    name: string
    price: number
    description: string
  }>

  // Loading states
  loading: boolean
  error: string | null

  locationPlanPricing: LocationPlanPricingMap
  roomPlanPricing: RoomPlanPricingMap

  // Actions
  setCurrentStep: (step: number) => void
  updateBookingData: (data: Partial<BookingData>) => void
  resetBooking: () => void
  calculateTotal: () => void
  getPlanPricingForLocation: (planId: string, locationId?: string, roomId?: string) => PlanPricing
  getRoomsForLocation: (locationId?: string) => BookingStore['rooms']

  // Data loading
  loadAllData: () => Promise<void>

  // Booking operations
  createBooking: () => Promise<string | null> // Returns booking ID or null

  // Navigation
  nextStep: () => void
  prevStep: () => void
  canProceed: () => boolean
}

const initialBookingData: BookingData = {
  locationId: '',
  roomId: '',
  planId: '',
  startDate: null,
  endDate: null,
  startTime: '09:00',
  endTime: '17:00',
  addOns: [],
  meetingRoomHours: 0,
  guestPasses: 0,
  notes: '',
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  },
  totalAmount: 0,
  currency: 'NPR',
}

// Helper function to convert Supabase Location to store format
const DEFAULT_LOCATION_SLUG = 'dhobighat-hub'
const DEFAULT_LOCATION_NAME = 'Dhobighat (WashingTown) Hub'

const convertLocation = (loc: Location) => ({
  id: loc.id,
  name: loc.name,
  address: loc.address,
  available: loc.available,
  city: loc.city,
  popular: loc.popular,
  slug: (loc as Location & { slug?: string }).slug ?? null,
})

const convertRoom = (room: Room) => ({
  id: room.id,
  locationId: room.location_id,
  name: room.name,
  slug: room.slug,
  description: room.description,
  imageUrl: room.image_url,
  capacity: room.capacity,
  status: room.status,
  tags: room.tags,
  amenities: room.amenities,
  size: room.size,
})

// Helper function to convert Supabase Plan to store format
const convertPlan = (plan: Plan) => {
  const pricing = (plan.pricing as PlanPricing) || {}
  return {
    id: plan.id,
    name: plan.name,
    type: plan.type,
    description: plan.description || '',
    features: plan.features || [],
    popular: plan.popular,
    pricing: {
      daily: pricing.daily,
      weekly: pricing.weekly,
      monthly: pricing.monthly,
      annual: pricing.annual,
    },
  }
}

// Helper function to convert Supabase AddOn to store format
const convertAddOn = (addon: AddOn) => ({
  id: addon.id,
  name: addon.name,
  price: Number(addon.price),
  description: addon.description || '',
})

const buildLocationPlanPricingMap = (rows: LocationPlanPricingRow[]): LocationPlanPricingMap => {
  return rows.reduce<LocationPlanPricingMap>((acc, row) => {
    if (!acc[row.location_id]) {
      acc[row.location_id] = {}
    }
    acc[row.location_id][row.plan_id] = row.pricing as PlanPricing
    return acc
  }, {})
}

const buildRoomPlanPricingMap = (rows: RoomPlanPricingRow[]): RoomPlanPricingMap => {
  return rows.reduce<RoomPlanPricingMap>((acc, row) => {
    if (!acc[row.room_id]) {
      acc[row.room_id] = {}
    }
    acc[row.room_id][row.plan_id] = row.pricing as PlanPricing
    return acc
  }, {})
}

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      currentStep: 1,
      bookingData: initialBookingData,
      locations: [],
      rooms: [],
      plans: [],
      addOns: [],
      locationPlanPricing: {},
      roomPlanPricing: {},
      loading: false,
      error: null,

      setCurrentStep: (step) => set({ currentStep: step }),

      updateBookingData: (data) => {
        const { locationId: currentLocationId } = get().bookingData
        const rooms = get().rooms

        set((state) => {
          const nextBooking = { ...state.bookingData, ...data }

          if (data.locationId && data.locationId !== currentLocationId) {
            nextBooking.planId = ''
            nextBooking.roomId = ''
          }

          if (nextBooking.roomId) {
            const isValidRoom = rooms.some(
              (room) => room.id === nextBooking.roomId && room.locationId === nextBooking.locationId
            )
            if (!isValidRoom) {
              nextBooking.roomId = ''
            }
          }

          return { bookingData: nextBooking }
        })

        get().calculateTotal()
      },

      resetBooking: () => set({
        currentStep: 1,
        bookingData: initialBookingData,
      }),

      calculateTotal: () => {
        const { bookingData, plans, addOns, getPlanPricingForLocation } = get()
        const selectedPlan = plans.find(p => p.id === bookingData.planId)

        if (!selectedPlan) {
          console.warn('Cannot calculate total: No plan selected')
          return
        }

        // Get selected add-ons with their prices
        const selectedAddOnsWithPrices = bookingData.addOns
          .map(addonId => {
            const addon = addOns.find(a => a.id === addonId)
            return addon ? { id: addon.id, price: addon.price } : null
          })
          .filter((addon): addon is { id: string; price: number } => addon !== null)

        // Use centralized pricing calculator
        const pricing = calculatePricing({
          planPricing: getPlanPricingForLocation(selectedPlan.id, bookingData.locationId, bookingData.roomId),
          planType: selectedPlan.type,
          selectedAddOns: selectedAddOnsWithPrices,
          meetingRoomHours: bookingData.meetingRoomHours,
          guestPasses: bookingData.guestPasses,
        })

        console.log('Pricing calculation:', {
          basePrice: pricing.basePrice,
          addOnsPrice: pricing.addOnsPrice,
          meetingRoomHoursPrice: pricing.meetingRoomHoursPrice,
          guestPassesPrice: pricing.guestPassesPrice,
          total: pricing.total,
        })

        set((state) => ({
          bookingData: { ...state.bookingData, totalAmount: pricing.total }
        }))
      },

      getPlanPricingForLocation: (planId, locationId, roomId) => {
        const { plans, locationPlanPricing, roomPlanPricing } = get()
        const plan = plans.find((p) => p.id === planId)
        let resolvedPricing: PlanPricing = {}

        if (roomId && roomPlanPricing[roomId] && roomPlanPricing[roomId][planId]) {
          resolvedPricing = roomPlanPricing[roomId][planId]
        } else if (locationId && locationPlanPricing[locationId] && locationPlanPricing[locationId][planId]) {
          resolvedPricing = locationPlanPricing[locationId][planId]
        } else {
          resolvedPricing = plan?.pricing || {}
        }

        // Force Explorer day pass pricing to the correct public price (NPR 800/day).
        // Prices are stored in paisa (80000 = NPR 800.00).
        if (plan?.type === 'day_pass' && plan.name?.toLowerCase() === 'explorer') {
          return { ...resolvedPricing, daily: 80000 }
        }

        return resolvedPricing
      },

      getRoomsForLocation: (locationId) => {
        if (!locationId) return []
        return get().rooms.filter((room) => room.locationId === locationId)
      },

      loadAllData: async () => {
        set({ loading: true, error: null })
        try {
          const [
            locations,
            plans,
            addOns,
            locationPlanPricing,
            rooms,
            roomPlanPricing,
          ] = await Promise.all([
            locationService.getAllLocations(),
            planService.getAllPlans(),
            addOnService.getAllAddOns(),
            locationPricingService.getAllLocationPricing(),
            roomService.getAllRooms(),
            roomPricingService.getAllRoomPricing(),
          ])

          set((state) => {
            const convertedLocations = locations.map(convertLocation)
            const convertedRooms = rooms.map(convertRoom)
            const convertedPlans = plans.map(convertPlan)
            const convertedAddOns = addOns.map(convertAddOn)
            const locationPricingMap = buildLocationPlanPricingMap(locationPlanPricing)
            const roomPricingMap = buildRoomPlanPricingMap(roomPlanPricing)

            let bookingData = state.bookingData
            if (!bookingData.locationId && convertedLocations.length) {
              const preferredLocation =
                convertedLocations.find(
                  (loc) =>
                    (loc.slug && loc.slug.toLowerCase() === DEFAULT_LOCATION_SLUG) ||
                    loc.name?.toLowerCase() === DEFAULT_LOCATION_NAME.toLowerCase()
                ) || convertedLocations[0]

              bookingData = {
                ...bookingData,
                locationId: preferredLocation.id,
              }
            }

            return {
              bookingData,
              locations: convertedLocations,
              rooms: convertedRooms,
              plans: convertedPlans,
              addOns: convertedAddOns,
              locationPlanPricing: locationPricingMap,
              roomPlanPricing: roomPricingMap,
              loading: false,
            }
          })
        } catch (error) {
          console.error('❌ booking-store: loadAllData failed', error)
          set({
            error: error instanceof Error ? error.message : 'Failed to load data',
            loading: false
          })
        }
      },

      createBooking: async () => {
        set({ loading: true, error: null })

        try {
          // Recalculate total before creating booking to ensure it's accurate
          get().calculateTotal()

          // Get the updated booking data with recalculated total
          const updatedBookingData = get().bookingData

          // Try to get current user, but allow guest bookings (null user_id)
          let userId: string | null = null
          try {
            const user = await authService.getCurrentUser()
            userId = user?.id || null
          } catch {
            // Not authenticated - allow guest booking
            userId = null
          }

          // Create booking in Supabase (with or without user_id)
          const booking = await bookingService.createBooking(updatedBookingData, userId)

          // Update booking data with the created booking ID
          set((state) => ({
            bookingData: { ...state.bookingData, bookingId: booking.id },
            loading: false
          }))

          // Email will be sent when user verifies payment on QR payment page

          return booking.id
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
          set({
            error: errorMessage,
            loading: false
          })
          return null
        }
      },

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 4) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      canProceed: () => {
        const { currentStep, bookingData, plans, rooms } = get()
        const selectedPlan = plans.find(p => p.id === bookingData.planId)
        const isDayPass = selectedPlan?.type === 'day_pass'
        const requiresRoomSelection =
          Boolean(bookingData.locationId) &&
          rooms.some((room) => room.locationId === bookingData.locationId)

        switch (currentStep) {
          case 1:
            return (
              bookingData.locationId &&
              (!requiresRoomSelection || bookingData.roomId) &&
              bookingData.planId
            )
          case 2:
            // For day passes, only startDate is required
            // For other plans, startDate, startTime, and endTime are required
            if (isDayPass) {
              return !!bookingData.startDate
            }
            return bookingData.startDate && bookingData.startTime && bookingData.endTime
          case 3:
            return true // Optional step
          case 4:
            return (
              bookingData.contactInfo.firstName &&
              bookingData.contactInfo.lastName &&
              bookingData.contactInfo.email &&
              bookingData.contactInfo.phone
            )
          default:
            return false
        }
      },
    }),
    { name: 'booking-store' }
  )
)
