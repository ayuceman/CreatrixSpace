import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { faqsService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface Faq {
  id: string
  question: string
  answer: string
  sort_order: number
}

const emptyForm = {
  question: '',
  answer: '',
  sort_order: 0,
}

export function AdminFaqPage() {
  const [items, setItems] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const data = await faqsService.getAll()
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

  const openEdit = (item: Faq) => {
    setForm({
      question: item.question,
      answer: item.answer,
      sort_order: item.sort_order,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await faqsService.update(editingId, form)
      } else {
        await faqsService.create(form)
      }
      setShowForm(false)
      load()
      showToast(editingId ? 'FAQ updated!' : 'FAQ created!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await faqsService.delete(deleteTarget)
      load()
      showToast('FAQ deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">FAQs</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Frequently asked questions shown in the FAQ section
          </p>
        </div>
        <Button text="Add FAQ" icon={Plus} onClick={openCreate} />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit FAQ' : 'New FAQ'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Question *</label>
                <input
                  required
                  value={form.question}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, question: e.target.value }))
                  }
                  placeholder="Can I walk in tomorrow and start working?"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Answer *</label>
                <textarea
                  required
                  rows={4}
                  value={form.answer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, answer: e.target.value }))
                  }
                  placeholder="Yes. Day passes are first-come, first-served…"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
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
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1 max-w-[100px]"
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
            <div key={i} className="h-20 bg-rule rounded-sm animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No FAQs yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-fg-1">{item.question}</div>
                <div className="text-sm text-fg-2 mt-1 line-clamp-2">
                  {item.answer}
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
        title="Delete FAQ"
        message="Delete this FAQ?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
