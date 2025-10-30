export type NewBookingEvent = {
  id: string
  customerName: string
  email?: string
  phone?: string
  locationName?: string
  planName?: string
  amount: number // in paisa
  status: string
  createdAt: string
}

const BOOKINGS_KEY = 'bookings'
const BOOKING_NEW_KEY = 'booking_new'

export function appendBooking(booking: NewBookingEvent) {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    const list = raw ? JSON.parse(raw) : []
    list.unshift(booking)
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
  } catch {}
}

export function notifyNewBooking(booking: NewBookingEvent) {
  // Persist and then emit a storage event via setItem to notify other tabs
  appendBooking(booking)
  try {
    localStorage.setItem(BOOKING_NEW_KEY, JSON.stringify({ ...booking, _ts: Date.now() }))
  } catch {}
}

export function onNewBooking(callback: (booking: NewBookingEvent) => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === BOOKING_NEW_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue) as NewBookingEvent
        callback(data)
      } catch {}
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}


