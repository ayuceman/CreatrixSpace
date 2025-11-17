import locationPricingData from '@/data/location-pricing.json'

export type LocationPricing = {
  locationId: string
  locationName: string
  prices: {
    explorer: { daily: number } // in paisa
    professional: { weekly?: number; monthly: number; annual: number }
    enterprise: { weekly?: number; monthly: number; annual: number }
    'private-office': { weekly?: number; monthly: number; annual: number }
  }
}

const LOCATION_PRICING_KEY = 'location_pricing'

// Load pricing from JSON file
const staticLocationPricing: Record<string, LocationPricing> = locationPricingData as Record<string, LocationPricing>

// Default pricing (fallback)
const defaultPricing: LocationPricing['prices'] = {
  explorer: { daily: 50000 }, // NPR 500
  professional: { weekly: 250000, monthly: 950000, annual: 10260000 }, // NPR 2,500 / 9,500 / 102,600
  enterprise: { weekly: 450000, monthly: 1850000, annual: 19980000 }, // NPR 4,500 / 18,500 / 199,800
  'private-office': { weekly: 680000, monthly: 2500000, annual: 30000000 }, // NPR 6,800 / 25,000 (offer) / 300,000
}

export function getLocationPricings(): LocationPricing[] {
  try {
    const raw = localStorage.getItem(LOCATION_PRICING_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocationPricings(pricings: LocationPricing[]) {
  try {
    localStorage.setItem(LOCATION_PRICING_KEY, JSON.stringify(pricings))
  } catch {}
}

export function getLocationPricing(locationId: string): LocationPricing['prices'] {
  // First check localStorage for admin overrides
  const pricings = getLocationPricings()
  const localStorageOverride = pricings.find((p) => p.locationId === locationId)
  if (localStorageOverride) {
    return localStorageOverride.prices
  }
  
  // Then check static JSON file
  const staticPricing = staticLocationPricing[locationId]
  if (staticPricing) {
    return staticPricing.prices
  }
  
  // Finally fall back to default
  return defaultPricing
}

export function updateLocationPricing(locationId: string, locationName: string, prices: LocationPricing['prices']) {
  const pricings = getLocationPricings()
  const index = pricings.findIndex((p) => p.locationId === locationId)
  
  if (index !== -1) {
    pricings[index] = { locationId, locationName, prices }
  } else {
    pricings.push({ locationId, locationName, prices })
  }
  
  saveLocationPricings(pricings)
}

export function getDefaultPricing(): LocationPricing['prices'] {
  return defaultPricing
}

export function initializeLocationPricing(locationId: string, locationName: string) {
  const existing = getLocationPricings().find((p) => p.locationId === locationId)
  if (!existing) {
    updateLocationPricing(locationId, locationName, defaultPricing)
  }
}

