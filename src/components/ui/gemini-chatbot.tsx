import { useEffect, useRef, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MessageSquare, X, Send } from 'lucide-react'

type ChatMessage = {
  id: string
  role: 'user' | 'model'
  text: string
}

const BRAND_CONTEXT = `You are the helpful website assistant for CreatrixSpace.
Use a friendly, concise tone. If questions are unrelated to CreatrixSpace, answer briefly and offer to get back to relevant topics.

Company background:
CreatrixSpace is a premium coworking brand redefining the future of workspaces in Nepal by creating inspiring, flexible environments that promote innovation, collaboration, and personal growth. Founded by Ayushman Bajracharya, who were dissatisfied with traditional offices that limited creativity and connection, the company started with a single space in Kathmandu and has since expanded into a thriving network with three locations — Dhobighat (WashingTown) Hub, Kausimaa Co-working, and Jhamsikhel Loft — serving over 500 happy members, hosting 100+ events, and backed by more than five years of experience. Each workspace offers modern amenities such as high-speed WiFi, meeting rooms, event spaces, coffee and tea, lounge areas, phone booths, printing services, outdoor terraces, parking, and 24/7 access in selected hubs.

CreatrixSpace operates with strong values of Community First, fostering supportive connections; Innovation Focus, offering cutting-edge facilities and technology; Excellence, maintaining top-tier standards; and Work-Life Balance, ensuring productivity and well-being. Its mission is to empower professionals and entrepreneurs by providing flexible, inspiring workspaces that unlock human potential and drive positive community change. The company offers transparent pricing plans including Explorer (NPR 500/day), Professional (NPR 9,500/month), Enterprise (NPR 18,500/month), and Private Office (NPR 58,500/month), all with no setup fees and flexible cancellation. Add-ons like extra meeting hours, guest passes, virtual office addresses, and phone lines are also available. Members can upgrade, downgrade, or cancel plans anytime, access multiple locations, and enjoy community events and networking opportunities.

CreatrixSpace’s main office is located at Dhobighat Chowk, Kathmandu, and can be reached at +977 9851357889 or WhatsApp +977 9803171819
, with business hours from 8:00 AM to 8:00 PM (Mon–Fri) and 9:00 AM to 6:00 PM (Sat–Sun). A user-friendly website allows online bookings, membership management, and tour scheduling. Its blog — Insights & Stories from the Future of Work — features articles by writers like Priya Sharma, Emma Davis, Rajesh Thapa, Sophia Chen, Alex Rodriguez, and Michael Chen, covering topics such as The Remote Work Revolution in Nepal, Building Nepal’s Startup Ecosystem, 10 Productivity Hacks for Coworking Users, Maintaining Work-Life Balance, The Art of Networking, and Sustainable Workspace Design.

With an active, forward-thinking community and a focus on sustainability, flexibility, and excellence, CreatrixSpace continues to shape the modern work culture in Nepal — offering premium coworking spaces designed for professionals seeking creativity, connection, and growth. Subscribers can stay updated on new locations and offers through email newsletters, and all services are protected under © 2024 CreatrixSpace, with clearly outlined Terms of Service and Privacy Policy.`

export function GeminiChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi! I\'m Creatrix Assistant. Ask me about memberships, locations, or bookings.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)

  const getClient = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
    if (!key) return null
    return new GoogleGenerativeAI(key)
  }

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const remainingCooldownSec = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)) : 0

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    if (cooldownUntil && Date.now() < cooldownUntil) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const ai = getClient()
      if (!ai) {
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'model', text: 'API key is missing. Please set VITE_GEMINI_API_KEY in your .env and restart the dev server.' }
        ])
        return
      }
      // lightweight retry with backoff for transient rate limits
      let response: any
      const maxRetries = 2
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
          const chat = model.startChat({
            history: [
              { role: 'user', parts: [{ text: BRAND_CONTEXT }] },
              ...messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
            ]
          })
          response = await chat.sendMessage(trimmed)
          break
        } catch (err: any) {
          const status = err?.error?.status || err?.status || err?.code
          if (status === 'RESOURCE_EXHAUSTED' || status === 429 || /RATE_LIMIT/i.test(err?.message || '')) {
            if (attempt < maxRetries) {
              await sleep(500 * Math.pow(2, attempt))
              continue
            }
          }
          throw err
        }
      }
      const modelText = response.response.text()
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'model', text: modelText || 'Sorry, I could not generate a response.' }])
    } catch (err: any) {
      const status = err?.error?.status || err?.status || err?.code
      if (status === 'RESOURCE_EXHAUSTED' || status === 429 || /RATE_LIMIT/i.test(err?.message || '')) {
        const cooldownMs = 15000
        setCooldownUntil(Date.now() + cooldownMs)
        // Fallback to local knowledge base so the assistant still works
        const local = localAnswer(trimmed)
        setFallbackMode(true)
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'model', text: `${local}\n\n(note: using offline assistant while the AI service cools down)` }
        ])
      } else {
        const local = localAnswer(trimmed)
        setFallbackMode(true)
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'model', text: local }])
      }
      // eslint-disable-next-line no-console
      console.error('Gemini error', err)
    } finally {
      setLoading(false)
    }
  }

  function localAnswer(q: string): string {
    const query = q.toLowerCase()
    if (/location|where|branch|office|dhobighat|kausimaa|jhamsikhel/.test(query)) {
      return 'We currently operate in Kathmandu: Dhobighat, Kausimaa, and Jhamsikhel. You can visit any location with applicable memberships and day passes.'
    }
    if (/price|pricing|cost|membership|plan|day pass|private office/.test(query)) {
      return 'Membership options: Day Pass (flexible daily access), Professional (monthly hot desk with perks), Enterprise (team features), and Private Office (dedicated office). All include high-speed WiFi, meeting rooms (per plan), coffee, printing, and 24/7 access on eligible plans.'
    }
    if (/book|tour|free tour|trial/.test(query)) {
      return 'You can book a free tour or start a booking from the Booking page. Use the “Start Free Tour” or any membership CTA to proceed.'
    }
    if (/amenit|wifi|coffee|printing|meeting|24\/?7/.test(query)) {
      return 'Amenities include high-speed WiFi, coffee/tea, printing, meeting rooms, storage options, community events, and 24/7 access for select plans.'
    }
    if (/mission|about|who|creatrixspace|founder|ayushman/.test(query)) {
      return 'CreatrixSpace is a premium coworking brand in Nepal founded by Ayushman Bajracharya. Our mission is to empower professionals through inspiring, community-driven, flexible workspaces.'
    }
    if (/contact|sales|phone|email/.test(query)) {
      return 'You can reach our team via the Contact page. We\'ll help with memberships, private offices, or tours.'
    }
    return 'I\'m here to help with CreatrixSpace memberships, locations, pricing, bookings, and amenities. Try asking about plans, locations (Dhobighat, Kausimaa, Jhamsikhel), or booking a tour.'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="w-80 sm:w-96 h-96 bg-background border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="font-semibold">Creatrix Assistant{fallbackMode ? ' (offline)' : ''}</div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="opacity-90 hover:opacity-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={
                  'inline-block px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-wrap ' +
                  (m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')
                }>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-muted-foreground">Thinking…</div>}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !remainingCooldownSec) send() }}
              placeholder="Ask about memberships, locations…"
              className="flex-1 h-10 px-3 rounded-md border bg-background"
            />
            <button
              onClick={send}
              disabled={loading || !!remainingCooldownSec}
              className="h-10 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
            {remainingCooldownSec > 0 && (
              <span className="text-xs text-muted-foreground min-w-[60px] text-right">{remainingCooldownSec}s</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GeminiChatbot


