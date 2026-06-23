import { createContext, useContext, useState, type ReactNode } from 'react'

interface BookTourContextType {
  open: boolean
  seed: { location?: string; plan?: string }
  openTour: (seed?: { location?: string; plan?: string }) => void
  closeTour: () => void
}

const BookTourContext = createContext<BookTourContextType | null>(null)

export function BookTourProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [seed, setSeed] = useState<{ location?: string; plan?: string }>({})

  const openTour = (seed?: { location?: string; plan?: string }) => {
    setSeed(seed ?? {})
    setOpen(true)
  }

  const closeTour = () => {
    setOpen(false)
    setSeed({})
  }

  return (
    <BookTourContext.Provider value={{ open, seed, openTour, closeTour }}>
      {children}
    </BookTourContext.Provider>
  )
}

export function useBookTour() {
  const ctx = useContext(BookTourContext)
  if (!ctx) throw new Error('useBookTour must be used within BookTourProvider')
  return ctx
}
