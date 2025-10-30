import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Footer } from './footer'
import { ScrollToTop } from './scroll-to-top'
import GeminiChatbot from '@/components/ui/gemini-chatbot'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <GeminiChatbot />
    </div>
  )
}
