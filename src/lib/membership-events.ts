export type MembershipEvent = {
  id: string
  customerName: string
  email?: string
  phone?: string
  membershipType: string // explorer, professional, enterprise, private-office
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'suspended'
  startDate: string
  endDate: string
  amount: number // in paisa
  billingCycle: 'daily' | 'monthly' | 'annual'
  locationId?: string
  autoRenew: boolean
  createdAt: string
  updatedAt?: string
  notes?: string
}

const MEMBERSHIPS_KEY = 'memberships'
const MEMBERSHIP_NEW_KEY = 'membership_new'
const MEMBERSHIP_UPDATE_KEY = 'membership_update'

export function getMemberships(): MembershipEvent[] {
  try {
    const raw = localStorage.getItem(MEMBERSHIPS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveMemberships(memberships: MembershipEvent[]) {
  try {
    localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(memberships))
  } catch {}
}

export function addMembership(membership: MembershipEvent) {
  const memberships = getMemberships()
  memberships.unshift(membership)
  saveMemberships(memberships)
}

export function updateMembership(id: string, updates: Partial<MembershipEvent>) {
  const memberships = getMemberships()
  const index = memberships.findIndex((m) => m.id === id)
  if (index !== -1) {
    memberships[index] = { ...memberships[index], ...updates, updatedAt: new Date().toISOString() }
    saveMemberships(memberships)
    try {
      localStorage.setItem(MEMBERSHIP_UPDATE_KEY, JSON.stringify({ ...memberships[index], _ts: Date.now() }))
    } catch {}
    return memberships[index]
  }
  return null
}

export function notifyNewMembership(membership: MembershipEvent) {
  addMembership(membership)
  try {
    localStorage.setItem(MEMBERSHIP_NEW_KEY, JSON.stringify({ ...membership, _ts: Date.now() }))
  } catch {}
}

export function onNewMembership(callback: (membership: MembershipEvent) => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === MEMBERSHIP_NEW_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue) as MembershipEvent
        callback(data)
      } catch {}
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export function onMembershipUpdate(callback: (membership: MembershipEvent) => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === MEMBERSHIP_UPDATE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue) as MembershipEvent
        callback(data)
      } catch {}
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

