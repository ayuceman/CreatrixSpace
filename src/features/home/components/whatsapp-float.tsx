import { MessageCircle } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'

export function WhatsappFloat() {
  return (
    <a
      href={WHATSAPP.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-clay text-bg flex items-center justify-center shadow-soft transition-all hover:bg-clay-deep hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
