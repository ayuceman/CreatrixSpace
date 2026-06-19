import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { amenitiesService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'

interface AmenityItem {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
}

export function AdminAmenitiesPage() {
  const [eyebrow, setEyebrow] = useState('')
  const [headline1, setHeadline1] = useState('')
  const [headlineEm, setHeadlineEm] = useState('')
  const [headline2, setHeadline2] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<AmenityItem[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([amenitiesService.getContent(), amenitiesService.getAll()])
      .then(([content, data]) => {
        if (content) {
          setEyebrow(content.eyebrow ?? '')
          setHeadline1(content.headline_1 ?? '')
          setHeadlineEm(content.headline_em ?? '')
          setHeadline2(content.headline_2 ?? '')
          setDescription(content.description ?? '')
        }
        setItems(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const saveHeader = async () => {
    try {
      await amenitiesService.upsertContent({
        eyebrow,
        headline_1: headline1,
        headline_em: headlineEm,
        headline_2: headline2,
        description,
      })
      showToast('Amenities header saved!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: '',
        title: '',
        description: '',
        icon: 'clock',
        sort_order: prev.length + 1,
      },
    ])
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
      const existing = await client.from('amenities').select('id')
      const existingIds = new Set((existing.data || []).map((r: any) => r.id))

      const incomingIds = new Set(items.map((r) => r.id).filter(Boolean))

      for (const item of items) {
        if (item.id && existingIds.has(item.id)) {
          await client.from('amenities').update(item).eq('id', item.id)
        } else {
          const { id: oldId, ...rest } = item
          await client.from('amenities').upsert(rest).select()
        }
      }

      for (const id of existingIds) {
        if (!incomingIds.has(id)) {
          await client.from('amenities').delete().eq('id', id)
        }
      }

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

      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">Header</h2>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Eyebrow</label>
            <input
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="What's in the room"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Headline (before)</label>
              <input
                value={headline1}
                onChange={(e) => setHeadline1(e.target.value)}
                placeholder="The things you'd "
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">
                Headline (emphasized)
              </label>
              <input
                value={headlineEm}
                onChange={(e) => setHeadlineEm(e.target.value)}
                placeholder="expect"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Headline (after)</label>
              <input
                value={headline2}
                onChange={(e) => setHeadline2(e.target.value)}
                placeholder=", kept well."
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="We don't have a foosball table…"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
          <Button text="Save Header" onClick={saveHeader} />
        </CardContent>
      </Card>

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
        <Card key={i}>
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
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Title</label>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="24/7 access"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Icon</label>
                <input
                  value={item.icon}
                  onChange={(e) => updateItem(i, { icon: e.target.value })}
                  placeholder="clock"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1 font-mono"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-caption text-fg-3">Description</label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Key fob for residents…"
                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-caption text-fg-3">Sort Order</label>
              <input
                type="number"
                value={item.sort_order}
                onChange={(e) =>
                  updateItem(i, { sort_order: parseInt(e.target.value) || 0 })
                }
                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button text="Save All Amenities" onClick={saveItems} disabled={saving} />
    </div>
  )
}
