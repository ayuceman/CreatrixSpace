import { useEffect, useMemo, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/database.types'
import { locationService, planService, locationPricingService, roomService, roomPricingService } from '@/services/supabase-service'
type LocationRow = Database['public']['Tables']['locations']['Row']
type PlanRow = Database['public']['Tables']['plans']['Row']
type LocationPlanPricingRow = Database['public']['Tables']['location_plan_pricing']['Row']
type RoomRow = Database['public']['Tables']['location_rooms']['Row']
type RoomPlanPricingRow = Database['public']['Tables']['room_plan_pricing']['Row']
type PlanPricing = {
  daily?: number
  weekly?: number
  monthly?: number
  annual?: number
}
type BillingField = 'daily' | 'weekly' | 'monthly' | 'annual'

const PLAN_TYPE_FIELDS: Record<PlanRow['type'], BillingField[]> = {
  day_pass: ['daily'],
  hot_desk: ['weekly', 'monthly', 'annual'],
  dedicated_desk: ['weekly', 'monthly', 'annual'],
  private_office: ['weekly', 'monthly', 'annual'],
  meeting_room: [],
}

const formatPriceInput = (value?: number) => {
  if (typeof value !== 'number') return ''
  return String(value / 100)
}

const parsePriceInput = (value: string) => {
  if (!value) return undefined
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return undefined
  return Math.round(parsed * 100)
}

export function AdminPricingPage() {
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [plans, setPlans] = useState<PlanRow[]>([])
  const [pricingRows, setPricingRows] = useState<LocationPlanPricingRow[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string>('')
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [roomPricingRows, setRoomPricingRows] = useState<RoomPlanPricingRow[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')
  const [priceInputs, setPriceInputs] = useState<Record<string, Partial<Record<BillingField, string>>>>({})
  const [roomPriceInputs, setRoomPriceInputs] = useState<Record<string, Partial<Record<BillingField, string>>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [roomSaving, setRoomSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomStatusUpdating, setRoomStatusUpdating] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [locationRows, planRows, locationPricingRows, roomRows, roomPricingData] = await Promise.all([
        locationService.getAllLocations(),
        planService.getAllPlans(),
        locationPricingService.getAllLocationPricing(),
        roomService.getAllRooms(),
        roomPricingService.getAllRoomPricing(),
      ])
      setLocations(locationRows)
      setPlans(planRows)
      setPricingRows(locationPricingRows)
      setRooms(roomRows)
      setRoomPricingRows(roomPricingData)
    } catch (err) {
      console.error(err)
      setError('Failed to load pricing data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      setSelectedLocationId(locations[0].id)
    }
  }, [locations, selectedLocationId])

  useEffect(() => {
    if (!selectedLocationId) {
      setSelectedRoomId('')
      return
    }
    const roomsForLocation = rooms.filter((room) => room.location_id === selectedLocationId)
    if (roomsForLocation.length === 0) {
      setSelectedRoomId('')
      return
    }
    setSelectedRoomId((current) =>
      current && roomsForLocation.some((room) => room.id === current) ? current : roomsForLocation[0].id
    )
  }, [rooms, selectedLocationId])

  const orderedPlans = useMemo(() => {
    const preferredOrder = ['Explorer', 'Professional', 'Enterprise', 'Private Office']
    return plans
      .filter((plan) => (PLAN_TYPE_FIELDS[plan.type] || []).length > 0)
      .sort((a, b) => {
        const idxA = preferredOrder.indexOf(a.name)
        const idxB = preferredOrder.indexOf(b.name)
        if (idxA === -1 && idxB === -1) return a.name.localeCompare(b.name)
        if (idxA === -1) return 1
        if (idxB === -1) return -1
        return idxA - idxB
      })
  }, [plans])

  const roomsForSelectedLocation = useMemo(
    () => rooms.filter((room) => room.location_id === selectedLocationId),
    [rooms, selectedLocationId]
  )

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [rooms, selectedRoomId]
  )

  useEffect(() => {
    if (!selectedLocationId || orderedPlans.length === 0) return
    const inputs: Record<string, Partial<Record<BillingField, string>>> = {}

    orderedPlans.forEach((plan) => {
      const pricingRow = pricingRows.find(
        (row) => row.location_id === selectedLocationId && row.plan_id === plan.id
      )
      const pricing = (pricingRow?.pricing as PlanPricing) || (plan.pricing as PlanPricing) || {}
      const fields = PLAN_TYPE_FIELDS[plan.type] || []

      inputs[plan.id] = fields.reduce((acc, field) => {
        acc[field] = formatPriceInput(pricing[field])
        return acc
      }, {} as Partial<Record<BillingField, string>>)
    })

    setPriceInputs(inputs)
  }, [selectedLocationId, orderedPlans, pricingRows])

  useEffect(() => {
    if (!selectedRoomId || orderedPlans.length === 0) {
      setRoomPriceInputs({})
      return
    }
    const inputs: Record<string, Partial<Record<BillingField, string>>> = {}

    orderedPlans.forEach((plan) => {
      const pricingRow = roomPricingRows.find(
        (row) => row.room_id === selectedRoomId && row.plan_id === plan.id
      )
      const pricing = (pricingRow?.pricing as PlanPricing) || (plan.pricing as PlanPricing) || {}
      const fields = PLAN_TYPE_FIELDS[plan.type] || []

      inputs[plan.id] = fields.reduce((acc, field) => {
        acc[field] = formatPriceInput(pricing[field])
        return acc
      }, {} as Partial<Record<BillingField, string>>)
    })

    setRoomPriceInputs(inputs)
  }, [selectedRoomId, orderedPlans, roomPricingRows])

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId),
    [locations, selectedLocationId]
  )

  const handleInputChange = (planId: string, field: BillingField, value: string) => {
    setPriceInputs((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value,
      },
    }))
  }

  const handleRoomInputChange = (planId: string, field: BillingField, value: string) => {
    setRoomPriceInputs((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!selectedLocationId) return
    setSaving(true)
    try {
      const payloads = orderedPlans.map((plan) => {
        const fields = PLAN_TYPE_FIELDS[plan.type] || []
        const inputs = priceInputs[plan.id] || {}
        const pricing: PlanPricing = {}
        fields.forEach((field) => {
          const parsed = parsePriceInput(inputs[field] ?? '')
          if (typeof parsed === 'number') {
            pricing[field] = parsed
          }
        })
        return { planId: plan.id, pricing }
      })

      await Promise.all(
        payloads.map(({ planId, pricing }) =>
          locationPricingService.upsertLocationPricing({
            locationId: selectedLocationId,
            planId,
            pricing,
          })
        )
      )

      const refreshedPricing = await locationPricingService.getAllLocationPricing()
      setPricingRows(refreshedPricing)
      alert('Pricing updated successfully.')
    } catch (err) {
      console.error(err)
      alert('Failed to save pricing. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleRoomPricingSave = async () => {
    if (!selectedRoomId) return
    setRoomSaving(true)
    try {
      const payloads = orderedPlans.map((plan) => {
        const fields = PLAN_TYPE_FIELDS[plan.type] || []
        const inputs = roomPriceInputs[plan.id] || {}
        const pricing: PlanPricing = {}
        fields.forEach((field) => {
          const parsed = parsePriceInput(inputs[field] ?? '')
          if (typeof parsed === 'number') {
            pricing[field] = parsed
          }
        })
        return { planId: plan.id, pricing }
      })

      await Promise.all(
        payloads.map(({ planId, pricing }) =>
          roomPricingService.upsertRoomPricing({
            roomId: selectedRoomId,
            planId,
            pricing,
          })
        )
      )

      const refreshed = await roomPricingService.getAllRoomPricing()
      setRoomPricingRows(refreshed)
      alert('Room pricing updated successfully.')
    } catch (err) {
      console.error(err)
      alert('Failed to save room pricing. Please try again.')
    } finally {
      setRoomSaving(false)
    }
  }

  const handleRoomStatusChange = async (roomId: string, status: RoomRow['status']) => {
    try {
      setRoomStatusUpdating(roomId)
      const updatedRoom = await roomService.updateRoom(roomId, { status })
      if (updatedRoom) {
        setRooms((prev) => prev.map((room) => (room.id === roomId ? updatedRoom : room)))
      }
    } catch (err) {
      console.error(err)
      alert('Failed to update room status. Please try again.')
    } finally {
      setRoomStatusUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Location Pricing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage live pricing for each plan and location stored in Supabase.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Location</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading locations…
            </div>
          ) : locations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No locations found. Add locations in Supabase to begin configuring pricing.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {locations.map((loc) => (
                <Button
                  key={loc.id}
                  variant={selectedLocationId === loc.id ? 'default' : 'outline'}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className="justify-start"
                >
                  {loc.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle>
              Rooms at {selectedLocation.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Update availability and select a room to configure plan overrides.
            </p>
          </CardHeader>
          <CardContent>
            {roomsForSelectedLocation.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No rooms configured for this location yet. Create rooms in Supabase to enable per-room pricing.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {roomsForSelectedLocation.map((room) => {
                  const isSelected = room.id === selectedRoomId
                  return (
                    <div
                      key={room.id}
                      className={cn(
                        'border rounded-lg p-4 space-y-3 transition-all',
                        isSelected ? 'border-primary shadow-lg' : 'hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{room.name}</h3>
                          {room.size && (
                            <p className="text-xs text-muted-foreground">{room.size}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            room.status === 'available' ? 'secondary' : room.status === 'booked' ? 'destructive' : 'outline'
                          }
                        >
                          {room.status}
                        </Badge>
                      </div>
                      {room.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 text-xs">
                        {(room.tags || room.amenities || []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setSelectedRoomId(room.id)}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={room.status === 'available' || roomStatusUpdating === room.id}
                          onClick={() => handleRoomStatusChange(room.id, 'available')}
                          className="flex items-center gap-1"
                        >
                          {roomStatusUpdating === room.id && room.status !== 'available' ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span className="text-xs">Updating</span>
                            </>
                          ) : (
                            'Mark Available'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={room.status === 'booked' || roomStatusUpdating === room.id}
                          onClick={() => handleRoomStatusChange(room.id, 'booked')}
                          className="flex items-center gap-1"
                        >
                          {roomStatusUpdating === room.id && room.status !== 'booked' ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span className="text-xs">Updating</span>
                            </>
                          ) : (
                            'Mark Booked'
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedLocation ? `Pricing for ${selectedLocation.name}` : 'Select a location'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Enter prices in NPR (converted to paisa automatically).</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading plans…
            </div>
          ) : !selectedLocation ? (
            <p className="text-sm text-muted-foreground">
              Choose a location to begin editing pricing.
            </p>
          ) : orderedPlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No eligible plans found. Add plans in Supabase to display pricing inputs.
            </p>
          ) : (
            <>
              {orderedPlans.map((plan) => {
                const fields = PLAN_TYPE_FIELDS[plan.type] || []
                if (fields.length === 0) return null

                return (
                  <div key={plan.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{plan.name}</h3>
                      {!plan.active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className={`grid gap-4 ${fields.length > 1 ? 'md:grid-cols-3' : ''}`}>
                      {fields.map((field) => (
                        <div className="space-y-2" key={`${plan.id}-${field}`}>
                          <Label htmlFor={`${plan.id}-${field}`}>
                            {{
                              daily: 'Daily (NPR)',
                              weekly: 'Weekly (NPR)',
                              monthly: 'Monthly (NPR)',
                              annual: 'Annual (NPR)',
                            }[field]}
                          </Label>
                          <Input
                            id={`${plan.id}-${field}`}
                            type="number"
                            inputMode="decimal"
                            value={priceInputs[plan.id]?.[field] ?? ''}
                            onChange={(e) => handleInputChange(plan.id, field, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <Separator />
                  </div>
                )
              })}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={loadData} disabled={saving}>
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={saving || !selectedLocationId}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Pricing
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedRoom && (
        <Card>
          <CardHeader>
            <CardTitle>
              Room Pricing Overrides ({selectedRoom.name})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Leave fields empty to inherit pricing from the location-level defaults.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderedPlans.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No eligible plans found. Add plans in Supabase to edit room pricing.
              </p>
            ) : (
              <>
                {orderedPlans.map((plan) => {
                  const fields = PLAN_TYPE_FIELDS[plan.type] || []
                  if (fields.length === 0) return null

                  return (
                    <div key={`room-${plan.id}`} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{plan.name}</h3>
                        {!plan.active && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className={`grid gap-4 ${fields.length > 1 ? 'md:grid-cols-3' : ''}`}>
                        {fields.map((field) => (
                          <div className="space-y-2" key={`room-${plan.id}-${field}`}>
                            <Label htmlFor={`room-${plan.id}-${field}`}>
                              {{
                                daily: 'Daily (NPR)',
                                weekly: 'Weekly (NPR)',
                                monthly: 'Monthly (NPR)',
                                annual: 'Annual (NPR)',
                              }[field]}
                            </Label>
                            <Input
                              id={`room-${plan.id}-${field}`}
                              type="number"
                              inputMode="decimal"
                              placeholder="Inherit"
                              value={roomPriceInputs[plan.id]?.[field] ?? ''}
                              onChange={(e) => handleRoomInputChange(plan.id, field, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>
                  )
                })}

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={loadData} disabled={roomSaving}>
                    Reset
                  </Button>
                  <Button onClick={handleRoomPricingSave} disabled={roomSaving || !selectedRoomId}>
                    {roomSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Room Pricing
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {orderedPlans.length > 0 && selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Price Preview ({selectedLocation.name})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {orderedPlans.map((plan) => {
                const fields = PLAN_TYPE_FIELDS[plan.type] || []
                return (
                  <div key={`preview-${plan.id}`}>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-muted-foreground">
                      {fields.map((field) => (
                        <div key={`preview-${plan.id}-${field}`}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}:{' '}
                          {priceInputs[plan.id]?.[field] || '—'}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

