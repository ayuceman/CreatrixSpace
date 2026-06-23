import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { memberCompaniesService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface MemberCompany {
  id: string
  name: string
  italic: boolean
  sort_order: number
}

const emptyForm = {
  name: '',
  italic: false,
  sort_order: 0,
}

export function AdminMemberCompaniesPage() {
  const [items, setItems] = useState<MemberCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const data = await memberCompaniesService.getAll()
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

  const openEdit = (item: MemberCompany) => {
    setForm({
      name: item.name,
      italic: item.italic,
      sort_order: item.sort_order,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await memberCompaniesService.update(editingId, form)
      } else {
        await memberCompaniesService.create(form)
      }
      setShowForm(false)
      load()
      showToast(editingId ? 'Company updated!' : 'Company created!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await memberCompaniesService.delete(deleteTarget)
      load()
      showToast('Company deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Member Companies</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Companies shown in the Community section scrolling ticker
          </p>
        </div>
        <Button text="Add Company" icon={Plus} onClick={openCreate} />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit Company' : 'New Company'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Loomstack"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="italic"
                  checked={form.italic}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, italic: e.target.checked }))
                  }
                  className="accent-clay"
                />
                <label htmlFor="italic" className="text-label text-fg-2">
                  Italic
                </label>
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
            <div key={i} className="h-14 bg-rule rounded-sm animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No companies yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <span
                  className={`font-medium text-fg-1 ${item.italic ? 'italic' : ''}`}
                >
                  {item.name}
                </span>
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
        title="Delete Company"
        message="Delete this company?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
