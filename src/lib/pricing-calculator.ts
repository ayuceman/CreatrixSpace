/**
 * Centralized pricing calculation utility
 * This ensures all pages show the same pricing
 */

// Pricing constants (in paisa - smallest currency unit)
// These match the hardcoded values used in the UI
export const PRICING_CONSTANTS = {
  MEETING_ROOM_HOUR_PRICE: 150000, // NPR 1,500 per hour (in paisa)
  GUEST_PASS_PRICE: 60000, // NPR 600 per pass (in paisa)
} as const

export interface PricingBreakdown {
  basePrice: number
  addOnsPrice: number
  meetingRoomHoursPrice: number
  guestPassesPrice: number
  total: number
}

export interface CalculatePricingParams {
  planPricing: {
    daily?: number
    monthly?: number
  }
  planType: string
  selectedAddOns: Array<{ id: string; price: number }>
  meetingRoomHours: number
  guestPasses: number
}

/**
 * Calculate total pricing for a booking
 * This is the single source of truth for pricing calculations
 */
export function calculatePricing(params: CalculatePricingParams): PricingBreakdown {
  const {
    planPricing,
    planType,
    selectedAddOns,
    meetingRoomHours,
    guestPasses,
  } = params

  // Base plan cost
  const basePrice = planType === 'day_pass' 
    ? (planPricing.daily || 0)
    : (planPricing.monthly || 0)

  // Regular add-ons (selected checkboxes)
  const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)

  // Meeting room hours
  const meetingRoomHoursPrice = meetingRoomHours > 0
    ? PRICING_CONSTANTS.MEETING_ROOM_HOUR_PRICE * meetingRoomHours
    : 0

  // Guest passes
  const guestPassesPrice = guestPasses > 0
    ? PRICING_CONSTANTS.GUEST_PASS_PRICE * guestPasses
    : 0

  // Total
  const total = basePrice + addOnsPrice + meetingRoomHoursPrice + guestPassesPrice

  return {
    basePrice,
    addOnsPrice,
    meetingRoomHoursPrice,
    guestPassesPrice,
    total,
  }
}

/**
 * Get meeting room hour price
 */
export function getMeetingRoomHourPrice(): number {
  return PRICING_CONSTANTS.MEETING_ROOM_HOUR_PRICE
}

/**
 * Get guest pass price
 */
export function getGuestPassPrice(): number {
  return PRICING_CONSTANTS.GUEST_PASS_PRICE
}

