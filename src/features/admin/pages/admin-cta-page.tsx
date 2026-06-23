import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ctaContentService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface Room {
  name: string
  location: string
}

interface FormState {
  eyebrow: string
  headline_1: string
  headline_em: string
  headline_2: string
  description: string
  rooms: Room[]
  features: string[]
  form_name_label: string
  form_email_label: string
  form_room_label: string
  form_button_text: string
}

const emptyForm: FormState = {
  eyebrow: '',
  headline_1: '',
  headline_em: '',
  headline_2: '',
  description: '',
  rooms: [{ name: '', location: '' }],
  features: [''],
  form_name_label: '',
  form_email_label: '',
  form_room_label: '',
  form_button_text: '',
}

export function AdminCtaPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ctaContentService
      .get()
      .then((data) => {
        if (data) {
          setForm({
            eyebrow: data.eyebrow ?? '',
            headline_1: data.headline_1 ?? '',
            headline_em: data.headline_em ?? '',
            headline_2: data.headline_2 ?? '',
            description: data.description ?? '',
            rooms: (data.rooms as Room[]) ?? [],
            features: (data.features as string[]) ?? [],
            form_name_label: data.form_name_label ?? '',
            form_email_label: data.form_email_label ?? '',
            form_room_label: data.form_room_label ?? '',
            form_button_text: data.form_button_text ?? '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await ctaContentService.upsert(form)
      showToast('CTA content saved!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
    setSaving(false)
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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">CTA Section</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Edit the call-to-action section content
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
              placeholder="Your desk is waiting"
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
                placeholder="Come by "
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
                placeholder="tomorrow"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 font-medium"
                style={{ color: 'var(--color-clay)' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Headline (after)</label>
              <input
                value={form.headline_2}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headline_2: e.target.value }))
                }
                placeholder=". Stay as long as you like."
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
              placeholder="Leave a name and an email…"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">Rooms</h2>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          {form.rooms.map((room, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Name</label>
                <input
                  value={room.name}
                  onChange={(e) => {
                    const rooms = [...form.rooms]
                    rooms[i] = { ...rooms[i], name: e.target.value }
                    setForm((f) => ({ ...f, rooms }))
                  }}
                  placeholder="Dhobighat"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-caption text-fg-3">Location</label>
                <input
                  value={room.location}
                  onChange={(e) => {
                    const rooms = [...form.rooms]
                    rooms[i] = { ...rooms[i], location: e.target.value }
                    setForm((f) => ({ ...f, rooms }))
                  }}
                  placeholder="Kathmandu"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
                />
              </div>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            text="Add Room"
            onClick={() =>
              setForm((f) => ({
                ...f,
                rooms: [...f.rooms, { name: '', location: '' }],
              }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">Features</h2>
        </CardHeader>
        <CardContent className="space-y-2 max-w-2xl">
          {form.features.map((feat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={feat}
                onChange={(e) => {
                  const features = [...form.features]
                  features[i] = e.target.value
                  setForm((f) => ({ ...f, features }))
                }}
                placeholder="No deposit"
                className="flex-1 border border-rule rounded-sm px-2 py-1.5 text-xs bg-transparent text-fg-1"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    features: f.features.filter((_, k) => k !== i),
                  }))
                }
                className="text-fg-3 hover:text-clay cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            text="Add Feature"
            onClick={() =>
              setForm((f) => ({ ...f, features: [...f.features, ''] }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">Form Fields</h2>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Name Label</label>
              <input
                value={form.form_name_label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, form_name_label: e.target.value }))
                }
                placeholder="Your name"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Email Label</label>
              <input
                value={form.form_email_label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, form_email_label: e.target.value }))
                }
                placeholder="Email"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Room Label</label>
              <input
                value={form.form_room_label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, form_room_label: e.target.value }))
                }
                placeholder="Which room"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Button Text</label>
              <input
                value={form.form_button_text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, form_button_text: e.target.value }))
                }
                placeholder="Hold my desk"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button text="Save All" onClick={handleSave} disabled={saving} />
    </div>
  )
}
