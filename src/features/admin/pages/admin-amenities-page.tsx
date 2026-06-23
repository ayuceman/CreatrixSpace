import { useState, useEffect, useRef } from 'react'
import {
  Plus,
  X,
  Clock,
  Wifi,
  Users,
  CalendarDays,
  Sunrise,
  Coffee,
  Phone,
  Mail,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { amenitiesService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'

interface AmenityItem {
  id: string
  title: string
  description: string
  icon: string | null
  sort_order: number | null
  _key?: string
}

let itemKeyCounter = Date.now()
function nextKey() {
  return `item_${itemKeyCounter++}`
}

export function AdminAmenitiesPage() {
  const [items, setItems] = useState<AmenityItem[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const iconOptions: { label: string; Icon: LucideIcon }[] = [
    { label: 'clock', Icon: Clock },
    { label: 'wifi', Icon: Wifi },
    { label: 'presentation', Icon: Users },
    { label: 'calendar', Icon: CalendarDays },
    { label: 'sun', Icon: Sunrise },
    { label: 'coffee', Icon: Coffee },
    { label: 'phone', Icon: Phone },
    { label: 'mail', Icon: Mail },
    { label: 'search', Icon: Search },
  ]

  const iconPreview: Record<string, LucideIcon> = {}
  for (const { label, Icon } of iconOptions) {
    iconPreview[label] = Icon
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    amenitiesService
      .getAll()
      .then((data) => {
        setItems(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const addItem = () => {
    const newItem: AmenityItem & { _key: string } = {
      id: '',
      title: '',
      description: '',
      icon: 'clock',
      sort_order: 1,
      _key: nextKey(),
    }
    setItems((prev) => [newItem, ...prev])
  }

  const updateItem = (i: number, patch: Partial<AmenityItem>) => {
    setItems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], ...patch }
      return next
    })
  }

  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, k) => k !== i))
  }

  const saveItems = async () => {
    setSaving(true)
    try {
      const client = supabaseAdmin ?? supabase
      const savedIds = new Set<string>()

      for (const item of items) {
        const { _key, ...dbItem } = item
        if (dbItem.id) {
          await client.from('amenities').update(dbItem).eq('id', dbItem.id)
          savedIds.add(dbItem.id)
        } else {
          const { id: _id, ...rest } = dbItem
          const { data } = await client.from('amenities').insert(rest).select()
          if (data?.[0]?.id) savedIds.add(data[0].id)
        }
      }

      const { data: all } = await client.from('amenities').select('id')
      for (const row of all || []) {
        if (!savedIds.has(row.id)) {
          await client.from('amenities').delete().eq('id', row.id)
        }
      }

      const { data: refreshed } = await client
        .from('amenities')
        .select('*')
        .order('sort_order', { ascending: true })
      if (refreshed) setItems(refreshed)

      showToast('Amenities saved!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="p-8 text-fg-2">Loading…</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Amenities Section</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Edit the amenities header and items shown in the amenities section
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-h4 font-display text-fg-1">
          Amenity Items ({items.length})
        </h2>
        <Button
          size="sm"
          variant="outline"
          text="Add Item"
          icon={Plus}
          onClick={addItem}
        />
      </div>

      {items.map((item, i) => (
        <Card key={item._key || item.id || i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-display text-fg-1">
                {item.title || `Item ${i + 1}`}
              </h2>
              <Button
                size="sm"
                variant="ghost"
                icon={X}
                onClick={() => removeItem(i)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['details']}>
              <AccordionItem value="details">
                <AccordionTrigger>Item Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-caption text-fg-3">Title</label>
                        <input
                          value={item.title}
                          onChange={(e) =>
                            updateItem(i, { title: e.target.value })
                          }
                          placeholder="24/7 access"
                          className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                        />
                      </div>
                      <div className="space-y-1 relative">
                        <label className="text-caption text-fg-3">Icon</label>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(openDropdown === i ? null : i)
                          }
                          className="w-full flex items-center gap-2 border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                        >
                          {(() => {
                            const Icon =
                              iconPreview[item.icon ?? 'clock'] || Clock
                            return <Icon size={14} />
                          })()}
                          <span>{item.icon || 'clock'}</span>
                        </button>
                        {openDropdown === i && (
                          <div
                            ref={dropdownRef}
                            className="absolute z-10 top-full mt-1 left-0 w-full border border-rule rounded-sm bg-white shadow-lg"
                          >
                            {iconOptions.map(({ label, Icon }) => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => {
                                  updateItem(i, { icon: label })
                                  setOpenDropdown(null)
                                }}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-gray-100 text-left ${item.icon === label ? 'bg-blue-100 font-semibold' : ''}`}
                              >
                                <Icon size={14} />
                                <span>{label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-caption text-fg-3">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(i, { description: e.target.value })
                        }
                        placeholder="Key fob for residents…"
                        className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-caption text-fg-3">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={item.sort_order ?? ''}
                        onChange={(e) =>
                          updateItem(i, {
                            sort_order: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <Button text="Save All Amenities" onClick={saveItems} disabled={saving} />
    </div>
  )
}
