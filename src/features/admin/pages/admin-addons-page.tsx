import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { addOnService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'

interface AddOnItem {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  type: string | null
  active: boolean
}

const emptyForm = {
  name: '',
  description: '',
  price: 0,
  currency: 'NPR',
  type: '',
  active: true,
}

export function AdminAddonsPage() {
  const [items, setItems] = useState<AddOnItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    try {
      const data = await addOnService.getAllAddOnsAdmin()
      setItems(data)
    } catch (err) {
      showToast(
        `Failed to load add-ons: ${(err as any)?.message || err}`,
        'error'
      )
    }
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

  const openEdit = (item: AddOnItem) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      currency: item.currency,
      type: item.type || '',
      active: item.active,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        description: form.description || null,
        type: form.type || null,
      }
      if (editingId) {
        await addOnService.updateAddOn(editingId, payload)
      } else {
        await addOnService.createAddOn(payload)
      }
      setShowForm(false)
      load()
      showToast(editingId ? 'Add-on updated!' : 'Add-on created!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const toggleActive = async (item: AddOnItem) => {
    try {
      await addOnService.updateAddOn(item.id, { active: !item.active })
      load()
      showToast(item.active ? 'Add-on deactivated' : 'Add-on activated')
    } catch (err) {
      showToast(`Failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await addOnService.deleteAddOn(deleteTarget)
      load()
      showToast('Add-on deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Add-ons</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Optional add-on services shown on the pricing page
          </p>
        </div>
        <Button text="Add Add-on" icon={Plus} onClick={openCreate} />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit Add-on' : 'New Add-on'}
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
                  placeholder="Extra Meeting Room Hours"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Additional meeting room access"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">
                    Price (paisa) *
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: Number(e.target.value) }))
                    }
                    placeholder="80000"
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                  <p className="text-xs text-fg-3">
                    {formatCurrency(form.price, 'NPR')} displayed to users
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Currency</label>
                  <input
                    value={form.currency}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, currency: e.target.value }))
                    }
                    placeholder="NPR"
                    className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Type</label>
                <input
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  placeholder="e.g. meeting-room, printing"
                  className="w-full border border-rule rounded-sm px-3 py-2 text-sm bg-transparent text-fg-1"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-label text-fg-2">Active</label>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                  className="w-4 h-4"
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
          <p className="text-body">No add-ons yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4 ${
                !item.active ? 'opacity-50' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-fg-1 flex items-center gap-2">
                  {item.name}
                  {!item.active && (
                    <span className="text-xs text-fg-3 font-normal">
                      (inactive)
                    </span>
                  )}
                </div>
                <div className="text-sm text-fg-2 mt-1">
                  {formatCurrency(item.price, item.currency)}
                </div>
                {item.description && (
                  <div className="text-sm text-fg-3 mt-0.5 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={item.active ? EyeOff : Eye}
                  onClick={() => toggleActive(item)}
                  aria-label={item.active ? 'Deactivate' : 'Activate'}
                />
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
        title="Delete Add-on"
        message="Delete this add-on? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
