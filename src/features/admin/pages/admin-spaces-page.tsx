import { useState, useEffect, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { spacesService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'

interface StatItem {
  value: string
  label: string
}
interface SpaceCard {
  id: string
  badge: string
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  stats: StatItem[]
  tags: string[]
  waMsg: string
  cta: string
}

interface FormState {
  eyebrow: string
  headline_1: string
  headline_em: string
  headline_2: string
  description: string
  cards: SpaceCard[]
  cta_bar_eyebrow: string
  cta_bar_text: string
  cta_bar_whatsapp: string
}

function emptyCard(): SpaceCard {
  return {
    id: '',
    badge: '',
    imageSrc: '',
    imageAlt: '',
    title: '',
    description: '',
    stats: [],
    tags: [],
    waMsg: '',
    cta: '',
  }
}

export function AdminSpacesPage() {
  const [form, setForm] = useState<FormState>({
    eyebrow: '',
    headline_1: '',
    headline_em: '',
    headline_2: '',
    description: '',
    cards: [],
    cta_bar_eyebrow: '',
    cta_bar_text: '',
    cta_bar_whatsapp: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadIndexRef = useRef<number>(-1)

  useEffect(() => {
    spacesService
      .get()
      .then((data) => {
        if (data) {
          setForm({
            eyebrow: data.eyebrow ?? '',
            headline_1: data.headline_1 ?? '',
            headline_em: data.headline_em ?? '',
            headline_2: data.headline_2 ?? '',
            description: data.description ?? '',
            cards: (data.cards as SpaceCard[]) ?? [],
            cta_bar_eyebrow: data.cta_bar_eyebrow ?? '',
            cta_bar_text: data.cta_bar_text ?? '',
            cta_bar_whatsapp: data.cta_bar_whatsapp ?? '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await spacesService.upsert(form)
      showToast('Spaces content saved!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
    setSaving(false)
  }

  const addCard = () =>
    setForm((f) => ({ ...f, cards: [...f.cards, emptyCard()] }))
  const removeCard = (i: number) =>
    setForm((f) => ({ ...f, cards: f.cards.filter((_, k) => k !== i) }))
  const updateCard = (i: number, patch: Partial<SpaceCard>) =>
    setForm((f) => {
      const cards = [...f.cards]
      cards[i] = { ...cards[i], ...patch }
      return { ...f, cards }
    })

  const addStat = (ci: number) => {
    const card = form.cards[ci]
    updateCard(ci, { stats: [...card.stats, { value: '', label: '' }] })
  }
  const updateStat = (ci: number, si: number, patch: Partial<StatItem>) => {
    const card = form.cards[ci]
    const stats = [...card.stats]
    stats[si] = { ...stats[si], ...patch }
    updateCard(ci, { stats })
  }
  const removeStat = (ci: number, si: number) => {
    const card = form.cards[ci]
    updateCard(ci, { stats: card.stats.filter((_, k) => k !== si) })
  }

  const addTag = (ci: number) => {
    const card = form.cards[ci]
    updateCard(ci, { tags: [...card.tags, ''] })
  }
  const updateTag = (ci: number, ti: number, value: string) => {
    const card = form.cards[ci]
    const tags = [...card.tags]
    tags[ti] = value
    updateCard(ci, { tags })
  }
  const removeTag = (ci: number, ti: number) => {
    const card = form.cards[ci]
    updateCard(ci, { tags: card.tags.filter((_, k) => k !== ti) })
  }

  const triggerUpload = (ci: number) => {
    uploadIndexRef.current = ci
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ci = uploadIndexRef.current
    if (ci < 0) return
    setUploading(ci)
    try {
      const client = supabaseAdmin ?? supabase
      const ext = file.name.split('.').pop()
      const fileName = `spaces/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await client.storage
        .from('images')
        .upload(fileName, file)
      if (uploadError) throw uploadError
      const { data: urlData } = client.storage
        .from('images')
        .getPublicUrl(fileName)
      updateCard(ci, { imageSrc: urlData.publicUrl })
      showToast('Image uploaded!')
    } catch (err) {
      showToast(`Upload failed: ${(err as any)?.message || err}`, 'error')
    }
    setUploading(null)
    e.target.value = ''
  }

  if (loading) {
    return <div className="p-8 text-fg-2">Loading…</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Spaces Section</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Edit event space & training cards shown in the spaces section
          </p>
        </div>
        <Button text="Save All" onClick={handleSave} disabled={saving} />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">Header</h2>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Eyebrow</label>
            <input
              value={form.eyebrow}
              onChange={(e) =>
                setForm((f) => ({ ...f, eyebrow: e.target.value }))
              }
              placeholder="Also at CreatrixSpace"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Headline (before)</label>
              <input
                value={form.headline_1}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headline_1: e.target.value }))
                }
                placeholder="Rooms for "
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">
                Headline (emphasized)
              </label>
              <input
                value={form.headline_em}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headline_em: e.target.value }))
                }
                placeholder="weekends"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Headline (after)</label>
              <input
                value={form.headline_2}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headline_2: e.target.value }))
                }
                placeholder=" and cohorts."
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="On Saturdays and Sundays the event rooms open up…"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-h4 font-display text-fg-1">
          Cards ({form.cards.length})
        </h2>
        <Button
          size="sm"
          variant="outline"
          text="Add Card"
          icon={Plus}
          onClick={addCard}
        />
      </div>

      {form.cards.map((card, ci) => (
        <Card key={ci}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-display text-fg-1">
                {card.title || `Card ${ci + 1}`}
              </h2>
              <Button
                size="sm"
                variant="ghost"
                icon={X}
                onClick={() => removeCard(ci)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Title</label>
                <input
                  value={card.title}
                  onChange={(e) => updateCard(ci, { title: e.target.value })}
                  placeholder="Event space"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-caption text-fg-3">CTA</label>
                <input
                  value={card.cta}
                  onChange={(e) => updateCard(ci, { cta: e.target.value })}
                  placeholder="Enquire for an event"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Badge</label>
                <input
                  value={card.badge}
                  onChange={(e) => updateCard(ci, { badge: e.target.value })}
                  placeholder="Weekends"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Image Alt</label>
                <input
                  value={card.imageAlt}
                  onChange={(e) => updateCard(ci, { imageAlt: e.target.value })}
                  placeholder="Event space at CreatrixSpace"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-caption text-fg-3">Image</label>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => {
                      uploadIndexRef.current = ci
                      handleImageUpload(e)
                    }}
                    className="w-full text-sm text-fg-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-rule file:text-sm file:bg-bg-raised file:text-fg-1 hover:file:bg-bg file:cursor-pointer"
                  />
                  {uploading === ci && (
                    <span className="text-xs text-clay mt-1 block">
                      Uploading...
                    </span>
                  )}
                </div>
                {card.imageSrc && (
                  <div className="relative group shrink-0">
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      className="size-20 object-cover rounded-sm border border-rule"
                    />
                    <button
                      type="button"
                      onClick={() => updateCard(ci, { imageSrc: '' })}
                      className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-clay text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-caption text-fg-3">Description</label>
              <textarea
                rows={3}
                value={card.description}
                onChange={(e) =>
                  updateCard(ci, { description: e.target.value })
                }
                placeholder="Sixty-seat event room at Dhobighat…"
                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
              />
            </div>

            <div className="space-y-1">
              <label className="text-caption text-fg-3">WhatsApp Message</label>
              <textarea
                rows={2}
                value={card.waMsg}
                onChange={(e) => updateCard(ci, { waMsg: e.target.value })}
                placeholder="Hello CreatrixSpace — I'd like to enquire…"
                className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-fg-3">Stats</span>
                <Button
                  size="sm"
                  variant="ghost"
                  text="+"
                  onClick={() => addStat(ci)}
                  className="!px-2 !py-0.5 text-xs"
                />
              </div>
              {card.stats.map((stat, si) => (
                <div key={si} className="flex gap-2 mb-1 items-center">
                  <input
                    value={stat.value}
                    onChange={(e) =>
                      updateStat(ci, si, { value: e.target.value })
                    }
                    placeholder="6 → 60"
                    className="flex-1 border border-rule rounded-sm px-2 py-1 text-xs bg-transparent text-fg-1"
                  />
                  <input
                    value={stat.label}
                    onChange={(e) =>
                      updateStat(ci, si, { label: e.target.value })
                    }
                    placeholder="Seats per room"
                    className="flex-1 border border-rule rounded-sm px-2 py-1 text-xs bg-transparent text-fg-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(ci, si)}
                    className="text-fg-3 hover:text-clay cursor-pointer text-xs"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-fg-3">Tags</span>
                <Button
                  size="sm"
                  variant="ghost"
                  text="+"
                  onClick={() => addTag(ci)}
                  className="!px-2 !py-0.5 text-xs"
                />
              </div>
              {card.tags.map((tag, ti) => (
                <div key={ti} className="flex gap-2 mb-1">
                  <input
                    value={tag}
                    onChange={(e) => updateTag(ci, ti, e.target.value)}
                    placeholder="Product launches"
                    className="flex-1 border border-rule rounded-sm px-2 py-1 text-xs bg-transparent text-fg-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(ci, ti)}
                    className="text-fg-3 hover:text-clay cursor-pointer text-xs"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">CTA Bar</h2>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Eyebrow</label>
            <input
              value={form.cta_bar_eyebrow}
              onChange={(e) =>
                setForm((f) => ({ ...f, cta_bar_eyebrow: e.target.value }))
              }
              placeholder="For trainers, institutes, and event organisers"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Text</label>
            <textarea
              rows={3}
              value={form.cta_bar_text}
              onChange={(e) =>
                setForm((f) => ({ ...f, cta_bar_text: e.target.value }))
              }
              placeholder="We work on flexible blocks…"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">WhatsApp Button Text</label>
            <input
              value={form.cta_bar_whatsapp}
              onChange={(e) =>
                setForm((f) => ({ ...f, cta_bar_whatsapp: e.target.value }))
              }
              placeholder="WhatsApp the spaces team"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
        </CardContent>
      </Card>

      <Button text="Save All" onClick={handleSave} disabled={saving} />
    </div>
  )
}
