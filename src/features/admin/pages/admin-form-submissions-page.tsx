import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { formSubmissionService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

interface Submission {
  id: string
  form_type: string
  name: string
  email: string
  phone: string | null
  room: string | null
  selected_date: string | null
  time_slot: string | null
  interest: string | null
  notes: string | null
  message: string | null
  created_at: string
}

export function AdminFormSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const data = await formSubmissionService.getAll()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered =
    filter === 'all' ? items : items.filter((i) => i.form_type === filter)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await formSubmissionService.delete(deleteTarget)
      load()
      showToast('Submission deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  const formTypes = ['all', ...new Set(items.map((i) => i.form_type))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Form Submissions</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Messages from the CTA section and Book a Tour form
          </p>
        </div>
      </div>

      {formTypes.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {formTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-xs rounded-pill font-medium border transition-all cursor-pointer ${
                filter === t
                  ? 'bg-ink text-bg border-transparent'
                  : 'bg-transparent text-fg-2 border-rule hover:bg-bg-raised'
              }`}
            >
              {t === 'all' ? 'All' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-rule rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono bg-bg-raised border border-rule rounded-sm px-2 py-0.5 text-fg-3 uppercase">
                        {item.form_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-fg-3 font-mono">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="font-medium text-fg-1">{item.name}</div>
                    <div className="text-sm text-fg-2">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-clay underline underline-offset-2"
                      >
                        {item.email}
                      </a>
                      {item.phone && (
                        <span className="ml-3 text-fg-3">{item.phone}</span>
                      )}
                    </div>
                    {(item.room || item.selected_date || item.time_slot) && (
                      <div className="text-sm text-fg-2">
                        {item.room && (
                          <span className="font-medium">{item.room}</span>
                        )}
                        {item.selected_date && (
                          <span className="ml-2">{item.selected_date}</span>
                        )}
                        {item.time_slot && (
                          <span className="ml-2">{item.time_slot}</span>
                        )}
                      </div>
                    )}
                    {item.interest && (
                      <div className="text-sm text-fg-3">{item.interest}</div>
                    )}
                    {(item.notes || item.message) && (
                      <div className="text-sm text-fg-2 bg-bg-raised border border-rule rounded-sm p-3 mt-2">
                        {item.notes || item.message}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => setDeleteTarget(item.id)}
                    aria-label="Delete"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Submission"
        message="Delete this submission?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
