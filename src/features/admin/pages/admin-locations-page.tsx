import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { locationService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'
import type { Database } from '@/lib/database.types'

type LocationRow = Database['public']['Tables']['locations']['Row']

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const emptyForm: Database['public']['Tables']['locations']['Insert'] = {
  name: '',
  slug: '',
  description: '',
  address: '',
  full_address: '',
  city: '',
  image_url: '',
  status: 'active',
  available: true,
  popular: false,
  amenities: [],
  features: [],
  capacity: {
    hotDesks: 0,
    dedicatedDesks: 0,
    privateOffices: 0,
    meetingRooms: 0,
    eventSeats: 0,
  },
  opening_hours: { weekday: { open: '09:00', close: '18:00' } },
  rating: 0,
  images: [],
  contact_phone: '',
  contact_email: '',
  google_maps_url: '',
  latitude: null,
  longitude: null,
}

function extractGoogleMapsUrl(input: string): string {
  const trimmed = input.trim()
  const iframeMatch = trimmed.match(/src="([^"]+)"/)
  if (iframeMatch) return iframeMatch[1]
  const urlMatch = trimmed.match(/(https?:\/\/[^\s<>"]+)/)
  if (urlMatch) return urlMatch[1]
  return trimmed
}

export function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.address.trim()) errors.address = 'Address is required'
    if (
      form.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)
    ) {
      errors.contact_email = 'Invalid email format'
    }
    if (form.google_maps_url && !/^https?:\/\/.+/.test(form.google_maps_url)) {
      errors.google_maps_url = 'Must be a valid URL (http://...)'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const clearError = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const data = await locationService.getAllLocations()
    setLocations(data)
    if (data.length === 0 && !loading) {
      console.warn(
        'No locations returned — check Supabase connection or RLS policies'
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setImagePreview(null)
    setHoverRating(0)
    setFieldErrors({})
    setShowForm(true)
  }

  const openEdit = (loc: LocationRow) => {
    setForm({
      name: loc.name,
      slug: loc.slug,
      description: loc.description,
      address: loc.address,
      full_address: loc.full_address,
      city: loc.city,
      image_url: loc.image_url,
      images: loc.images ?? [],
      status: loc.status,
      available: loc.available,
      popular: loc.popular,
      amenities: loc.amenities,
      features: loc.features,
      capacity: loc.capacity ?? {
        hotDesks: 0,
        dedicatedDesks: 0,
        privateOffices: 0,
        meetingRooms: 0,
        eventSeats: 0,
      },
      opening_hours: loc.opening_hours,
      rating: loc.rating,
      contact_phone: loc.contact_phone,
      contact_email: loc.contact_email,
      google_maps_url: loc.google_maps_url,
      latitude: loc.latitude,
      longitude: loc.longitude,
    })
    setEditingId(loc.id)
    setImagePreview(loc.image_url)
    setHoverRating(0)
    setFieldErrors({})
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const storage = supabaseAdmin?.storage ?? supabase.storage
      const ext = file.name.split('.').pop()
      const folder = editingId ? `locations/${editingId}` : 'locations/temp'
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await storage
        .from('images')
        .upload(filePath, file)
      if (error) throw error
      const {
        data: { publicUrl },
      } = storage.from('images').getPublicUrl(filePath)
      setForm((f) => ({ ...f, image_url: publicUrl }))
    } catch (err) {
      showToast(`Upload failed: ${(err as any)?.message || err}`, 'error')
    }
    setUploading(false)
  }

  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        await locationService.updateLocation(editingId, form)
      } else {
        await locationService.createLocation(form)
      }
      setShowForm(false)
      showToast(editingId ? 'Location updated' : 'Location created', 'success')
      await load()
    } catch (err) {
      const msg = (err as any)?.message || String(err)
      setFieldErrors((prev) => ({
        ...prev,
        _form: `Save failed: ${msg}`,
      }))
      showToast(`Save failed: ${msg}`, 'error')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    setDeleteTarget(id)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await locationService.deleteLocation(deleteTarget)
      load()
    } catch (err) {
      alert(`Failed to delete: ${(err as any)?.message || err}`)
    }
    setDeleteTarget(null)
  }

  const setArray = (field: 'amenities' | 'features', raw: string) => {
    setForm((f) => ({
      ...f,
      [field]: raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2 font-display text-fg-1">Locations</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Manage coworking locations
          </p>
        </div>
        <Button icon={Plus} text="Add Location" onClick={openCreate} />
      </div>

      {showForm && (
        <Card className="mb-8 border-2 border-rule">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-fg-1">
                {editingId ? 'Edit Location' : 'New Location'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 text-fg-3 hover:text-fg-1"
              >
                <X size={18} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value
                      clearError('name')
                      setForm((f) => ({
                        ...f,
                        name: val,
                        slug: slugify(val),
                      }))
                    }}
                    onBlur={() => {
                      if (!form.name.trim())
                        setFieldErrors((p) => ({
                          ...p,
                          name: 'Name is required',
                        }))
                    }}
                    className={`w-full border rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 ${
                      fieldErrors.name ? 'border-clay' : 'border-rule'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-xs text-clay">
                      {fieldErrors.name}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Slug</label>
                  <div className="text-sm text-fg-3 font-mono px-3 py-2 border border-dashed border-rule rounded-sm bg-bg-raised">
                    {form.slug || 'auto-generated from name'}
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-label text-fg-2">Description</label>
                  <textarea
                    rows={3}
                    value={form.description ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Address *</label>
                  <input
                    value={form.address}
                    onChange={(e) => {
                      clearError('address')
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }}
                    onBlur={() => {
                      if (!form.address.trim())
                        setFieldErrors((p) => ({
                          ...p,
                          address: 'Address is required',
                        }))
                    }}
                    className={`w-full border rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 ${
                      fieldErrors.address ? 'border-clay' : 'border-rule'
                    }`}
                  />
                  {fieldErrors.address && (
                    <span className="text-xs text-clay">
                      {fieldErrors.address}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Full Address</label>
                  <input
                    value={form.full_address ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, full_address: e.target.value }))
                    }
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">City</label>
                  <input
                    value={form.city ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Main Image</label>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="w-full text-sm text-fg-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-rule file:text-sm file:bg-bg-raised file:text-fg-1 hover:file:bg-bg file:cursor-pointer"
                      />
                      {uploading && (
                        <span className="text-xs text-clay mt-1 block">
                          Uploading...
                        </span>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="relative group shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="size-20 object-cover rounded-sm border border-rule"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, image_url: '' }))
                            setImagePreview(null)
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
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Gallery Images</label>
                  <div className="flex flex-wrap gap-2">
                    {(form.images as string[] | null)?.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt={`Gallery ${i + 1}`}
                          className="size-16 object-cover rounded-sm border border-rule"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              images: (f.images as string[]).filter(
                                (_, idx) => idx !== i
                              ),
                            }))
                          }
                          className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-clay text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label className="size-16 rounded-sm border border-dashed border-rule flex items-center justify-center cursor-pointer text-fg-3 hover:text-fg-1 hover:border-fg-3 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploading(true)
                          try {
                            const storage =
                              supabaseAdmin?.storage ?? supabase.storage
                            const ext = file.name.split('.').pop()
                            const path = `locations/gallery/${Date.now()}.${ext}`
                            const { error } = await storage
                              .from('images')
                              .upload(path, file)
                            if (error) throw error
                            const {
                              data: { publicUrl },
                            } = storage.from('images').getPublicUrl(path)
                            setForm((f) => ({
                              ...f,
                              images: [
                                ...((f.images as string[]) || []),
                                publicUrl,
                              ],
                            }))
                          } catch (err) {
                            showToast(
                              `Upload failed: ${(err as any)?.message || err}`,
                              'error'
                            )
                          }
                          setUploading(false)
                        }}
                      />
                      <Plus size={16} />
                    </label>
                  </div>
                  <span className="text-caption text-fg-3">
                    {uploading
                      ? 'Uploading...'
                      : 'Click + to add gallery images'}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">
                    Amenities (comma-separated)
                  </label>
                  <input
                    value={(form.amenities ?? []).join(', ')}
                    onChange={(e) => setArray('amenities', e.target.value)}
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">
                    Features (comma-separated)
                  </label>
                  <input
                    value={(form.features ?? []).join(', ')}
                    onChange={(e) => setArray('features', e.target.value)}
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Contact Phone</label>
                  <input
                    value={form.contact_phone ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contact_phone: e.target.value }))
                    }
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Contact Email</label>
                  <input
                    value={form.contact_email ?? ''}
                    type="email"
                    onChange={(e) => {
                      clearError('contact_email')
                      setForm((f) => ({ ...f, contact_email: e.target.value }))
                    }}
                    onBlur={() => {
                      const v = form.contact_email
                      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                        setFieldErrors((p) => ({
                          ...p,
                          contact_email: 'Invalid email format',
                        }))
                      }
                    }}
                    className={`w-full border rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 ${
                      fieldErrors.contact_email ? 'border-clay' : 'border-rule'
                    }`}
                  />
                  {fieldErrors.contact_email && (
                    <span className="text-xs text-clay">
                      {fieldErrors.contact_email}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">
                    Google Maps URL
                  </label>
                  <input
                    value={form.google_maps_url ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value
                      const cleaned = extractGoogleMapsUrl(raw)
                      clearError('google_maps_url')
                      setForm((f) => ({
                        ...f,
                        google_maps_url: cleaned !== raw ? cleaned : raw,
                      }))
                    }}
                    placeholder="Paste Google Maps embed <iframe> code"
                    onBlur={() => {
                      const v = form.google_maps_url
                      if (v && !/^https?:\/\/.+/.test(v)) {
                        setFieldErrors((p) => ({
                          ...p,
                          google_maps_url: 'Must be a valid URL (http://...)',
                        }))
                      }
                    }}
                    className={`w-full border rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 ${
                      fieldErrors.google_maps_url
                        ? 'border-clay'
                        : 'border-rule'
                    }`}
                  />
                  {fieldErrors.google_maps_url && (
                    <span className="text-xs text-clay">
                      {fieldErrors.google_maps_url}
                    </span>
                  )}
                  <span className="text-caption text-fg-3">
                    Go to Google Maps → Share → Embed a map → copy the Iframe
                    code and paste here. The <code>src</code> URL is
                    auto-extracted.
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Coordinates</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-caption text-fg-3">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={form.latitude ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            latitude: e.target.value
                              ? Number(e.target.value)
                              : null,
                          }))
                        }
                        placeholder="27.7172"
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-caption text-fg-3">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={form.longitude ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            longitude: e.target.value
                              ? Number(e.target.value)
                              : null,
                          }))
                        }
                        placeholder="85.3240"
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = star <= (hoverRating || (form.rating ?? 0))
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() =>
                            setForm((f) => ({ ...f, rating: star }))
                          }
                          className={`p-0.5 transition-colors duration-150 ${
                            filled ? 'text-clay' : 'text-fg-3'
                          } hover:text-clay`}
                        >
                          <Star
                            size={22}
                            fill={filled ? 'currentColor' : 'none'}
                            strokeWidth={1.5}
                          />
                        </button>
                      )
                    })}
                    <span className="ml-2 text-sm text-fg-3">
                      {form.rating ?? 0}/5
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Capacity</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-caption text-fg-3">
                        Hot Desks
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          ((form.capacity as any)?.hotDesks as number) ?? 0
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            capacity: {
                              ...(typeof f.capacity === 'object'
                                ? f.capacity
                                : {}),
                              hotDesks: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                    <div>
                      <label className="text-caption text-fg-3">
                        Dedicated Desks
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          ((form.capacity as any)?.dedicatedDesks as number) ??
                          0
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            capacity: {
                              ...(typeof f.capacity === 'object'
                                ? f.capacity
                                : {}),
                              dedicatedDesks: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                    <div>
                      <label className="text-caption text-fg-3">
                        Private Offices
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          ((form.capacity as any)?.privateOffices as number) ??
                          0
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            capacity: {
                              ...(typeof f.capacity === 'object'
                                ? f.capacity
                                : {}),
                              privateOffices: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                    <div>
                      <label className="text-caption text-fg-3">
                        Meeting Rooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          ((form.capacity as any)?.meetingRooms as number) ?? 0
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            capacity: {
                              ...(typeof f.capacity === 'object'
                                ? f.capacity
                                : {}),
                              meetingRooms: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                    <div>
                      <label className="text-caption text-fg-3">
                        Event Seats
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          ((form.capacity as any)?.eventSeats as number) ?? 0
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            capacity: {
                              ...(typeof f.capacity === 'object'
                                ? f.capacity
                                : {}),
                              eventSeats: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-fg-1">
                    <input
                      type="checkbox"
                      checked={form.available ?? true}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          available: e.target.checked,
                        }))
                      }
                      className="accent-clay"
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-sm text-fg-1">
                    <input
                      type="checkbox"
                      checked={form.popular ?? false}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          popular: e.target.checked,
                        }))
                      }
                      className="accent-clay"
                    />
                    Popular
                  </label>
                </div>
              </div>
              {fieldErrors._form && (
                <div className="text-sm text-clay bg-clay-soft border border-clay rounded-sm px-3 py-2">
                  {fieldErrors._form}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  text={
                    saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Location'
                        : 'Create Location'
                  }
                  disabled={uploading || saving}
                />
                <Button
                  type="button"
                  variant="ghost"
                  text="Cancel"
                  onClick={() => setShowForm(false)}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-rule rounded-sm animate-pulse" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No locations yet.</p>
          <Button
            variant="outline"
            text="Add your first location"
            icon={Plus}
            onClick={openCreate}
            className="mt-4"
          />
        </div>
      ) : (
        <div className="space-y-2">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-10 shrink-0 rounded-sm bg-clay-soft flex items-center justify-center text-clay font-display text-lg">
                  {loc.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-fg-1 truncate">
                    {loc.name}
                  </div>
                  <div className="text-caption text-fg-3">
                    {loc.city}
                    {loc.available === false && (
                      <span className="ml-2 text-clay">Unavailable</span>
                    )}
                    {loc.popular && (
                      <span className="ml-2 text-moss">Popular</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Pencil}
                  onClick={() => openEdit(loc)}
                  aria-label={`Edit ${loc.name}`}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  onClick={() => handleDelete(loc.id)}
                  aria-label={`Delete ${loc.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Location"
        message="Delete this location? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
