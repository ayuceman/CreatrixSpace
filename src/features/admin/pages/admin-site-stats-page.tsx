import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { siteStatsService } from '@/services/supabase-service'

interface Stat {
  id: string
  label: string
  value: string
  suffix: string | null
  meta: string | null
  sort_order: number
  section: string
}

const emptyForm = {
  label: '',
  value: '',
  suffix: '',
  meta: '',
  sort_order: 0,
  section: 'about',
}

export function AdminSiteStatsPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const data = await siteStatsService.getAll()
    setStats(data)
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

  const openEdit = (stat: Stat) => {
    setForm({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix ?? '',
      meta: stat.meta ?? '',
      sort_order: stat.sort_order,
      section: stat.section,
    })
    setEditingId(stat.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await siteStatsService.update(editingId, form)
      } else {
        await siteStatsService.create(form)
      }
      setShowForm(false)
      load()
    } catch (err) {
      alert(`Save failed: ${(err as any)?.message || err}`)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteTarget(id)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await siteStatsService.delete(deleteTarget)
      load()
    } catch (err) {
      alert(`Delete failed: ${(err as any)?.message || err}`)
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Site Stats</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Statistics shown in the About section
          </p>
        </div>
        <Button text="Add Stat" icon={Plus} onClick={openCreate} />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit Stat' : 'New Stat'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Label *</label>
                <input
                  required
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  placeholder="e.g. Members across three rooms"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Value *</label>
                <input
                  required
                  value={form.value}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, value: e.target.value }))
                  }
                  placeholder="e.g. 480"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Suffix</label>
                <input
                  value={form.suffix}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, suffix: e.target.value }))
                  }
                  placeholder="e.g. +"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Meta</label>
                <input
                  value={form.meta}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, meta: e.target.value }))
                  }
                  placeholder="Small text shown below the label"
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
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-rule rounded-sm animate-pulse" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No stats yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-fg-1">
                  {stat.value}
                  {stat.suffix}{' '}
                  <span className="text-fg-2 font-normal">{stat.label}</span>
                </div>
                {stat.meta && (
                  <div className="text-caption text-fg-3 mt-0.5">
                    {stat.meta}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Pencil}
                  onClick={() => openEdit(stat)}
                  aria-label={`Edit ${stat.label}`}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  onClick={() => handleDelete(stat.id)}
                  aria-label={`Delete ${stat.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Stat"
        message="Delete this stat?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
