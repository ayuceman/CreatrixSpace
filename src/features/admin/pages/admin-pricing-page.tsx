import { useEffect, useMemo, useState, useRef } from 'react'
import { Plus, Loader2, AlertCircle, X, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { showToast } from '@/components/ui/toast'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/database.types'
import {
  locationService,
  planService,
  locationPricingService,
  roomService,
  roomPricingService,
} from '@/services/supabase-service'
type LocationRow = Database['public']['Tables']['locations']['Row']
type PlanRow = Database['public']['Tables']['plans']['Row']
type LocationPlanPricingRow =
  Database['public']['Tables']['location_plan_pricing']['Row']
type RoomRow = Database['public']['Tables']['location_rooms']['Row']
type RoomPlanPricingRow =
  Database['public']['Tables']['room_plan_pricing']['Row']
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
  const [roomPricingRows, setRoomPricingRows] = useState<RoomPlanPricingRow[]>(
    []
  )
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')
  const [priceInputs, setPriceInputs] = useState<
    Record<string, Partial<Record<BillingField, string>>>
  >({})
  const [roomPriceInputs, setRoomPriceInputs] = useState<
    Record<string, Partial<Record<BillingField, string>>>
  >({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [roomSaving, setRoomSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomStatusUpdating, setRoomStatusUpdating] = useState<string | null>(
    null
  )
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomSlug, setNewRoomSlug] = useState('')
  const [newRoomCapacity, setNewRoomCapacity] = useState('')
  const [newRoomStatus, setNewRoomStatus] =
    useState<RoomRow['status']>('available')
  const [newRoomDescription, setNewRoomDescription] = useState('')
  const [newRoomSize, setNewRoomSize] = useState('')
  const [newRoomTags, setNewRoomTags] = useState('')
  const [newRoomAmenities, setNewRoomAmenities] = useState('')
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('')
  const [addingRoom, setAddingRoom] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [
        locationRows,
        planRows,
        locationPricingRows,
        roomRows,
        roomPricingData,
      ] = await Promise.all([
        locationService.getAllLocations(),
        planService.getAllPlansAdmin(),
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
    const roomsForLocation = rooms.filter(
      (room) => room.location_id === selectedLocationId
    )
    if (roomsForLocation.length === 0) {
      setSelectedRoomId('')
      return
    }
    setSelectedRoomId((current) =>
      current && roomsForLocation.some((room) => room.id === current)
        ? current
        : roomsForLocation[0].id
    )
  }, [rooms, selectedLocationId])

  const orderedPlans = useMemo(() => {
    const preferredOrder = [
      'Explorer',
      'Professional',
      'Enterprise',
      'Private Office',
    ]
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
        (row) =>
          row.location_id === selectedLocationId && row.plan_id === plan.id
      )
      const pricing =
        (pricingRow?.pricing as PlanPricing) ||
        (plan.pricing as PlanPricing) ||
        {}
      const fields = PLAN_TYPE_FIELDS[plan.type] || []

      inputs[plan.id] = fields.reduce(
        (acc, field) => {
          acc[field] = formatPriceInput(pricing[field])
          return acc
        },
        {} as Partial<Record<BillingField, string>>
      )
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
      const pricing =
        (pricingRow?.pricing as PlanPricing) ||
        (plan.pricing as PlanPricing) ||
        {}
      const fields = PLAN_TYPE_FIELDS[plan.type] || []

      inputs[plan.id] = fields.reduce(
        (acc, field) => {
          acc[field] = formatPriceInput(pricing[field])
          return acc
        },
        {} as Partial<Record<BillingField, string>>
      )
    })

    setRoomPriceInputs(inputs)
  }, [selectedRoomId, orderedPlans, roomPricingRows])

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId),
    [locations, selectedLocationId]
  )

  const handleInputChange = (
    planId: string,
    field: BillingField,
    value: string
  ) => {
    setPriceInputs((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value,
      },
    }))
  }

  const handleRoomInputChange = (
    planId: string,
    field: BillingField,
    value: string
  ) => {
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

      const refreshedPricing =
        await locationPricingService.getAllLocationPricing()
      setPricingRows(refreshedPricing)
      showToast('Pricing updated successfully.')
    } catch (err) {
      console.error(err)
      showToast('Failed to save pricing. Please try again.', 'error')
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
      showToast('Room pricing updated successfully.')
    } catch (err) {
      console.error(err)
      showToast('Failed to save room pricing. Please try again.', 'error')
    } finally {
      setRoomSaving(false)
    }
  }

  const resetRoomForm = (keepOpen = false) => {
    setEditingRoomId(null)
    setNewRoomName('')
    setNewRoomSlug('')
    setNewRoomCapacity('')
    setNewRoomStatus('available')
    setNewRoomDescription('')
    setNewRoomSize('')
    setNewRoomTags('')
    setNewRoomAmenities('')
    setNewRoomImageUrl('')
    if (!keepOpen) setShowAddRoom(false)
  }

  const handleUploadRoomImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const storage = supabaseAdmin?.storage ?? supabase.storage
      const ext = file.name.split('.').pop()
      const filePath = `rooms/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await storage
        .from('images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const fullUrl = storage.from('images').getPublicUrl(filePath)
        .data.publicUrl
      setNewRoomImageUrl(fullUrl)
      showToast('Image uploaded')
    } catch (err: any) {
      showToast(`Image upload failed: ${err?.message || err}`, 'error')
    }
    setUploadingImage(false)
  }

  const handleAddRoom = async () => {
    if (!selectedLocationId || !newRoomName.trim()) return
    setAddingRoom(true)
    try {
      const payload: any = {
        location_id: selectedLocationId,
        name: newRoomName.trim(),
        slug:
          newRoomSlug.trim() ||
          newRoomName.trim().toLowerCase().replace(/\s+/g, '-'),
        capacity: Number(newRoomCapacity) || null,
        status: newRoomStatus,
        description: newRoomDescription.trim() || null,
        size: newRoomSize.trim() || null,
        tags: newRoomTags.trim()
          ? newRoomTags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : null,
        amenities: newRoomAmenities.trim()
          ? newRoomAmenities
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : null,
        image_url: newRoomImageUrl || null,
      }

      const client = supabaseAdmin ?? supabase

      if (editingRoomId) {
        const updated = await roomService.updateRoom(editingRoomId, payload)
        if (!updated) throw new Error('Update returned no data')
        setRooms((prev) =>
          prev.map((r) => (r.id === editingRoomId ? updated : r))
        )
        showToast('Room updated!')
      } else {
        const { data, error } = await client
          .from('location_rooms')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        setRooms((prev) => [...prev, data])
        showToast('Room created!')
      }

      resetRoomForm()
    } catch (err) {
      showToast(`Failed to save room: ${(err as any)?.message || err}`, 'error')
    }
    setAddingRoom(false)
  }

  const openEditRoom = (room: RoomRow) => {
    setEditingRoomId(room.id)
    setNewRoomName(room.name)
    setNewRoomSlug(room.slug)
    setNewRoomCapacity(String(room.capacity ?? ''))
    setNewRoomStatus(room.status)
    setNewRoomDescription(room.description ?? '')
    setNewRoomSize(room.size ?? '')
    setNewRoomTags((room.tags ?? []).join(', '))
    setNewRoomAmenities((room.amenities ?? []).join(', '))
    setNewRoomImageUrl(room.image_url ?? '')
    setShowAddRoom(true)
  }

  const handleRoomStatusChange = async (
    roomId: string,
    status: RoomRow['status']
  ) => {
    try {
      setRoomStatusUpdating(roomId)
      const updatedRoom = await roomService.updateRoom(roomId, { status })
      if (updatedRoom) {
        setRooms((prev) =>
          prev.map((room) => (room.id === roomId ? updatedRoom : room))
        )
      }
    } catch (err) {
      console.error(err)
      showToast('Failed to update room status. Please try again.', 'error')
    } finally {
      setRoomStatusUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal">Location Pricing</h1>
        <p className="text-sm text-fg-2 mt-1">
          Manage live pricing for each plan and location stored in Supabase.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Location</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-fg-2">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading locations…
            </div>
          ) : locations.length === 0 ? (
            <p className="text-sm text-fg-2">
              No locations found. Add locations in Supabase to begin configuring
              pricing.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {locations.map((loc) => (
                <Button
                  key={loc.id}
                  variant={
                    selectedLocationId === loc.id ? 'default' : 'outline'
                  }
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
            <CardTitle>Rooms at {selectedLocation.name}</CardTitle>
            <p className="text-sm text-fg-2">
              Update availability and select a room to configure plan overrides.
            </p>
          </CardHeader>
          <CardContent>
            {showAddRoom && (
              <div className="border border-rule rounded-sm p-4 mb-4 space-y-3 bg-bg-raised">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-fg-1">
                    {editingRoomId ? 'Edit Room' : 'New Room'}
                  </span>
                  <button
                    type="button"
                    onClick={() => resetRoomForm()}
                    className="text-fg-3 hover:text-clay cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">Name *</label>
                    <input
                      value={newRoomName}
                      onChange={(e) => {
                        setNewRoomName(e.target.value)
                        if (!editingRoomId) {
                          setNewRoomSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                          )
                        }
                      }}
                      placeholder="e.g. Earth Lab"
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">Slug *</label>
                    {editingRoomId ? (
                      <input
                        value={newRoomSlug}
                        onChange={(e) =>
                          setNewRoomSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                          )
                        }
                        placeholder="earth-lab"
                        className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                      />
                    ) : (
                      <p className="text-sm text-fg-2 px-2.5 py-1.5 border border-transparent">
                        {newRoomSlug || 'auto-generated from name'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">Capacity</label>
                    <input
                      type="number"
                      min="0"
                      value={newRoomCapacity}
                      onChange={(e) => setNewRoomCapacity(e.target.value)}
                      placeholder="8"
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">
                      Description
                    </label>
                    <textarea
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                      placeholder="A bright, private room for 10 people"
                      rows={2}
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">Size</label>
                    <input
                      value={newRoomSize}
                      onChange={(e) => setNewRoomSize(e.target.value)}
                      placeholder="360 sq.ft"
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">
                      Tags (comma separated)
                    </label>
                    <input
                      value={newRoomTags}
                      onChange={(e) => setNewRoomTags(e.target.value)}
                      placeholder="sunlight, parking, spacious"
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">
                      Amenities (comma separated)
                    </label>
                    <input
                      value={newRoomAmenities}
                      onChange={(e) => setNewRoomAmenities(e.target.value)}
                      placeholder="Focus pods, Team huddle system"
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-caption text-fg-3">Status</label>
                    <select
                      value={newRoomStatus}
                      onChange={(e) =>
                        setNewRoomStatus(e.target.value as RoomRow['status'])
                      }
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-caption text-fg-3">Image</label>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUploadRoomImage(file)
                          }}
                          className="w-full text-sm text-fg-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-rule file:text-sm file:bg-bg-raised file:text-fg-1 hover:file:bg-bg file:cursor-pointer"
                        />
                        {uploadingImage && (
                          <span className="text-xs text-clay mt-1 block">
                            Uploading...
                          </span>
                        )}
                      </div>
                      {newRoomImageUrl && (
                        <div className="relative group shrink-0">
                          <img
                            src={newRoomImageUrl}
                            alt="Preview"
                            className="size-20 object-cover rounded-sm border border-rule"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewRoomImageUrl('')
                              if (fileInputRef.current)
                                fileInputRef.current.value = ''
                            }}
                            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-clay text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    text={
                      addingRoom
                        ? 'Saving...'
                        : editingRoomId
                          ? 'Update Room'
                          : 'Create Room'
                    }
                    disabled={addingRoom || !newRoomName.trim()}
                    onClick={handleAddRoom}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    text="Cancel"
                    onClick={() => resetRoomForm()}
                  />
                </div>
              </div>
            )}
            {roomsForSelectedLocation.length === 0 && !showAddRoom ? (
              <div className="text-sm text-fg-2 space-y-3">
                <p>No rooms configured for this location yet.</p>
                <Button
                  size="sm"
                  variant="outline"
                  text="Add Room"
                  icon={Plus}
                  onClick={() => setShowAddRoom(true)}
                />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {roomsForSelectedLocation.map((room) => {
                  const isSelected = room.id === selectedRoomId
                  return (
                    <div
                      key={room.id}
                      className={cn(
                        'border rounded-lg p-4 space-y-3 transition-all',
                        isSelected
                          ? 'border-clay shadow-lg'
                          : 'hover:border-clay/40'
                      )}
                    >
                      {room.image_url && (
                        <div className="relative h-28 -mx-4 -mt-4 mb-2 overflow-hidden rounded-t-lg">
                          <img
                            src={room.image_url}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-medium truncate">
                              {room.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => openEditRoom(room)}
                              className="text-fg-3 hover:text-clay cursor-pointer shrink-0"
                              title="Edit room"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>
                          {room.size && (
                            <p className="text-xs text-fg-2">{room.size}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            room.status === 'available'
                              ? 'secondary'
                              : room.status === 'booked'
                                ? 'destructive'
                                : 'outline'
                          }
                        >
                          {room.status}
                        </Badge>
                      </div>
                      {room.description && (
                        <p className="text-sm text-fg-2 line-clamp-2">
                          {room.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 text-xs">
                        {(room.tags || room.amenities || [])
                          .slice(0, 3)
                          .map((tag) => (
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
                          disabled={
                            room.status === 'available' ||
                            roomStatusUpdating === room.id
                          }
                          onClick={() =>
                            handleRoomStatusChange(room.id, 'available')
                          }
                          className="flex items-center gap-1"
                        >
                          {roomStatusUpdating === room.id &&
                          room.status !== 'available' ? (
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
                          disabled={
                            room.status === 'booked' ||
                            roomStatusUpdating === room.id
                          }
                          onClick={() =>
                            handleRoomStatusChange(room.id, 'booked')
                          }
                          className="flex items-center gap-1"
                        >
                          {roomStatusUpdating === room.id &&
                          room.status !== 'booked' ? (
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
            {roomsForSelectedLocation.length > 0 && (
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  text="Add Room"
                  icon={Plus}
                  onClick={() => setShowAddRoom(true)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-clay-deep/10 px-4 py-3 text-sm text-clay-deep">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedLocation
              ? `Pricing for ${selectedLocation.name}`
              : 'Select a location'}
          </CardTitle>
          <p className="text-sm text-fg-2">
            Enter prices in NPR (converted to paisa automatically).
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-fg-2">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading plans…
            </div>
          ) : !selectedLocation ? (
            <p className="text-sm text-fg-2">
              Choose a location to begin editing pricing.
            </p>
          ) : orderedPlans.length === 0 ? (
            <p className="text-sm text-fg-2">
              No eligible plans found. Add plans in Supabase to display pricing
              inputs.
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
                    <div
                      className={`grid gap-4 ${fields.length > 1 ? 'md:grid-cols-3' : ''}`}
                    >
                      {fields.map((field) => (
                        <div className="space-y-2" key={`${plan.id}-${field}`}>
                          <Label htmlFor={`${plan.id}-${field}`}>
                            {
                              {
                                daily: 'Daily (NPR)',
                                weekly: 'Weekly (NPR)',
                                monthly: 'Monthly (NPR)',
                                annual: 'Annual (NPR)',
                              }[field]
                            }
                          </Label>
                          <Input
                            id={`${plan.id}-${field}`}
                            type="number"
                            inputMode="decimal"
                            value={priceInputs[plan.id]?.[field] ?? ''}
                            onChange={(e) =>
                              handleInputChange(plan.id, field, e.target.value)
                            }
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
                <Button
                  onClick={handleSave}
                  disabled={saving || !selectedLocationId}
                >
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
            <CardTitle>Room Pricing Overrides ({selectedRoom.name})</CardTitle>
            <p className="text-sm text-fg-2">
              Leave fields empty to inherit pricing from the location-level
              defaults.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderedPlans.length === 0 ? (
              <p className="text-sm text-fg-2">
                No eligible plans found. Add plans in Supabase to edit room
                pricing.
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
                      <div
                        className={`grid gap-4 ${fields.length > 1 ? 'md:grid-cols-3' : ''}`}
                      >
                        {fields.map((field) => (
                          <div
                            className="space-y-2"
                            key={`room-${plan.id}-${field}`}
                          >
                            <Label htmlFor={`room-${plan.id}-${field}`}>
                              {
                                {
                                  daily: 'Daily (NPR)',
                                  weekly: 'Weekly (NPR)',
                                  monthly: 'Monthly (NPR)',
                                  annual: 'Annual (NPR)',
                                }[field]
                              }
                            </Label>
                            <Input
                              id={`room-${plan.id}-${field}`}
                              type="number"
                              inputMode="decimal"
                              placeholder="Inherit"
                              value={roomPriceInputs[plan.id]?.[field] ?? ''}
                              onChange={(e) =>
                                handleRoomInputChange(
                                  plan.id,
                                  field,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>
                  )
                })}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={loadData}
                    disabled={roomSaving}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleRoomPricingSave}
                    disabled={roomSaving || !selectedRoomId}
                  >
                    {roomSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
                    <div className="text-fg-2">
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
