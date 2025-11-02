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

// Default pricing (fallback)
const defaultPricing: LocationPricing['prices'] = {
  explorer: { daily: 50000 }, // NPR 500
  professional: { weekly: 250000, monthly: 950000, annual: 10260000 }, // NPR 2,500 / 9,500 / 102,600
  enterprise: { weekly: 450000, monthly: 1850000, annual: 19980000 }, // NPR 4,500 / 18,500 / 199,800
  'private-office': { weekly: 900000, monthly: 3500000, annual: 37800000 }, // NPR 9,000 / 35,000 / 378,000
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
  const pricings = getLocationPricings()
  const found = pricings.find((p) => p.locationId === locationId)
  return found ? found.prices : defaultPricing
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

