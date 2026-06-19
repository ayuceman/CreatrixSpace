import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { bookTourContentService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface InterestOption {
  value: string
  label: string
}

interface HeadlineParts {
  prefix: string
  em: string
  suffix: string
}

interface BookTourForm {
  step1_headline_parts: HeadlineParts
  step1_description: string
  step2_headline_parts: HeadlineParts
  confirmation_eyebrow: string
  confirmation_tour_details: string
  time_slots: string[]
  interest_options: InterestOption[]
}

function parseHeadline(html: string): HeadlineParts {
  const match = html.match(/^(.*?)<em class="text-clay">(.*?)<\/em>(.*)$/)
  if (!match) return { prefix: html || '', em: '', suffix: '' }
  return { prefix: match[1], em: match[2], suffix: match[3] }
}

function buildHeadline(parts: HeadlineParts): string {
  const { prefix, em, suffix } = parts
  if (!em) return prefix + suffix
  return `${prefix}<em class="text-clay">${em}</em>${suffix}`
}

const defaultHeadline1 = parseHeadline(
  'Come by, have a coffee, <em class="text-clay">look around</em>.'
)
const defaultHeadline2 = parseHeadline(
  'A couple of <em class="text-clay">details</em>.'
)

const emptyForm: BookTourForm = {
  step1_headline_parts: defaultHeadline1,
  step1_description:
    "A tour takes about twenty minutes. You'll meet whoever's running the floor that day; the coffee is on us.",
  step2_headline_parts: defaultHeadline2,
  confirmation_eyebrow: 'Confirmed',
  confirmation_tour_details:
    "The full floor, the meeting rooms, the phone booths, the terrace. We'll show you the desk we'd put you at, what the wifi feels like, and where the coffee comes from.",
  time_slots: ['11:00', '12:00', '14:00', '15:00', '16:00'],
  interest_options: [
    { value: 'day', label: 'Day Pass — NPR 800 / day' },
    { value: 'week', label: 'Week Pass — NPR 3,000 / week' },
    { value: 'resident', label: 'Dedicated Desk — NPR 8,000 / month' },
    { value: 'studio-2', label: 'Studio for two — NPR 24,000 / month' },
    { value: 'studio-4', label: 'Studio for four — NPR 46,000 / month' },
    {
      value: 'studio-8',
      label: 'Studio for six to eight — NPR From 78,000 / month',
    },
    { value: 'virtual', label: 'Virtual Office — NPR 6,000 / month' },
    { value: 'just-looking', label: 'Just looking, thanks' },
  ],
}

let optCounter = Date.now()
function genOptValue() {
  return `opt_${optCounter++}`
}

export function AdminBookTourPage() {
  const [form, setForm] = useState<BookTourForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    bookTourContentService
      .get()
      .then((data) => {
        if (data) {
          setForm({
            step1_headline_parts: parseHeadline(data.step1_headline ?? ''),
            step1_description:
              data.step1_description ?? emptyForm.step1_description,
            step2_headline_parts: parseHeadline(data.step2_headline ?? ''),
            confirmation_eyebrow:
              data.confirmation_eyebrow ?? emptyForm.confirmation_eyebrow,
            confirmation_tour_details:
              data.confirmation_tour_details ??
              emptyForm.confirmation_tour_details,
            time_slots: (data.time_slots as string[]) ?? emptyForm.time_slots,
            interest_options:
              (data.interest_options as InterestOption[]) ??
              emptyForm.interest_options,
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { step1_headline_parts, step2_headline_parts, ...rest } = form
      const payload = {
        ...rest,
        step1_headline: buildHeadline(step1_headline_parts),
        step2_headline: buildHeadline(step2_headline_parts),
      }
      await bookTourContentService.upsert(payload)
      showToast('Book a Tour content saved!')
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">
            Book a Tour Content
          </h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Edit the text and options shown in the Book a Tour slide-out panel
          </p>
        </div>
        <Button
          size="sm"
          variant="dark"
          text={saving ? 'Saving...' : 'Save All'}
          onClick={handleSave}
          disabled={saving}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              Step 1 — Where & When
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-label text-fg-2">Headline</label>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
                <div className="space-y-1">
                  <label className="text-caption text-fg-3">Text</label>
                  <input
                    value={form.step1_headline_parts.prefix}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        step1_headline_parts: {
                          ...f.step1_headline_parts,
                          prefix: e.target.value,
                        },
                      }))
                    }
                    placeholder="Come by, have a coffee,"
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-caption text-fg-3">Emphasis</label>
                  <input
                    value={form.step1_headline_parts.em}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        step1_headline_parts: {
                          ...f.step1_headline_parts,
                          em: e.target.value,
                        },
                      }))
                    }
                    placeholder="look around"
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1 font-medium"
                    style={{ color: 'var(--color-clay)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-caption text-fg-3">Text</label>
                  <input
                    value={form.step1_headline_parts.suffix}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        step1_headline_parts: {
                          ...f.step1_headline_parts,
                          suffix: e.target.value,
                        },
                      }))
                    }
                    placeholder="."
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                  />
                </div>
              </div>
              <div className="text-xs text-fg-3 italic">
                Preview: {form.step1_headline_parts.prefix}
                <em className="text-clay">{form.step1_headline_parts.em}</em>
                {form.step1_headline_parts.suffix}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">Description</label>
              <textarea
                rows={3}
                value={form.step1_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, step1_description: e.target.value }))
                }
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-label text-fg-2">
                Time Slots (one per line)
              </label>
              <textarea
                rows={4}
                value={form.time_slots.join('\n')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    time_slots: e.target.value.split('\n').filter(Boolean),
                  }))
                }
                placeholder="11:00"
                className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              Step 2 — Who You Are
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-label text-fg-2">Headline</label>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
                <div className="space-y-1">
                  <label className="text-caption text-fg-3">Text</label>
                  <input
                    value={form.step2_headline_parts.prefix}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        step2_headline_parts: {
                          ...f.step2_headline_parts,
                          prefix: e.target.value,
                        },
                      }))
                    }
                    placeholder="A couple of"
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-caption text-fg-3">Emphasis</label>
                  <input
                    value={form.step2_headline_parts.em}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        step2_headline_parts: {
                          ...f.step2_headline_parts,
                          em: e.target.value,
                        },
                      }))
                    }
                    placeholder="details"
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1 font-medium"
                    style={{ color: 'var(--color-clay)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-caption text-fg-3">Text</label>
                  <input
                    value={form.step2_headline_parts.suffix}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        step2_headline_parts: {
                          ...f.step2_headline_parts,
                          suffix: e.target.value,
                        },
                      }))
                    }
                    placeholder="."
                    className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1"
                  />
                </div>
              </div>
              <div className="text-xs text-fg-3 italic">
                Preview: {form.step2_headline_parts.prefix}
                <em className="text-clay">{form.step2_headline_parts.em}</em>
                {form.step2_headline_parts.suffix}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation */}
      <Card>
        <CardHeader>
          <h2 className="text-h4 font-display text-fg-1">
            Step 3 — Confirmation
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Eyebrow label</label>
            <input
              value={form.confirmation_eyebrow}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  confirmation_eyebrow: e.target.value,
                }))
              }
              placeholder="Confirmed"
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-label text-fg-2">Tour details text</label>
            <textarea
              rows={4}
              value={form.confirmation_tour_details}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  confirmation_tour_details: e.target.value,
                }))
              }
              className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interest Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-h4 font-display text-fg-1">Interest Options</h2>
            <Button
              size="sm"
              variant="outline"
              text="Add Option"
              icon={Plus}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  interest_options: [
                    ...f.interest_options,
                    { value: genOptValue(), label: '' },
                  ],
                }))
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.interest_options.map((opt, i) => (
            <div
              key={opt.value}
              className="flex gap-3 items-start border border-rule rounded-sm p-3 bg-bg-raised"
            >
              <div className="flex-1 space-y-1">
                <label className="text-caption text-fg-3">Label</label>
                <input
                  value={opt.label}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      interest_options: f.interest_options.map((o, j) =>
                        j === i ? { ...o, label: e.target.value } : o
                      ),
                    }))
                  }
                  placeholder="Day Pass — NPR 800 / day"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="w-40 space-y-1">
                <label className="text-caption text-fg-3">Value</label>
                <input
                  value={opt.value}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      interest_options: f.interest_options.map((o, j) =>
                        j === i ? { ...o, value: e.target.value } : o
                      ),
                    }))
                  }
                  placeholder="day-pass"
                  className="w-full border border-rule rounded-sm px-2 py-1.5 text-sm bg-transparent text-fg-1 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    interest_options: f.interest_options.filter(
                      (_, j) => j !== i
                    ),
                  }))
                }
                className="mt-5 text-fg-3 hover:text-clay cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="dark"
          text={saving ? 'Saving...' : 'Save All'}
          onClick={handleSave}
          disabled={saving}
        />
      </div>
    </div>
  )
}
