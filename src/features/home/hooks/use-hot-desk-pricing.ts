import { useEffect, useState } from 'react'
import { locationService, planService, locationPricingService } from '@/services/supabase-service'

export type HotDeskPricing = {
  daily: number | null
  weekly: number | null
  monthly: number | null
  loading: boolean
  formatted: {
    daily: string
    weekly: string
    monthly: string
    badge: string
  }
}

const formatPricing = (daily: number | null, weekly: number | null, monthly: number | null): HotDeskPricing['formatted'] => {
  const fmt = (p: number) => (p / 100).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return {
    daily: daily != null ? fmt(daily) : '—',
    weekly: weekly != null ? fmt(weekly) : '—',
    monthly: monthly != null ? fmt(monthly) : '—',
    badge: [daily != null ? `${fmt(daily)}/day` : '', weekly != null ? `${fmt(weekly)}/week` : '', monthly != null ? `${fmt(monthly)}/month` : '']
      .filter(Boolean)
      .join(' • ') || 'Contact for pricing',
  }
}

export function useHotDeskPricing(): HotDeskPricing {
  const [daily, setDaily] = useState<number | null>(null)
  const [weekly, setWeekly] = useState<number | null>(null)
  const [monthly, setMonthly] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const [locations, plans, pricingRows] = await Promise.all([
          locationService.getAllLocations(),
          planService.getAllPlans(),
          locationPricingService.getAllLocationPricing(),
        ])
        if (cancelled || !locations.length || !plans.length) return

        const explorer = plans.find((p) => p.name === 'Explorer' || p.type === 'day_pass')
        const professional = plans.find((p) => p.name === 'Professional' || p.type === 'hot_desk')
        if (!explorer && !professional) return

        const locationId = locations[0]?.id
        const locationPricing = pricingRows.filter((r) => r.location_id === locationId)

        let d: number | null = null
        let w: number | null = null
        let m: number | null = null

        if (explorer) {
          const row = locationPricing.find((r) => r.plan_id === explorer.id)
          const pricing = (row?.pricing as { daily?: number }) ?? (explorer.pricing as { daily?: number })
          if (typeof pricing?.daily === 'number') d = pricing.daily
        }
        if (professional) {
          const row = locationPricing.find((r) => r.plan_id === professional.id)
          const pricing = (row?.pricing as { weekly?: number; monthly?: number }) ?? (professional.pricing as { weekly?: number; monthly?: number })
          if (typeof pricing?.weekly === 'number') w = pricing.weekly
          if (typeof pricing?.monthly === 'number') m = pricing.monthly
        }

        if (!cancelled) {
          setDaily(d)
          setWeekly(w)
          setMonthly(m)
        }
      } catch (err) {
        console.warn('useHotDeskPricing:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return {
    daily,
    weekly,
    monthly,
    loading,
    formatted: formatPricing(daily, weekly, monthly),
  }
}
