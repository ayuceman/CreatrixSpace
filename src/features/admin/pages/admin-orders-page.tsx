import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { orderService } from '@/services/supabase-service'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { showToast } from '@/components/ui/toast'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

interface Order {
  id: string
  order_date: string
  company_name: string
  customer_name: string
  item_name: string
  quantity: number
  price: number
  total_price: number
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['paid', 'unpaid', 'cancelled'] as const

interface MenuItem {
  id: string
  name: string
  price: number
}

const emptyForm = {
  order_date: new Date().toISOString().split('T')[0],
  company_name: '',
  customer_name: '',
  item_name: '',
  quantity: 1,
  price: '',
  status: 'unpaid',
}

const emptyMenuItemForm = {
  name: '',
  price: '',
}

export function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const [filters, setFilters] = useState({
    order_date: '',
    company_name: '',
    item_name: '',
    status: '',
  })

  const [organizations, setOrganizations] = useState<string[]>([])
  const [itemsList, setItemsList] = useState<string[]>([])
  const [orgCustomerMap, setOrgCustomerMap] = useState<Record<string, string>>(
    {}
  )
  const [itemPriceMap, setItemPriceMap] = useState<Record<string, number>>({})
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [allTotalsItems, setAllTotalsItems] = useState<
    Pick<Order, 'order_date' | 'total_price'>[]
  >([])
  const [showItemManager, setShowItemManager] = useState(false)
  const [itemForm, setItemForm] = useState(emptyMenuItemForm)
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(
    null
  )
  const [deleteMenuItemTarget, setDeleteMenuItemTarget] = useState<
    string | null
  >(null)

  const loadFormData = useCallback(async () => {
    try {
      const client = supabaseAdmin ?? supabase
      const results = await Promise.all([
        supabase
          .from('orders')
          .select('company_name')
          .not('company_name', 'is', null)
          .not('company_name', 'eq', ''),
        supabase
          .from('orders')
          .select('item_name')
          .not('item_name', 'is', null)
          .not('item_name', 'eq', ''),
        client
          .from('bookings')
          .select('contact_info')
          .not('contact_info', 'is', null),
        client.from('manual_admin_entries').select('data'),
        client
          .from('manual_admin_entries')
          .select('id, data')
          .eq('entry_type', 'menu_item' as never),
        client
          .from('orders')
          .select('item_name, price')
          .order('created_at', { ascending: false }),
      ])

      results.forEach((r, i) => {
        if (r.error) console.error(`loadFormData query ${i} error:`, r.error)
      })

      const [
        distinctOrgs,
        distinctItems,
        bookings,
        manualEntries,
        menuData,
        priceLookup,
      ] = results

      const orgSet = new Set<string>()
      distinctOrgs.data?.forEach((o) => {
        if (o.company_name) orgSet.add(o.company_name)
      })

      const custMap: Record<string, string> = {}

      bookings.data?.forEach((b) => {
        const ci = b.contact_info as Record<string, any> | null
        if (!ci) return
        const org = ci.company || ci.organization || ''
        if (!org) return
        orgSet.add(org)
        const fn = ci.firstName || ''
        const ln = ci.lastName || ''
        const name = `${fn} ${ln}`.trim() || ci.customerName || ci.name || ''
        if (name && !custMap[org]) custMap[org] = name
      })

      manualEntries.data?.forEach((e) => {
        const d = e.data as Record<string, any> | null
        if (!d) return
        const org = d.organization || ''
        if (!org) return
        orgSet.add(org)
        const name = d.customerName || ''
        if (name && !custMap[org]) custMap[org] = name
      })

      setOrganizations(Array.from(orgSet).sort())
      setOrgCustomerMap(custMap)

      const menu: MenuItem[] = (menuData.data || [])
        .map((e: any) => ({
          id: e.id,
          name: e.data?.itemName || '',
          price: e.data?.price || 0,
        }))
        .filter((m: MenuItem) => m.name)
      setMenuItems(menu)

      const orderItemNames: string[] = []
      distinctItems.data?.forEach((i) => {
        if (i.item_name) orderItemNames.push(i.item_name)
      })

      const orderPrices: Record<string, number> = {}
      priceLookup?.data?.forEach((o: any) => {
        if (o.item_name && o.price && !orderPrices[o.item_name]) {
          orderPrices[o.item_name] = o.price
        }
      })

      const itemSet = new Set<string>()
      menu.forEach((m) => {
        if (m.name) itemSet.add(m.name)
      })
      orderItemNames.forEach((n) => {
        if (n) itemSet.add(n)
      })

      const pMap: Record<string, number> = { ...orderPrices }
      menu.forEach((m) => {
        if (m.name) pMap[m.name] = m.price
      })

      setItemsList(Array.from(itemSet).sort())
      setItemPriceMap(pMap)
    } catch (err) {
      console.error('Failed to load form data:', err)
    }
  }, [])

  useEffect(() => {
    loadFormData()
  }, [loadFormData])

  const load = useCallback(async () => {
    setLoading(true)
    const opts = { page, pageSize: PAGE_SIZE }
    const filterOpts: Record<string, string> = {
      ...(filters.order_date && { order_date: filters.order_date }),
      ...(filters.company_name && { company_name: filters.company_name }),
      ...(filters.item_name && { item_name: filters.item_name }),
      ...(filters.status && { status: filters.status }),
    }
    const [data, count] = await Promise.all([
      orderService.getAll({ ...opts, ...filterOpts }),
      orderService.count(filterOpts),
    ])
    setItems(data)

    // Fetch all matching items for totals (unpaginated)
    const loadTotals = async () => {
      let query: any = supabase.from('orders').select('order_date, total_price')
      if (filters.order_date) query = query.eq('order_date', filters.order_date)
      if (filters.company_name)
        query = query.ilike('company_name', `%${filters.company_name}%`)
      if (filters.item_name)
        query = query.ilike('item_name', `%${filters.item_name}%`)
      if (filters.status) query = query.eq('status', filters.status)
      const { data } = await query
      setAllTotalsItems(data || [])
    }
    loadTotals()

    setTotalCount(count)
    setLoading(false)
  }, [page, filters])

  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setForm({
      ...emptyForm,
      order_date: new Date().toISOString().split('T')[0],
    })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (item: Order) => {
    setForm({
      order_date: item.order_date
        ? item.order_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
      company_name: item.company_name,
      customer_name: item.customer_name,
      item_name: item.item_name,
      quantity: item.quantity,
      price: String(item.price),
      status: item.status || 'unpaid',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        order_date: form.order_date,
        company_name: form.company_name,
        customer_name: form.customer_name,
        item_name: form.item_name,
        quantity: form.quantity,
        price: parseFloat(form.price),
        status: form.status,
      }
      if (editingId) {
        await orderService.update(editingId, payload)
      } else {
        await orderService.create(payload)
      }
      setShowForm(false)
      load()
      showToast(editingId ? 'Order updated!' : 'Order created!')
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await orderService.delete(deleteTarget)
      const willBeEmpty = items.length === 1 && page > 1
      if (willBeEmpty) setPage((p) => p - 1)
      else load()
      showToast('Order deleted!')
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
    }
    setDeleteTarget(null)
  }

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const client = supabaseAdmin ?? supabase
    const payload = {
      itemName: itemForm.name,
      price: parseFloat(itemForm.price) || 0,
    }
    try {
      if (editingMenuItemId) {
        const { error } = await client
          .from('manual_admin_entries')
          .update({ data: payload, updated_at: new Date().toISOString() })
          .eq('id', editingMenuItemId)
        if (error) throw error
        showToast('Menu item updated!')
      } else {
        const { error } = await client
          .from('manual_admin_entries')
          .insert({ entry_type: 'menu_item' as never, data: payload })
        if (error) throw error
        showToast('Menu item added!')
      }
      setItemForm(emptyMenuItemForm)
      setEditingMenuItemId(null)
      await loadFormData()
    } catch (err) {
      showToast(`Save failed: ${(err as any)?.message || err}`, 'error')
    }
  }

  const openEditMenuItem = (item: MenuItem) => {
    setItemForm({ name: item.name, price: String(item.price) })
    setEditingMenuItemId(item.id)
    setShowItemManager(true)
  }

  const confirmDeleteMenuItem = async () => {
    if (!deleteMenuItemTarget) return
    const client = supabaseAdmin ?? supabase
    try {
      const { error } = await client
        .from('manual_admin_entries')
        .delete()
        .eq('id', deleteMenuItemTarget)
      if (error) throw error
      showToast('Menu item deleted!')
      setDeleteMenuItemTarget(null)
      await loadFormData()
    } catch (err) {
      showToast(`Delete failed: ${(err as any)?.message || err}`, 'error')
      setDeleteMenuItemTarget(null)
    }
  }

  function getWeekLabel(d: Date): string {
    const start = new Date(d)
    start.setDate(d.getDate() - d.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const fmt = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(start)} – ${fmt(end)}`
  }

  const totSrc: { order_date: string; total_price: number }[] =
    allTotalsItems.length > 0 ? allTotalsItems : items

  const monthTotals = totSrc.reduce<Record<string, number>>((acc, item) => {
    const d = item.order_date ? new Date(item.order_date) : null
    const key = d
      ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Unknown'
    acc[key] = (acc[key] || 0) + Number(item.total_price)
    return acc
  }, {})

  const weekTotals = totSrc.reduce<Record<string, number>>((acc, item) => {
    const d = item.order_date ? new Date(item.order_date) : null
    const key = d ? getWeekLabel(d) : 'Unknown'
    acc[key] = (acc[key] || 0) + Number(item.total_price)
    return acc
  }, {})

  const grandTotal = totSrc.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  )

  const totalPrice = form.quantity * (parseFloat(form.price) || 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h3 font-display text-fg-1">Food Orders</h1>
          <p className="text-body-sm text-fg-3 mt-1">
            Manage food orders from customers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            text={showItemManager ? 'Close Items' : 'Manage Items'}
            icon={UtensilsCrossed}
            onClick={() => setShowItemManager((v) => !v)}
          />
          <Button text="Add Order" icon={Plus} onClick={openCreate} />
        </div>
      </div>

      {showItemManager && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingMenuItemId ? 'Edit Menu Item' : 'Manage Menu Items'}
            </h2>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSaveMenuItem}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-end gap-3 mb-4"
            >
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Item Name *</label>
                <Input
                  required
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Veggie Burger"
                />
              </div>
              <div className="space-y-1.5 sm:w-40">
                <label className="text-label text-fg-2">Price (NPR) *</label>
                <Input
                  type="number"
                  required
                  min={0}
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) =>
                    setItemForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="250.00"
                />
              </div>
              <div className="flex gap-2 sm:pb-1">
                <Button
                  type="submit"
                  text={editingMenuItemId ? 'Update' : 'Add'}
                  className="flex-1 sm:flex-none"
                />
                {editingMenuItemId && (
                  <Button
                    type="button"
                    variant="ghost"
                    text="Cancel"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      setItemForm(emptyMenuItemForm)
                      setEditingMenuItemId(null)
                    }}
                  />
                )}
              </div>
            </form>
            {menuItems.length > 0 ? (
              <div className="space-y-1">
                {menuItems.map((mi) => (
                  <div
                    key={mi.id}
                    className="flex items-center justify-between gap-2 py-2 px-3 bg-bg-raised border border-rule rounded-sm min-w-0"
                  >
                    <span className="text-sm text-fg-1 min-w-0 truncate">
                      <span className="sm:max-w-none max-w-40 inline-block align-middle truncate">
                        {mi.name}
                      </span>{' '}
                      <span className="text-fg-2 sm:inline block">
                        — NPR {mi.price.toFixed(2)}
                      </span>
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Pencil}
                        onClick={() => openEditMenuItem(mi)}
                        aria-label="Edit"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => setDeleteMenuItemTarget(mi.id)}
                        aria-label="Delete"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fg-3">
                No menu items yet. Add one above.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="border border-rule rounded-sm bg-bg-raised/30">
        <div className="px-4 py-2.5 border-b border-rule flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-fg-3 font-medium">
            Filters
          </span>
          {(filters.order_date ||
            filters.company_name ||
            filters.item_name ||
            filters.status) && (
            <button
              onClick={() =>
                setFilters({
                  order_date: '',
                  company_name: '',
                  item_name: '',
                  status: '',
                })
              }
              className="text-xs text-clay hover:text-clay-deep transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <DatePicker
            value={filters.order_date}
            onChange={(val) => setFilters((f) => ({ ...f, order_date: val }))}
          />
          <Select
            value={filters.company_name}
            onValueChange={(val) =>
              setFilters((f) => ({ ...f, company_name: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Organizations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Organizations</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.item_name}
            onValueChange={(val) =>
              setFilters((f) => ({ ...f, item_name: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Items</SelectItem>
              {itemsList.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.status}
            onValueChange={(val) => setFilters((f) => ({ ...f, status: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-h4 font-display text-fg-1">
              {editingId ? 'Edit Order' : 'New Order'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Date *</label>
                  <DatePicker
                    value={form.order_date}
                    onChange={(val) =>
                      setForm((f) => ({ ...f, order_date: val }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Organization *</label>
                  <Select
                    value={form.company_name}
                    onValueChange={(val) => {
                      setForm((f) => ({
                        ...f,
                        company_name: val,
                        customer_name: orgCustomerMap[val] || '',
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Organization --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        -- Select Organization --
                      </SelectItem>
                      {organizations.map((org) => (
                        <SelectItem key={org} value={org}>
                          {org}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Customer Name *</label>
                <Input
                  required
                  disabled
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customer_name: e.target.value }))
                  }
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Item Name *</label>
                <Select
                  value={form.item_name}
                  onValueChange={(val) => {
                    setForm((f) => ({
                      ...f,
                      item_name: val,
                      price:
                        itemPriceMap[val] !== undefined
                          ? String(itemPriceMap[val])
                          : '',
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Item --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Select Item --</SelectItem>
                    {itemsList.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">Quantity *</label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label text-fg-2">
                    Price per unit (NPR) *
                  </label>
                  <Input
                    type="number"
                    required
                    disabled
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="e.g. 250.00"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-label text-fg-2">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, status: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2 text-sm text-fg-2">
                Total:{' '}
                <span className="font-semibold text-fg-1">
                  NPR {totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  text="Cancel"
                  onClick={() => setShowForm(false)}
                />
                <Button
                  type="submit"
                  text={editingId ? 'Update' : 'Order food'}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 sm:h-24 bg-rule rounded-sm animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-fg-3">
          <p className="text-body">No orders yet.</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table ─────────────────────────────── */}
          <div className="hidden sm:block overflow-x-auto rounded-sm border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-raised text-left text-fg-3 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Qty × Price
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-center w-24">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-right w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-bg-raised/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-fg-1">
                      {item.order_date
                        ? new Date(item.order_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-fg-1 max-w-32 truncate">
                      {item.company_name || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-fg-1 max-w-32 truncate">
                      {item.customer_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-fg-1 max-w-32 truncate">
                      {item.item_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-fg-1 text-right">
                      {item.quantity} × NPR {Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-fg-1 text-right">
                      NPR {Number(item.total_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span
                        className={cn(
                          'inline-block text-xs font-medium px-2 py-0.5 rounded-sm',
                          item.status === 'paid'
                            ? 'bg-moss-soft text-moss'
                            : item.status === 'cancelled'
                              ? 'bg-clay-soft text-clay-deep'
                              : 'bg-bg-band text-fg-2'
                        )}
                      >
                        {item.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)
                          : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ──────────────────────────────── */}
          <div className="sm:hidden space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-bg-raised border border-rule rounded-sm px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-fg-1 truncate min-w-0">
                    {item.item_name}
                  </span>
                  <span className="text-sm font-semibold text-fg-1 whitespace-nowrap shrink-0">
                    NPR {Number(item.total_price).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-fg-3">
                  <span>
                    {item.order_date
                      ? new Date(item.order_date).toLocaleDateString()
                      : '-'}
                  </span>
                  <span className="text-right">
                    {item.quantity} × NPR {Number(item.price).toFixed(2)}
                  </span>
                  <span className="truncate">{item.company_name || '-'}</span>
                  <span className="truncate text-right">
                    {item.customer_name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-rule">
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-sm',
                      item.status === 'paid'
                        ? 'bg-moss-soft text-moss'
                        : item.status === 'cancelled'
                          ? 'bg-clay-soft text-clay-deep'
                          : 'bg-bg-band text-fg-2'
                    )}
                  >
                    {item.status
                      ? item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)
                      : 'Unpaid'}
                  </span>
                  <div className="flex gap-1">
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
              </div>
            ))}
          </div>

          <div className="border border-rule rounded-sm bg-bg-raised/30 mt-4 divide-y divide-rule">
            {Object.keys(weekTotals).length > 0 && (
              <div className="px-3 sm:px-4 py-3">
                <span className="text-xs uppercase tracking-wider text-fg-3 block mb-2">
                  Per Week
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(weekTotals).map(([week, total]) => (
                    <div
                      key={week}
                      className="flex items-center justify-between gap-2 rounded-sm bg-bg-raised border border-rule px-2.5 py-1.5"
                    >
                      <span className="text-xs text-fg-3 truncate">{week}</span>
                      <span className="text-sm font-semibold text-fg-1 whitespace-nowrap">
                        NPR {total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.keys(monthTotals).length > 0 && (
              <div className="px-3 sm:px-4 py-3">
                <span className="text-xs uppercase tracking-wider text-fg-3 block mb-2">
                  Per Month
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(monthTotals).map(([month, total]) => (
                    <div
                      key={month}
                      className="flex items-center justify-between gap-2 rounded-sm bg-bg-raised border border-rule px-2.5 py-1.5"
                    >
                      <span className="text-xs text-fg-3 truncate">
                        {month}
                      </span>
                      <span className="text-sm font-semibold text-fg-1 whitespace-nowrap">
                        NPR {total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {grandTotal > 0 && (
              <div className="px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <span className="text-xs uppercase tracking-wider text-fg-3">
                  Grand Total
                </span>
                <span className="text-lg sm:text-xl font-bold text-fg-1">
                  NPR {grandTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <p className="text-xs text-fg-3">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
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
        title="Delete Order"
        message="Delete this order? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={deleteMenuItemTarget !== null}
        title="Delete Menu Item"
        message="Delete this menu item? It will be removed from the item dropdown."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteMenuItem}
        onCancel={() => setDeleteMenuItemTarget(null)}
      />
    </div>
  )
}
