import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Trash2,
  Download,
  Filter,
  SortAsc,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Edit,
  Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  bookingService,
  addOnService,
  manualEntryService,
  planService,
  locationService,
} from '@/services/supabase-service'
import {
  transformBookingsToAdmin,
  type AdminBookingRecord,
} from '@/features/admin/utils/admin-bookings'
import { MEMBERSHIP_STATUS } from '@/lib/constants'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'

type EntryType = 'booking' | 'membership'

type MergedRecord = AdminBookingRecord & {
  entryType: EntryType
  billingCycle?: string
  autoRenew?: boolean
}

const getStatusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1)

const durationInDays = (record: { startDate?: string; endDate?: string }) => {
  if (!record.startDate || !record.endDate) return null
  const start = new Date(record.startDate)
  const end = new Date(record.endDate)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const formatCountdown = (endDate?: string) => {
  if (!endDate)
    return {
      label: 'No end date',
      variant: 'secondary' as const,
      color: 'gray',
    }
  const end = new Date(endDate)
  const diffMs = end.getTime() - Date.now()
  if (diffMs <= 0) {
    const daysAgo = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    return {
      label: `Expired ${daysAgo}d ago`,
      variant: 'destructive' as const,
      color: 'red',
    }
  }
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days <= 7)
    return {
      label: `${days}d ${hours}h left`,
      variant: 'destructive' as const,
      color: 'red',
    }
  if (days <= 14)
    return {
      label: `${days}d ${hours}h left`,
      variant: 'secondary' as const,
      color: 'amber',
    }
  return {
    label: `${days}d ${hours}h left`,
    variant: 'default' as const,
    color: 'green',
  }
}

const PAYMENT_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
] as const

const emptyForm = {
  entryType: 'booking' as EntryType,
  customerName: '',
  email: '',
  phone: '',
  organization: '',
  locationName: '',
  planName: '',
  roomName: '',
  amountNpr: '',
  paymentStatus: 'pending' as string,
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  billingCycle: 'monthly' as 'monthly' | 'annual',
  addOns: '',
  meetingRoomHours: '',
  guestPasses: '',
  notes: '',
}

export function AdminBookingsPage() {
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<MergedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [showManualForm, setShowManualForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MergedRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<MergedRecord | null>(null)
  const [typeFilter, setTypeFilter] = useState<EntryType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name' | 'expiry'>(
    'date'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [manualForm, setManualForm] = useState(emptyForm)
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([])
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    planService
      .getAllPlans()
      .then((data) => setPlans(data.map((p) => ({ id: p.id, name: p.name }))))
    locationService
      .getAllLocations()
      .then((data) =>
        setLocations(data.map((l) => ({ id: l.id, name: l.name })))
      )
  }, [])

  const loadRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const [bookingsData, addOnsData, bookingManual, membershipManual] =
        await Promise.all([
          bookingService.getAllBookings(),
          addOnService.getAllAddOns(),
          manualEntryService.getEntries('booking'),
          manualEntryService.getEntries('membership'),
        ])

      const transformed = transformBookingsToAdmin(bookingsData, addOnsData)
      const bookingRows: MergedRecord[] = transformed.map((b) => ({
        ...b,
        entryType: 'booking' as const,
      }))

      const manualBookingRows: MergedRecord[] = bookingManual.map((entry) => {
        const data = entry.data as AdminBookingRecord
        return {
          ...data,
          id: entry.id,
          manualEntryId: entry.id,
          source: 'manual',
          entryType: 'booking' as const,
          addOns: data.addOns ?? {
            selectedAddOns: [],
            meetingRoomHours: 0,
            guestPasses: 0,
          },
        }
      })

      const manualMembershipRows: MergedRecord[] = membershipManual.map(
        (entry) => {
          const data = entry.data as MergedRecord
          return {
            ...data,
            id: entry.id,
            manualEntryId: entry.id,
            source: 'manual' as const,
            entryType: 'membership' as const,
            addOns: data.addOns ?? {
              selectedAddOns: [],
              meetingRoomHours: 0,
              guestPasses: 0,
            },
          }
        }
      )

      setRecords([
        ...manualBookingRows,
        ...manualMembershipRows,
        ...bookingRows,
      ])
    } catch (err) {
      console.error('Error loading records:', err)
      setError(err instanceof Error ? err.message : 'Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

  const stats = useMemo(() => {
    const filtered =
      typeFilter === 'all'
        ? records
        : records.filter((r) => r.entryType === typeFilter)
    const total = filtered.length
    const confirmedActive = filtered.filter(
      (r) => r.status === 'confirmed' || r.status === 'active'
    ).length
    const pending = filtered.filter((r) => r.status === 'pending').length
    const revenue = filtered.reduce((sum, r) => sum + (r.amount || 0), 0) / 100
    const avgBooking = filtered.length > 0 ? revenue / filtered.length : 0

    const bookingCount = filtered.filter(
      (r) => r.entryType === 'booking'
    ).length
    const membershipCount = filtered.filter(
      (r) => r.entryType === 'membership'
    ).length
    const bookingConfirmed = filtered.filter(
      (r) =>
        r.entryType === 'booking' &&
        (r.status === 'confirmed' || r.status === 'active')
    ).length
    const membershipConfirmed = filtered.filter(
      (r) =>
        r.entryType === 'membership' &&
        (r.status === 'confirmed' || r.status === 'active')
    ).length
    const bookingPending = filtered.filter(
      (r) => r.entryType === 'booking' && r.status === 'pending'
    ).length
    const membershipPending = filtered.filter(
      (r) => r.entryType === 'membership' && r.status === 'pending'
    ).length
    const bookingRevenue =
      filtered
        .filter((r) => r.entryType === 'booking')
        .reduce((sum, r) => sum + (r.amount || 0), 0) / 100
    const membershipRevenue =
      filtered
        .filter((r) => r.entryType === 'membership')
        .reduce((sum, r) => sum + (r.amount || 0), 0) / 100

    return {
      total,
      confirmedActive,
      pending,
      revenue,
      avgBooking,
      bookingCount,
      membershipCount,
      bookingConfirmed,
      membershipConfirmed,
      bookingPending,
      membershipPending,
      bookingRevenue,
      membershipRevenue,
    }
  }, [records, typeFilter])

  const filtered = useMemo(() => {
    let result = [...records]

    if (typeFilter !== 'all') {
      result = result.filter((r) => r.entryType === typeFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter((r) =>
        [
          r.customerName,
          r.email,
          r.phone,
          r.organization,
          r.locationName,
          r.planName,
          r.status,
          r.paymentStatus,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'amount':
          comparison = (a.amount || 0) - (b.amount || 0)
          break
        case 'name':
          comparison = a.customerName.localeCompare(b.customerName)
          break
        case 'expiry': {
          const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity
          const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity
          comparison = aEnd - bEnd
          break
        }
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [records, query, typeFilter, statusFilter, sortBy, sortOrder])

  const handleStatusToggle = async (
    recordId: string,
    currentStatus: string,
    record: MergedRecord
  ) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending'
    setUpdatingIds((prev) => new Set(prev).add(recordId))
    try {
      setError(null)
      if (record.source === 'manual' && record.manualEntryId) {
        await manualEntryService.updateEntry(record.manualEntryId, {
          ...record,
          status: newStatus,
        })
      } else {
        await bookingService.updateBooking(recordId, {
          status: newStatus as 'pending' | 'confirmed',
        })
      }
      await loadRecords()
    } catch (err: any) {
      const msg = err?.message || 'Failed to update status'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(recordId)
        return next
      })
    }
  }

  const handlePaymentStatusChange = async (
    recordId: string,
    newPaymentStatus: string,
    record: MergedRecord
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(recordId))
    try {
      if (record.source === 'manual' && record.manualEntryId) {
        await manualEntryService.updateEntry(record.manualEntryId, {
          ...record,
          paymentStatus: newPaymentStatus,
        })
      } else {
        await bookingService.updateBooking(recordId, {
          payment_status: newPaymentStatus as any,
        })
      }
      await loadRecords()
      showToast('Payment status updated', 'success')
    } catch {
      showToast('Failed to update payment status', 'error')
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(recordId)
        return next
      })
    }
  }

  const handleStatusChange = async (row: MergedRecord, newStatus: string) => {
    if (row.manualEntryId) {
      await manualEntryService.updateEntry(row.manualEntryId, {
        ...row,
        status: newStatus,
      })
      loadRecords()
    }
  }

  const handleEdit = (record: MergedRecord) => {
    setEditingRecord(record)
    setManualForm({
      entryType: record.entryType,
      customerName: record.customerName,
      email: record.email || '',
      phone: record.phone || '',
      organization: record.organization || '',
      locationName: record.locationName,
      planName: record.planName,
      roomName: record.roomName || '',
      amountNpr: String(record.amount / 100),
      paymentStatus: record.paymentStatus || 'pending',
      startDate: record.startDate || '',
      endDate: record.endDate || '',
      startTime: record.startTime || '',
      endTime: record.endTime || '',
      billingCycle: (record as any).billingCycle || 'monthly',
      addOns: (record.addOns?.selectedAddOns || []).join(', '),
      meetingRoomHours: String(record.addOns?.meetingRoomHours || 0),
      guestPasses: String(record.addOns?.guestPasses || 0),
      notes: record.notes || '',
    })
    setShowManualForm(true)
    requestAnimationFrame(() => {
      document
        .getElementById('booking-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleRenew = async (row: MergedRecord) => {
    const duration = durationInDays(row) || 30
    const start = row.endDate ? new Date(row.endDate) : new Date()
    const end = new Date(start)
    end.setDate(end.getDate() + duration)

    await manualEntryService.addEntry({
      entryType: 'membership',
      data: {
        id: '',
        customerName: row.customerName,
        email: row.email,
        phone: row.phone,
        organization: row.organization,
        planName: row.planName,
        membershipType: row.planName,
        roomName: row.roomName || undefined,
        status: 'active',
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        amount: row.amount,
        billingCycle: row.billingCycle === 'annual' ? 'annual' : 'monthly',
        locationId: row.locationId,
        locationName: row.locationName,
        autoRenew: false,
        createdAt: new Date().toISOString(),
        notes: `Renewed from ${row.id}`,
        addOns: row.addOns ?? {
          selectedAddOns: [],
          meetingRoomHours: 0,
          guestPasses: 0,
        },
      },
    })
    loadRecords()
  }

  const handleConvertToMembership = async (record: MergedRecord) => {
    try {
      await manualEntryService.addEntry({
        entryType: 'membership',
        data: {
          id: '',
          customerName: record.customerName,
          email: record.email,
          phone: record.phone,
          organization: record.organization,
          planName: record.planName,
          roomName: record.roomName || undefined,
          status: 'active',
          startDate: record.startDate || new Date().toISOString(),
          endDate: record.endDate || new Date().toISOString(),
          amount: record.amount,
          billingCycle: 'monthly',
          locationId: record.locationId,
          locationName: record.locationName,
          autoRenew: false,
          createdAt: new Date().toISOString(),
          notes: record.notes || undefined,
          addOns: record.addOns ?? {
            selectedAddOns: [],
            meetingRoomHours: 0,
            guestPasses: 0,
          },
        },
      })

      if (record.source === 'manual' && record.manualEntryId) {
        await manualEntryService.deleteEntry(record.manualEntryId)
      } else if (record.entryType === 'booking') {
        await bookingService.deleteBooking(record.id)
      }

      showToast('Converted to membership', 'success')
      loadRecords()
    } catch {
      showToast('Failed to convert to membership', 'error')
    }
  }

  const handleDelete = async (record: MergedRecord) => {
    setDeleteTarget(record)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    try {
      if (target.source === 'manual' && target.manualEntryId) {
        await manualEntryService.deleteEntry(target.manualEntryId)
      } else if (target.entryType === 'booking') {
        await bookingService.deleteBooking(target.id)
      }
      await loadRecords()
      showToast('Record deleted', 'success')
    } catch {
      showToast('Failed to delete. Please try again.', 'error')
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !manualForm.customerName ||
      !manualForm.locationName ||
      !manualForm.planName
    ) {
      showToast(
        'Please fill in customer, location, and plan information.',
        'error'
      )
      return
    }

    const startDate =
      manualForm.startDate || new Date().toISOString().split('T')[0]
    const durationDays = manualForm.billingCycle === 'annual' ? 365 : 30
    const end = new Date(startDate)
    end.setDate(end.getDate() + durationDays)
    const endDate = manualForm.endDate || end.toISOString().split('T')[0]

    const payload: MergedRecord = {
      id: editingRecord?.id || '',
      entryType: manualForm.entryType,
      customerName: manualForm.customerName,
      email: manualForm.email || undefined,
      phone: manualForm.phone || undefined,
      organization: manualForm.organization || undefined,
      locationName: manualForm.locationName,
      planName: manualForm.planName,
      roomName: manualForm.roomName || undefined,
      amount: Math.round(Number(manualForm.amountNpr || 0) * 100),
      status:
        editingRecord?.status ||
        (manualForm.entryType === 'membership' ? 'active' : 'pending'),
      paymentStatus: manualForm.paymentStatus,
      billingCycle: manualForm.billingCycle,
      autoRenew: editingRecord?.autoRenew ?? false,
      createdAt: editingRecord?.createdAt || new Date().toISOString(),
      addOns: {
        selectedAddOns: manualForm.addOns
          ? manualForm.addOns
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        meetingRoomHours: Number(manualForm.meetingRoomHours || 0),
        guestPasses: Number(manualForm.guestPasses || 0),
      },
      notes: manualForm.notes || undefined,
      startDate,
      endDate,
      startTime: manualForm.startTime || undefined,
      endTime: manualForm.endTime || undefined,
      locationId: editingRecord?.locationId,
      planId: editingRecord?.planId,
      source: editingRecord?.source || 'manual',
    }

    try {
      if (editingRecord) {
        if (editingRecord.source === 'manual' && editingRecord.manualEntryId) {
          await manualEntryService.updateEntry(
            editingRecord.manualEntryId,
            payload
          )
        } else if (editingRecord.entryType === 'booking') {
          await bookingService.updateBooking(editingRecord.id, {
            status: payload.status as 'pending' | 'confirmed',
            payment_status: payload.paymentStatus as any,
            total_amount: payload.amount,
            contact_info: {
              customerName: payload.customerName,
              email: payload.email,
              phone: payload.phone,
              organization: payload.organization,
            },
            start_date: payload.startDate || undefined,
            end_date: payload.endDate || undefined,
            start_time: payload.startTime || null,
            end_time: payload.endTime || null,
            add_ons: payload.addOns,
            notes: payload.notes || null,
          })
        }
        await loadRecords()
        showToast('Record updated successfully', 'success')
      } else {
        const inserted = await manualEntryService.addEntry({
          entryType: 'booking',
          data: payload,
        })
        setRecords((prev) => [
          {
            ...payload,
            id: inserted.id,
            manualEntryId: inserted.id,
            source: 'manual',
          },
          ...prev,
        ])
        showToast('Record added successfully', 'success')
      }
    } catch (err) {
      console.error('Failed to save:', err)
      showToast('Failed to save. Please try again.', 'error')
    }

    setManualForm(emptyForm)
    setShowManualForm(false)
    setEditingRecord(null)
  }

  const exportToCSV = () => {
    const headers = [
      'Type',
      'Date',
      'Customer',
      'Organization',
      'Email',
      'Phone',
      'Location',
      'Plan',
      'Amount (NPR)',
      'Status',
      'Payment Status',
      'Start Date',
      'End Date',
      'Days Left',
      'Billing Cycle',
    ]
    const rows = filtered.map((r) => {
      const daysLeft = r.endDate
        ? Math.floor(
            (new Date(r.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : ''
      return [
        r.entryType.charAt(0).toUpperCase() + r.entryType.slice(1),
        new Date(r.createdAt).toLocaleDateString(),
        r.customerName,
        r.organization || '',
        r.email || '',
        r.phone || '',
        r.locationName,
        r.planName,
        (r.amount / 100).toFixed(2),
        r.status,
        r.paymentStatus || '',
        r.startDate ? new Date(r.startDate).toLocaleDateString() : '',
        r.endDate ? new Date(r.endDate).toLocaleDateString() : '',
        daysLeft,
        (r as any).billingCycle || '',
      ]
    })
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-memberships-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-normal">Bookings & Memberships</h1>
          <p className="text-sm text-fg-2 mt-1">
            Manage all workspace bookings and memberships
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={loadRecords}>
            Refresh
          </Button>
          <Button
            onClick={() => {
              setShowManualForm((prev) => !prev)
              if (!showManualForm) {
                setEditingRecord(null)
                setManualForm(emptyForm)
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showManualForm ? 'Close Form' : 'Add Record'}
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-1 bg-bg-band rounded-lg p-1 w-fit">
        {(['all', 'booking', 'membership'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              typeFilter === t
                ? 'bg-bg-raised shadow-sm text-fg-1 font-medium'
                : 'text-fg-3 hover:text-fg-1'
            }`}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Total</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                  <p className="text-xs text-fg-2 mt-1">
                    {stats.bookingCount} bookings / {stats.membershipCount}{' '}
                    memberships
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-clay/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-clay" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Confirmed / Active</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.confirmedActive}
                  </p>
                  <p className="text-xs text-fg-2 mt-1">
                    {stats.bookingConfirmed} bookings /{' '}
                    {stats.membershipConfirmed} memberships
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                  <p className="text-xs text-fg-2 mt-1">
                    {stats.bookingPending} bookings / {stats.membershipPending}{' '}
                    memberships
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg-2">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.revenue.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-fg-2 mt-1">
                    NPR {stats.avgBooking.toFixed(0)} avg/record
                  </p>
                  <p className="text-xs text-fg-2">
                    NPR {stats.bookingRevenue.toLocaleString()} bookings / NPR{' '}
                    {stats.membershipRevenue.toLocaleString()} memberships
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Manual Entry Form */}
      {showManualForm && (
        <motion.div
          id="booking-form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <div className="bg-clay p-6 text-white">
              <h2 className="text-xl font-normal text-fg-on-ink-1">
                {editingRecord
                  ? 'Edit Record'
                  : `Add Manual ${manualForm.entryType === 'membership' ? 'Membership' : 'Booking'}`}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {editingRecord
                  ? 'Update record details'
                  : `Record a manual ${manualForm.entryType}`}
              </p>
            </div>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleManualSubmit}>
                {!editingRecord && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        manualForm.entryType === 'booking' ? 'default' : 'ghost'
                      }
                      onClick={() =>
                        setManualForm((prev) => ({
                          ...prev,
                          entryType: 'booking',
                        }))
                      }
                    >
                      Booking
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        manualForm.entryType === 'membership'
                          ? 'default'
                          : 'ghost'
                      }
                      onClick={() =>
                        setManualForm((prev) => ({
                          ...prev,
                          entryType: 'membership',
                        }))
                      }
                    >
                      Membership
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-normal text-sm">Customer Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">
                        Customer Name *
                      </label>
                      <Input
                        required
                        placeholder="e.g. John Doe"
                        value={manualForm.customerName}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            customerName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Email</label>
                      <Input
                        type="email"
                        placeholder="e.g. john@example.com"
                        value={manualForm.email}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Phone</label>
                      <Input
                        placeholder="e.g. 98XXXXXXXX"
                        value={manualForm.phone}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">
                        Organization *
                      </label>
                      <Input
                        required
                        placeholder="e.g. Acme Corp"
                        value={manualForm.organization}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            organization: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-normal text-sm">Booking Details</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Location *</label>
                      <Select
                        value={manualForm.locationName}
                        onValueChange={(val) =>
                          setManualForm((prev) => ({
                            ...prev,
                            locationName: val,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Select a location</SelectItem>
                          {locations.map((l) => (
                            <SelectItem key={l.id} value={l.name}>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Plan *</label>
                      <Select
                        value={manualForm.planName}
                        onValueChange={(val) =>
                          setManualForm((prev) => ({
                            ...prev,
                            planName: val,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Select a plan</SelectItem>
                          {plans.map((p) => (
                            <SelectItem key={p.id} value={p.name}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Room</label>
                      <Input
                        placeholder="e.g. Sun Room"
                        value={manualForm.roomName}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            roomName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Amount (NPR)</label>
                      <Input
                        placeholder="e.g. 50000"
                        type="number"
                        min="0"
                        value={manualForm.amountNpr}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            amountNpr: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">
                        Payment Status
                      </label>
                      <Select
                        value={manualForm.paymentStatus}
                        onValueChange={(val) =>
                          setManualForm((prev) => ({
                            ...prev,
                            paymentStatus: val,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUSES.map((ps) => (
                            <SelectItem key={ps} value={ps}>
                              {ps.charAt(0).toUpperCase() + ps.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-fg-2">Start Date</label>
                        <DatePicker
                          value={manualForm.startDate}
                          onChange={(val) =>
                            setManualForm((prev) => ({
                              ...prev,
                              startDate: val,
                            }))
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-fg-2">End Date</label>
                        <DatePicker
                          value={manualForm.endDate}
                          onChange={(val) =>
                            setManualForm((prev) => ({
                              ...prev,
                              endDate: val,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Start Time</label>
                      <TimePicker
                        value={manualForm.startTime}
                        onChange={(val) =>
                          setManualForm((prev) => ({
                            ...prev,
                            startTime: val,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">End Time</label>
                      <TimePicker
                        value={manualForm.endTime}
                        onChange={(val) =>
                          setManualForm((prev) => ({
                            ...prev,
                            endTime: val,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-normal text-sm">Add-ons (Optional)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Add-ons</label>
                      <Input
                        placeholder="Comma separated (e.g. Guest Passes, Mail)"
                        value={manualForm.addOns}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            addOns: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">
                        Meeting Room Hours
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        value={manualForm.meetingRoomHours}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            meetingRoomHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-fg-2">Guest Passes</label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 2"
                        value={manualForm.guestPasses}
                        onChange={(e) =>
                          setManualForm((prev) => ({
                            ...prev,
                            guestPasses: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-fg-2">Notes</label>
                    <Textarea
                      className="md:col-span-3"
                      placeholder="Any additional notes..."
                      value={manualForm.notes}
                      onChange={(e) =>
                        setManualForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowManualForm(false)
                      setEditingRecord(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRecord ? 'Update Record' : 'Save Record'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search name, email, plan, status..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-clay" />
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-clay" />
                <Select
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="expiry">Expiry</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  className="px-2 py-1 rounded border hover:bg-bg-band text-sm"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-clay" />
          <span className="ml-2 text-fg-2">Loading records...</span>
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-clay-deep/10">
          <CardContent className="p-4">
            <p className="text-sm text-clay-deep">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((r, index) => {
            const isMembership = r.entryType === 'membership'
            const countdown = isMembership ? formatCountdown(r.endDate) : null
            const duration = isMembership ? durationInDays(r) : null

            return (
              <motion.div
                key={r.id + r.entryType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-clay flex items-center justify-center text-white font-bold">
                              {r.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {r.customerName}
                              </div>
                              <div className="text-xs text-fg-2">
                                {r.email || 'No email'}
                              </div>
                              <div className="text-xs text-fg-2">
                                {r.phone || 'No phone'}
                              </div>
                              <div className="text-xs text-fg-2">
                                {r.organization || ''}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-fg-2 mb-1">
                            Location & Plan
                          </div>
                          <div className="font-medium text-sm">
                            {r.locationName}
                          </div>
                          <div className="text-xs text-clay">{r.planName}</div>
                          {r.roomName && (
                            <div className="text-xs text-fg-2 mt-1">
                              Room: {r.roomName}
                            </div>
                          )}
                          {isMembership && duration !== null && (
                            <div className="text-xs text-fg-2 mt-1">
                              Duration: {duration} days
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-fg-2 mb-1">Amount</div>
                          <div className="font-bold text-lg">
                            NPR{' '}
                            {(r.amount / 100).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {isMembership && (r as any).billingCycle && (
                            <div className="text-xs text-fg-2">
                              {(r as any).billingCycle?.replace('-', ' ')}
                            </div>
                          )}
                          <div className="text-xs text-fg-2">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          {r.startDate && (
                            <div className="space-y-1">
                              <div className="text-xs text-fg-2">Schedule</div>
                              <div className="text-xs">
                                {new Date(r.startDate).toLocaleDateString()}
                                {r.endDate && r.endDate !== r.startDate && (
                                  <>
                                    {' '}
                                    - {new Date(r.endDate).toLocaleDateString()}
                                  </>
                                )}
                              </div>
                              {!isMembership && r.startTime && (
                                <div className="text-xs text-fg-2">
                                  {r.startTime}
                                  {r.endTime ? ` - ${r.endTime}` : ''}
                                </div>
                              )}
                            </div>
                          )}
                          {isMembership && countdown && (
                            <Badge
                              variant={countdown.variant}
                              className="mt-2 w-fit"
                            >
                              {countdown.label}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {isMembership ? (
                            <>
                              <Badge
                                variant={
                                  r.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="w-fit"
                              >
                                {getStatusLabel(r.status)}
                              </Badge>
                              <Select
                                value={r.status}
                                onValueChange={(val) =>
                                  handleStatusChange(r, val)
                                }
                              >
                                <SelectTrigger className="h-auto text-xs px-2 py-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(MEMBERSHIP_STATUS).map(
                                    (status) => (
                                      <SelectItem key={status} value={status}>
                                        {getStatusLabel(status)}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <Switch
                                  id={`status-${r.id}`}
                                  checked={r.status === 'confirmed'}
                                  disabled={updatingIds.has(r.id)}
                                  onCheckedChange={() =>
                                    handleStatusToggle(r.id, r.status, r)
                                  }
                                />
                                <Label
                                  htmlFor={`status-${r.id}`}
                                  className="text-xs cursor-pointer"
                                >
                                  <Badge
                                    variant={
                                      r.status === 'confirmed'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {r.status === 'confirmed'
                                      ? 'Confirmed'
                                      : 'Pending'}
                                  </Badge>
                                </Label>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-fg-2">
                                  Payment
                                </span>
                                <Select
                                  value={r.paymentStatus || 'pending'}
                                  onValueChange={(val) =>
                                    handlePaymentStatusChange(r.id, val, r)
                                  }
                                >
                                  <SelectTrigger className="h-auto text-xs px-2 py-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PAYMENT_STATUSES.map((ps) => (
                                      <SelectItem key={ps} value={ps}>
                                        {ps.charAt(0).toUpperCase() +
                                          ps.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(r)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(r)}
                            >
                              <Trash2 className="h-4 w-4 text-clay-deep" />
                            </Button>
                            {isMembership ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRenew(r)}
                              >
                                Renew
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConvertToMembership(r)}
                              >
                                Convert to Membership
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {(r.addOns.selectedAddOns.length > 0 ||
                        r.addOns.meetingRoomHours > 0 ||
                        r.addOns.guestPasses > 0 ||
                        r.notes) && (
                        <div className="pt-4 border-t">
                          <div className="text-xs font-normal mb-2">
                            Add-ons & Extras
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {r.addOns.selectedAddOns.map((addOn, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {addOn}
                              </Badge>
                            ))}
                            {r.addOns.meetingRoomHours > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Meeting Room: {r.addOns.meetingRoomHours}h
                              </Badge>
                            )}
                            {r.addOns.guestPasses > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Guest Passes: {r.addOns.guestPasses}
                              </Badge>
                            )}
                          </div>
                          {r.notes && (
                            <div className="mt-3 p-3 bg-bg-band/50 rounded">
                              <div className="text-xs font-medium text-fg-2 mb-1">
                                Notes:
                              </div>
                              <div className="text-sm text-fg-1">{r.notes}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
          {filtered.length === 0 && (
            <Card className="border-dashed border-2 border-rule">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-fg-3 mx-auto mb-4" />
                <p className="text-fg-2">No records found</p>
                <p className="text-sm text-fg-3 mt-1">
                  Try adjusting your filters or search query
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Record"
        message={`Delete record for "${deleteTarget?.customerName}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
