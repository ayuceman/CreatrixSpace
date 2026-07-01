import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { memberCompaniesService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'

const PAGE_SIZE = 20

interface MemberCompany {
  id: string
  name: string
  logo_url: string | null
  italic: boolean
  sort_order: number
}

const emptyForm = {
  name: '',
  logo_url: '',
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
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [data, count] = await Promise.all([
      memberCompaniesService.getAll({ page, pageSize: PAGE_SIZE }),
      memberCompaniesService.count(),
    ])
    setItems(data)
    setTotalCount(count)
    setLoading(false)
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (item: MemberCompany) => {
    setForm({
      name: item.name,
      logo_url: item.logo_url || '',
      italic: item.italic,
      sort_order: item.sort_order,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const storage = supabaseAdmin?.storage ?? supabase.storage
      const ext = file.name.split('.').pop()
      const filePath = `member-companies/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await storage.from('images').upload(filePath, file)
      if (error) throw error
      const {
        data: { publicUrl },
      } = storage.from('images').getPublicUrl(filePath)
      setForm((f) => ({ ...f, logo_url: publicUrl }))
      showToast('Logo uploaded!')
    } catch (err) {
      showToast(`Upload failed: ${(err as any)?.message || err}`, 'error')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Logo</label>
                <div className="flex items-center gap-3">
                  {form.logo_url ? (
                    <div className="relative group shrink-0">
                      <img
                        src={form.logo_url}
                        alt="Logo preview"
                        className="size-14 object-contain rounded-sm border border-rule bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, logo_url: '' }))
                          if (fileInputRef.current)
                            fileInputRef.current.value = ''
                        }}
                        className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-clay text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="w-full text-sm text-fg-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-rule file:text-sm file:bg-bg-raised file:text-fg-1 hover:file:bg-bg file:cursor-pointer"
                  />
                </div>
                {uploading && (
                  <span className="text-xs text-clay mt-1 block">
                    Uploading...
                  </span>
                )}
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
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-bg-raised border border-rule rounded-sm px-5 py-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="size-8 object-contain rounded-sm border border-rule bg-white shrink-0"
                    />
                  ) : null}
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-fg-3">
                Showing {(page - 1) * PAGE_SIZE + 1}&ndash;
                {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-fg-2 w-10 text-center">
                  {page} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
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
