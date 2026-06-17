import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, MessageCircle, Phone, Mail } from 'lucide-react'
import { HiArrowRight } from 'react-icons/hi2'
import { Button } from '@/components/ui/button'
import { WHATSAPP } from '@/lib/constants'
import { Link } from 'react-router-dom'

const rooms = [
  { name: 'Dhobighat', location: 'Kathmandu' },
  { name: 'Kausimaa', location: 'Kupondole' },
  { name: 'Jhamsikhel', location: 'Lalitpur' },
]

export function CTASection() {
  const [selectedRoom, setSelectedRoom] = useState<string>('Dhobighat')

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-ink text-fg-on-ink-1 py-32"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img
          src="/images/cta-section.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(at_30%_40%,rgba(184_85_46/0.18)_0%,rgba(26_25_22/0)_60%)]" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="eyebrow text-clay mb-5.5">
              Your desk is waiting
            </div>
            <h2 className="font-display font-normal text-[clamp(48px,7vw,104px)] leading-[0.98] tracking-[-0.02em] m-0 text-fg-on-ink-1">
              Come by <em className="text-clay not-italic">tomorrow</em>.<br />
              Stay <em className="text-clay not-italic">as long</em> as you
              like.
            </h2>
            <p className="text-lg leading-[1.6] text-fg-on-ink-2 mt-7 max-w-130">
              Leave a name and an email. We&rsquo;ll hold a desk at the room of
              your choice and follow up with directions. Nothing else gets sent
              to your inbox.
            </p>
            <div className="mt-9 pt-7 border-t border-rule-on-ink flex gap-6 text-[13px] text-fg-on-ink-2 flex-wrap">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                No deposit
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                No joining fee
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                Cancel any time
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="bg-bg text-fg-1 border border-[rgba(243,239,231,0.08)] rounded-sm p-9 pb-8"
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-4.5"
            >
              <div className="eyebrow text-clay">Reserve a tour</div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                  Your name
                </span>
                <input
                  placeholder="e.g. Sunaina Pradhan"
                  required
                  className="font-body text-[15px] p-3 px-3.5 border border-rule rounded-sm bg-bg-raised outline-none text-fg-1 w-full"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                  Email
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="font-body text-[15px] p-3 px-3.5 border border-rule rounded-sm bg-bg-raised outline-none text-fg-1 w-full"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] tracking-[0.12em] uppercase text-fg-2 font-medium">
                  Which room
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {rooms.map((room) => (
                    <button
                      key={room.name}
                      type="button"
                      onClick={() => setSelectedRoom(room.name)}
                      className={`p-[10px_8px] text-center rounded-sm cursor-pointer font-body text-xs leading-[1.2] transition-[background,border] duration-base ease-out ${
                        selectedRoom === room.name
                          ? 'bg-ink text-bg border border-transparent'
                          : 'bg-bg-raised text-fg-1 border border-rule'
                      }`}
                    >
                      {room.name}
                      <div className="font-mono text-[10px] opacity-60 mt-0.5">
                        {room.location}
                      </div>
                    </button>
                  ))}
                </div>
              </label>

              <Button
                type="submit"
                text="Hold my desk"
                icon={HiArrowRight}
                iconPosition="right"
                iconSize={16}
                className="mt-2 justify-center bg-ink text-bg rounded-sm border-0 hover:opacity-85 w-full"
              />

              <div className="flex items-center gap-3 my-1 text-fg-3 text-[11px] tracking-[0.16em] uppercase font-mono">
                <span className="flex-1 h-px bg-rule" />
                Or reach us directly
                <span className="flex-1 h-px bg-rule" />
              </div>

              <Link
                to={`https://wa.me/${WHATSAPP.NUMBER}?text=${encodeURIComponent("Hello CreatrixSpace — I'd like to enquire.")}`}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between px-3.5 py-3 rounded-sm bg-[#25D366] text-white no-underline text-sm font-medium"
              >
                <span className="inline-flex items-center gap-2.5">
                  <MessageCircle size={16} />
                  WhatsApp &mdash; reply in a minute
                </span>
                <span className="font-mono text-xs opacity-[0.85]">
                  +977 9851 000 000
                </span>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+97715453000"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm bg-bg-raised border border-rule-strong text-fg-1 no-underline font-body text-[13px]"
                >
                  <Phone size={14} />
                  <span>+977 1 5453000</span>
                </a>
                <a
                  href="mailto:hello@creatrixventures.space"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm bg-bg-raised border border-rule-strong text-fg-1 no-underline font-body text-[13px]"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>
              </div>

              <button
                type="button"
                className="bg-transparent border-0 p-0 text-[13px] text-fg-2 underline underline-offset-4 cursor-pointer self-start"
              >
                Or pick a specific date &rarr;
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
