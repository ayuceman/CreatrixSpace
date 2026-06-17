import { ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react'
import { WHATSAPP } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-ink text-fg-on-ink-1 pt-24 pb-8 border-t border-[rgba(243,239,231,0.06)]">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-rule-on-ink">
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display text-[40px] tracking-[-0.01em] leading-none">
              Creatrix<em className="text-clay not-italic">Space</em>
            </div>
            <p className="text-[15px] leading-[1.6] text-fg-on-ink-2 mt-[22px] max-w-[320px]">
              A small, premium coworking outfit in Kathmandu and Lalitpur. Three
              rooms, open from morning to morning.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-7 flex gap-0 border-b border-rule-on-ink pb-2 max-w-[320px]"
            >
              <input
                placeholder="Email for the letter"
                className="flex-1 bg-transparent border-0 outline-0 text-fg-on-ink-1 font-body text-sm"
              />
              <button
                type="submit"
                className="bg-transparent border-0 text-clay cursor-pointer font-body text-sm font-medium inline-flex items-center gap-1 shrink-0"
              >
                Subscribe
                <ArrowRight size={12} />
              </button>
            </form>
            <div className="text-xs text-fg-3 mt-2">
              Monthly. Field notes, openings, member interviews.
            </div>
          </div>

          <div>
            <div className="eyebrow text-clay mb-4.5">Locations</div>
            <a
              href="/locations#dhobighat"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Dhobighat Hub
              <br />
              <span className="font-mono text-xs text-fg-3">
                Mandala St, Kathmandu
              </span>
            </a>
            <a
              href="/locations#kausimaa"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Kausimaa Co-working
              <br />
              <span className="font-mono text-xs text-fg-3">
                Kupondole, Lalitpur
              </span>
            </a>
            <a
              href="/locations#jhamsikhel"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Jhamsikhel Loft
              <br />
              <span className="font-mono text-xs text-fg-3">
                Jhamsikhel, Lalitpur
              </span>
            </a>
          </div>

          <div>
            <div className="eyebrow text-clay mb-4.5">Membership</div>
            <a
              href="/#membership"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Day pass &middot; NPR 800
            </a>
            <a
              href="/#membership"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Week pass &middot; NPR 3,000
            </a>
            <a
              href="/#membership"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Dedicated desk &middot; NPR 8,000
            </a>
            <a
              href="/#membership"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Private offices &middot; 5 available
            </a>
            <a
              href="/#membership"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Virtual office &middot; NPR 6,000
            </a>
            <a
              href="/#spaces"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Event &amp; training rooms
            </a>
            <a
              href="/booking"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Book a tour
            </a>
          </div>

          <div>
            <div className="eyebrow text-clay mb-4.5">Talk to us</div>
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={14} />
                WhatsApp
              </span>
              <br />
              <span className="font-mono text-xs text-fg-3">
                +977 9851 000 000
              </span>
            </a>
            <a
              href="tel:+97715453000"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              <span className="inline-flex items-center gap-2">
                <Phone size={14} />
                Call us
              </span>
              <br />
              <span className="font-mono text-xs text-fg-3">
                +977 1 5453000
              </span>
            </a>
            <a
              href="mailto:hello@creatrixventures.space"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              <span className="inline-flex items-center gap-2">
                <Mail size={14} />
                Email
              </span>
              <br />
              <span className="font-mono text-xs text-fg-3">
                hello@creatrixventures.space
              </span>
            </a>
            <a
              href="/#concierge"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              Concierge chat
            </a>
            <a
              href="/#faq"
              className="text-fg-on-ink-2 no-underline text-sm block py-[5px] transition-colors duration-base ease-out hover:text-fg-on-ink-1"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="pt-7 flex justify-between items-center flex-wrap gap-4">
          <div className="font-mono text-xs text-fg-3">
            &copy; CreatrixSpace 2026 &middot; Kathmandu &amp; Lalitpur &middot;
            Powered by{' '}
            <a
              href="#"
              className="text-fg-on-ink-2 underline underline-offset-3"
            >
              Creatrix Technologies
            </a>
          </div>
          <div className="flex gap-5.5 text-[13px]">
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Instagram
            </a>
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Substack
            </a>
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Privacy
            </a>
            <a href="#" className="text-fg-on-ink-2 no-underline">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
