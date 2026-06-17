import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WHATSAPP } from '@/lib/constants'
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom'

export function WhatsappFloat() {
  const [visible, setVisible] = useState(false)
  const [overFooter, setOverFooter] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = document.querySelector('footer')
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setOverFooter(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const show = visible && !overFooter

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.36, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed bottom-[22px] right-[22px] z-60 flex items-center gap-3"
        >
          <Link
            to={WHATSAPP.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="bg-[#25D366] text-white no-underline w-14 h-14 rounded-full inline-flex items-center justify-center shrink-0 transition-transform duration-200 ease-out hover:scale-105 shadow-[0_6px_18px_rgba(37,211,102,0.36),0_2px_6px_rgba(26,25,22,0.12)]"
          >
            <FaWhatsapp size={32} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
