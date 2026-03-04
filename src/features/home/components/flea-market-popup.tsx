import { useEffect, useState } from 'react'
import { X, Phone, MessageCircle, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'flea-market-popup-dismissed'
const PHONE = '9700045256'
const WHATSAPP_URL = `https://wa.me/977${PHONE}`
const getShareUrl = () => (typeof window !== 'undefined' ? window.location.href : 'https://creatrixventures.space')
const SHARE_TEXT = 'Saturday Flea Market - March 7, 10AM-6PM at Dhobighat. DM to reserve your spot!'

export function FleaMarketPopup() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    const timer = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}&quote=${encodeURIComponent(SHARE_TEXT)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(SHARE_TEXT)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + getShareUrl())}`,
      '_blank'
    )
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-fit max-w-full">
          <img
            src="/postponedd@1x_1.jpg.jpeg"
            alt="Saturday Flea Market postponed due to upcoming election - new date to be announced"
            className="w-full h-auto object-contain max-h-[80vh] block rounded-lg shadow-2xl"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 w-9 h-9 rounded-full shadow-lg"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-3 mt-3 bg-black/40 backdrop-blur-sm rounded-lg w-full">
          <a
            href={`tel:+977${PHONE}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 text-gray-900 text-sm font-medium hover:bg-white transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{PHONE}</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#20BD5A] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
          <span className="hidden sm:inline w-px h-5 bg-white/30" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={shareFacebook}
              className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Share on Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button
              onClick={shareTwitter}
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Share on X"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button
              onClick={shareWhatsApp}
              className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Share via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={copyLink}
              className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Copy link"
            >
              {copied ? (
                <span className="text-xs font-medium">✓</span>
              ) : (
                <Link2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
