import { useEffect, useState } from 'react'
import { addOnService } from '@/services/supabase-service'

const VIRTUAL_OFFICE_PRICE_PAISA = 600000 // NPR 6,000/mo

export function useVirtualOfficeAddon() {
  const [pricePaisa, setPricePaisa] = useState<number>(
    VIRTUAL_OFFICE_PRICE_PAISA
  )
  const [name, setName] = useState('Virtual Office Address')
  const [description, setDescription] = useState(
    'Use our professional address for your business registration and correspondence. Includes mail receiving service.'
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const addOns = await addOnService.getAllAddOns()
        const vo = addOns.find(
          (a) => a.type === 'virtual_office' && a.active !== false
        )
        if (!cancelled && vo) {
          // Keep the public virtual office package fixed at NPR 6,000/month.
          setPricePaisa(VIRTUAL_OFFICE_PRICE_PAISA)
          setName(vo.name)
          if (vo.description) setDescription(vo.description)
        }
      } catch {
        // keep fallback
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { pricePaisa, name, description, loading }
}
