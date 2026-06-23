import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Footer } from './footer'
import { ScrollToTop } from './scroll-to-top'
import { BookTourProvider } from '@/lib/book-tour-context'
import { BookTourSheet } from '@/features/home/components/book-tour-sheet'
import { useBookTour } from '@/lib/book-tour-context'
import { WhatsappFloat } from '@/features/home/components/whatsapp-float'

function BookTourGate() {
  const { open, seed, closeTour } = useBookTour()
  return <BookTourSheet open={open} onClose={closeTour} seed={seed} />
}

export function RootLayout() {
  return (
    <BookTourProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        {/* <GeminiChatbot /> */}
        <WhatsappFloat />
        <BookTourGate />
      </div>
    </BookTourProvider>
  )
}
