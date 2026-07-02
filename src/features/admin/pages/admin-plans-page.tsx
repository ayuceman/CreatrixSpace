import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { planService } from '@/services/supabase-service'
import { showToast } from '@/components/ui/toast'

const PLAN_TYPES = [
  { value: 'day_pass', label: 'Day Pass' },
  { value: 'hot_desk', label: 'Hot Desk' },
  { value: 'dedicated_desk', label: 'Dedicated Desk' },
  { value: 'private_office', label: 'Private Office' },
  { value: 'meeting_room', label: 'Meeting Room' },
] as const

const PLAN_TYPE_FIELDS: Record<string, string[]> = {
  day_pass: ['daily'],
  hot_desk: ['weekly', 'monthly', 'annual'],
  dedicated_desk: ['weekly', 'monthly', 'annual'],
  private_office: ['weekly', 'monthly', 'annual'],
  meeting_room: [],
}

const FIELD_LABELS: Record<string, string> = {
  daily: 'Daily (NPR)',
  weekly: 'Weekly (NPR)',
  monthly: 'Monthly (NPR)',
  annual: 'Annual (NPR)',
}

interface PlanForm {
  name: string
  type: string
  description: string
  features: string
  popular: boolean
  active: boolean
  pricing: Record<string, string>
}

const emptyForm: PlanForm = {
  name: '',
  type: 'day_pass',
  description: '',
  features: '',
  popular: false,
  active: true,
  pricing: {},
}

export function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<PlanForm>(emptyForm)

  const load = async () => {
    setLoading(true)
    try {
      const data = await planService.getAllPlansAdmin()
      setPlans(data)
    } catch {
      showToast('Failed to load plans', 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setForm({
      ...emptyForm,
      type: 'day_pass',
    })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (plan: any) => {
    const pricing = (plan.pricing || {}) as Record<string, number>
    const strings: Record<string, string> = {}
    const fields = PLAN_TYPE_FIELDS[plan.type] || []
    fields.forEach((f) => {
      strings[f] = pricing[f] !== undefined ? String(pricing[f] / 100) : ''
    })

    setForm({
      name: plan.name,
      type: plan.type,
      description: plan.description ?? '',
      features: (plan.features || []).join(', '),
      popular: plan.popular,
      active: plan.active,
      pricing: strings,
    })
    setEditingId(plan.id)
    setShowForm(true)
  }

  const buildPayload = () => {
    const fields = PLAN_TYPE_FIELDS[form.type] || []
    const pricing: Record<string, number> = {}
    fields.forEach((f) => {
      const v = form.pricing[f]
      if (v && !isNaN(Number(v))) {
        pricing[f] = Math.round(Number(v) * 100)
      }
    })

    return {
      name: form.name.trim(),
      type: form.type,
      description: form.description.trim() || null,
      features: form.features
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      popular: form.popular,
      active: form.active,
      pricing,
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      showToast('Name is required', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload()
      if (editingId) {
        await planService.updatePlan(editingId, payload)
      } else {
        await planService.createPlan(payload)
      }
      setShowForm(false)
      load()
      showToast(editingId ? 'Plan updated!' : 'Plan created!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
    setSaving(false)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await planService.deletePlan(deleteTarget)
      load()
      showToast('Plan deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  const handleTypeChange = (newType: string) => {
    const oldFields = PLAN_TYPE_FIELDS[form.type] || []
    const newFields = PLAN_TYPE_FIELDS[newType] || []
    const kept: Record<string, string> = {}
    newFields.forEach((f) => {
      kept[f] = oldFields.includes(f) ? (form.pricing[f] ?? '') : ''
    })
    setForm((f) => ({ ...f, type: newType, pricing: kept }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Plans</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Membership tiers and pricing plans used across the app
          </p>
        </div>
        <Button text="Add Plan" icon={Plus} onClick={openCreate} />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit Plan' : 'New Plan'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Explorer"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(val) => handleTypeChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Perfect for trying out our space..."
                  className="w-full border border-rule rounded-sm px-2.5 py-1.5 text-sm bg-transparent text-fg-1 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Features (comma separated)</Label>
                <Input
                  value={form.features}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, features: e.target.value }))
                  }
                  placeholder="Access to hot desks, Wi-Fi included, Coffee & Tea"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Default Pricing (NPR)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(PLAN_TYPE_FIELDS[form.type] || []).map((field) => (
                    <div key={field} className="space-y-1">
                      <span className="text-xs text-fg-3">
                        {FIELD_LABELS[field]}
                      </span>
                      <Input
                        type="number"
                        min="0"
                        value={form.pricing[field] ?? ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            pricing: { ...f.pricing, [field]: e.target.value },
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  ))}
                  {(PLAN_TYPE_FIELDS[form.type] || []).length === 0 && (
                    <p className="text-xs text-fg-3 col-span-2">
                      No pricing fields for this plan type.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, popular: e.target.checked }))
                    }
                    className="size-4"
                  />
                  Popular
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, active: e.target.checked }))
                    }
                    className="size-4"
                  />
                  Active
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  text={
                    saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Plan'
                        : 'Create Plan'
                  }
                  disabled={saving}
                />
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

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-sm text-fg-2 p-6 text-center">Loading...</div>
          ) : plans.length === 0 ? (
            <div className="text-sm text-fg-2 p-6 text-center">
              No plans yet. Click "Add Plan" to create one.
            </div>
          ) : (
            <div className="divide-y divide-rule">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-4 hover:bg-bg-raised transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-fg-1">{plan.name}</span>
                      {!plan.active && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                      {plan.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-fg-3">
                      <span>
                        {PLAN_TYPES.find((t) => t.value === plan.type)?.label ||
                          plan.type}
                      </span>
                      {plan.description && (
                        <>
                          <span>·</span>
                          <span className="truncate">{plan.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(plan)}
                      className="p-1.5 text-fg-3 hover:text-clay cursor-pointer"
                      title="Edit plan"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(plan.id)}
                      className="p-1.5 text-fg-3 hover:text-red-500 cursor-pointer"
                      title="Delete plan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This may affect pricing and memberships linked to it."
      />
    </div>
  )
}
