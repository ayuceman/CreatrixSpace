import { useState, useEffect, useRef } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { heroService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'

function parseSubBadge(html: string) {
  const m = html.match(
    /class="text-fg-1 font-medium">([^<]+)<\/b>\s*([^<]*?)\s*<b\s[^>]*class="text-fg-1 font-medium">([^<]+)<\/b>\s*([\s\S]*)/
  )
  return {
    stat_1: m?.[1] ?? '5 private offices',
    middle: m?.[2] ?? 'just opened across the three buildings — and',
    stat_2: m?.[3] ?? '25 hot desks',
    end: m?.[4] ?? 'today',
  }
}

function buildSubBadge(parts: {
  stat_1: string
  middle: string
  stat_2: string
  end: string
}) {
  return `<b class="text-fg-1 font-medium">${parts.stat_1}</b> ${parts.middle} <b class="text-fg-1 font-medium">${parts.stat_2}</b> ${parts.end}`
}

interface HeroImage {
  src: string
  alt: string
  label: string
  location: string
}

interface PricingItem {
  label: string
  sublabel: string
}

const emptyForm = {
  badge: 'Now booking',
  subBadgeParts: {
    stat_1: '5 private offices',
    middle: 'just opened across the three buildings — and',
    stat_2: '25 hot desks',
    end: 'today',
  } as { stat_1: string; middle: string; stat_2: string; end: string },
  headline_1: '',
  headline_2: 'to work',
  headline_3: '',
  subheading: '',
  button_text: 'Book a tour',
  whatsapp_text: 'WhatsApp',
  images: [] as HeroImage[],
  pricing: [] as PricingItem[],
}

export function AdminHeroPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setToast = (text: string, type: 'success' | 'error' = 'success') => {
    showToast(text, type)
  }

  useEffect(() => {
    heroService.get().then((data) => {
      if (data) {
        setForm({
          badge: data.badge ?? '',
          subBadgeParts: parseSubBadge(data.sub_badge ?? ''),
          headline_1: data.headline_1 ?? '',
          headline_2: data.headline_2 ?? 'to work',
          headline_3: data.headline_3 ?? '',
          subheading: data.subheading ?? '',
          button_text: data.button_text ?? 'Book a tour',
          whatsapp_text: data.whatsapp_text ?? 'WhatsApp',
          images: (data.images as HeroImage[]) ?? [],
          pricing: (data.pricing as PricingItem[]) ?? [],
        })
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { subBadgeParts, ...dbFields } = form
      const payload = {
        ...dbFields,
        sub_badge: buildSubBadge(subBadgeParts),
      }
      await heroService.upsert(payload)
      setToast('Hero content saved!')
    } catch (err) {
      setToast(`Save failed: ${(err as any)?.message || err}`)
    }
    setSaving(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const storage = supabaseAdmin?.storage ?? supabase.storage
      const ext = file.name.split('.').pop()
      const filePath = `hero/${Date.now()}.${ext}`
      const { error } = await storage.from('images').upload(filePath, file)
      if (error) throw error
      const {
        data: { publicUrl },
      } = storage.from('images').getPublicUrl(filePath)
      setForm((f) => ({
        ...f,
        images: [
          ...f.images,
          { src: publicUrl, alt: '', label: '', location: '' },
        ],
      }))
    } catch (err) {
      showToast(`Upload failed: ${(err as any)?.message || err}`, 'error')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const updateImage = (
    index: number,
    field: keyof HeroImage,
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }))
  }

  const replaceImage = async (index: number, file: File) => {
    setUploading(true)
    try {
      const storage = supabaseAdmin?.storage ?? supabase.storage
      const ext = file.name.split('.').pop()
      const filePath = `hero/${Date.now()}_${index}.${ext}`
      const { error } = await storage.from('images').upload(filePath, file)
      if (error) throw error
      const {
        data: { publicUrl },
      } = storage.from('images').getPublicUrl(filePath)
      setForm((f) => ({
        ...f,
        images: f.images.map((img, i) =>
          i === index ? { ...img, src: publicUrl } : img
        ),
      }))
    } catch (err) {
      showToast(`Upload failed: ${(err as any)?.message || err}`, 'error')
    }
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }))
  }

  const addPricing = () => {
    setForm((f) => ({
      ...f,
      pricing: [...f.pricing, { label: '', sublabel: '' }],
    }))
  }

  const updatePricing = (
    index: number,
    field: keyof PricingItem,
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      pricing: f.pricing.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const removePricing = (index: number) => {
    setForm((f) => ({
      ...f,
      pricing: f.pricing.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-rule rounded-sm animate-pulse w-48" />
        <div className="h-96 bg-rule rounded-sm animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h3 font-display text-fg-1">Hero Section</h1>
        <p className="text-body-sm text-fg-3 mt-1">
          Edit the homepage hero content, images, and pricing strip
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">Text Content</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Badge</label>
                <input
                  value={form.badge}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, badge: e.target.value }))
                  }
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">WhatsApp Button</label>
                <input
                  value={form.whatsapp_text}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, whatsapp_text: e.target.value }))
                  }
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
            </div>
            <div className="text-label text-fg-2 mb-1">Sub Badge</div>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-caption text-fg-3">Stat 1 (bold)</label>
                <input
                  value={form.subBadgeParts.stat_1}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      subBadgeParts: {
                        ...f.subBadgeParts,
                        stat_1: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. 5 private offices"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-caption text-fg-3">Middle text</label>
                <input
                  value={form.subBadgeParts.middle}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      subBadgeParts: {
                        ...f.subBadgeParts,
                        middle: e.target.value,
                      },
                    }))
                  }
                  placeholder="just opened across..."
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-caption text-fg-3">Stat 2 (bold)</label>
                <input
                  value={form.subBadgeParts.stat_2}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      subBadgeParts: {
                        ...f.subBadgeParts,
                        stat_2: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. 25 hot desks"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-caption text-fg-3">End text</label>
                <input
                  value={form.subBadgeParts.end}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      subBadgeParts: {
                        ...f.subBadgeParts,
                        end: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. today"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Headline Line 1</label>
                <input
                  value={form.headline_1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, headline_1: e.target.value }))
                  }
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">
                  Headline Line 2 (em)
                </label>
                <input
                  value={form.headline_2}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, headline_2: e.target.value }))
                  }
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Headline Line 3</label>
                <input
                  value={form.headline_3}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, headline_3: e.target.value }))
                  }
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Subheading</label>
              <textarea
                rows={3}
                value={form.subheading}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subheading: e.target.value }))
                }
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Button Text</label>
              <input
                value={form.button_text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, button_text: e.target.value }))
                }
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              Hero Images
              <span className="text-label text-fg-3 ml-2 font-normal">
                {form.images.length} images
              </span>
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                key={form.images.length}
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

            {form.images.map((img, i) => (
              <div
                key={i}
                className="flex gap-4 items-start border border-rule rounded-sm p-4 bg-bg-raised"
              >
                <div className="shrink-0 pt-1 text-fg-3">
                  <GripVertical size={16} />
                </div>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="size-20 object-cover rounded-sm border border-rule shrink-0"
                />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-caption text-fg-3">Label</label>
                    <input
                      value={img.label}
                      onChange={(e) => updateImage(i, 'label', e.target.value)}
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-caption text-fg-3">Location</label>
                    <input
                      value={img.location}
                      onChange={(e) =>
                        updateImage(i, 'location', e.target.value)
                      }
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-caption text-fg-3">Alt Text</label>
                    <input
                      value={img.alt}
                      onChange={(e) => updateImage(i, 'alt', e.target.value)}
                      className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-caption text-fg-3">
                      Change image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      key={img.src}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) replaceImage(i, file)
                        e.target.value = ''
                      }}
                      className="w-full text-xs text-fg-2 file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border file:border-rule file:text-xs file:bg-bg file:text-fg-1 hover:file:bg-bg-raised file:cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="shrink-0 text-fg-3 hover:text-clay transition-colors cursor-pointer pt-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-display text-fg-1">
                Pricing Strip
                <span className="text-label text-fg-3 ml-2 font-normal">
                  {form.pricing.length} items
                </span>
              </h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                text="Add Item"
                icon={Plus}
                onClick={addPricing}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.pricing.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-center border border-rule rounded-sm px-4 py-3 bg-bg-raised"
              >
                <div className="flex-1 space-y-1.5">
                  <input
                    value={item.label}
                    onChange={(e) => updatePricing(i, 'label', e.target.value)}
                    placeholder="e.g. NPR 800"
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    value={item.sublabel}
                    onChange={(e) =>
                      updatePricing(i, 'sublabel', e.target.value)
                    }
                    placeholder="e.g. A day · no deposit"
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePricing(i)}
                  className="shrink-0 text-fg-3 hover:text-clay transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            text={saving ? 'Saving...' : 'Save Hero Content'}
            disabled={saving}
          />
        </div>
      </form>
    </div>
  )
}
