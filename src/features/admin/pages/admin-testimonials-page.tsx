import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { testimonialsService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface Testimonial {
  id: string
  quote: string
  author_name: string
  author_role: string | null
  author_initials: string | null
  sort_order: number
}

const emptyForm = {
  quote: '',
  author_name: '',
  author_role: '',
  author_initials: '',
  sort_order: 0,
}

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const data = await testimonialsService.getAll()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (item: Testimonial) => {
    setForm({
      quote: item.quote,
      author_name: item.author_name,
      author_role: item.author_role ?? '',
      author_initials: item.author_initials ?? '',
      sort_order: item.sort_order,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await testimonialsService.update(editingId, form)
      } else {
        await testimonialsService.create(form)
      }
      setShowForm(false)
      load()
      showToast(editingId ? 'Testimonial updated!' : 'Testimonial created!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await testimonialsService.delete(deleteTarget)
      load()
      showToast('Testimonial deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Testimonials</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Member testimonials shown in the Community section
          </p>
        </div>
        <Button text="Add Testimonial" icon={Plus} onClick={openCreate} />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Quote *</label>
                <textarea
                  required
                  rows={3}
                  value={form.quote}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quote: e.target.value }))
                  }
                  placeholder="A floor full of people doing serious work…"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Author Name *</label>
                <input
                  required
                  value={form.author_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author_name: e.target.value }))
                  }
                  placeholder="Sunaina Pradhan"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Author Role</label>
                <input
                  value={form.author_role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author_role: e.target.value }))
                  }
                  placeholder="Translator · Jhamsikhel resident"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Initials</label>
                <input
                  value={form.author_initials}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author_initials: e.target.value }))
                  }
                  placeholder="SP"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 max-w-[100px] ml-2"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sort_order: Number(e.target.value),
                    }))
                  }
                  placeholder="0"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 max-w-[100px] ml-2"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" text={editingId ? 'Update' : 'Create'} />
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
            <div key={i} className="h-24 bg-rule rounded-sm animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No testimonials yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-fg-1">
                  &ldquo;{item.quote}&rdquo;
                </div>
                <div className="text-sm text-fg-2 mt-1">
                  — {item.author_name}
                  {item.author_role && (
                    <span className="text-fg-3"> · {item.author_role}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Pencil}
                  onClick={() => openEdit(item)}
                  aria-label="Edit"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  onClick={() => setDeleteTarget(item.id)}
                  aria-label="Delete"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Testimonial"
        message="Delete this testimonial?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
