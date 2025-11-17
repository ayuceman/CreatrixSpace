import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SEOData, updateSEO, generateStructuredData, injectStructuredData } from '@/lib/seo'

interface SEOHeadProps extends SEOData {
  structuredData?: Record<string, any>
  structuredDataType?: 'Organization' | 'LocalBusiness' | 'Article'
}

export function SEOHead({
  structuredData,
  structuredDataType = 'Organization',
  ...seoData
}: SEOHeadProps) {
  const location = useLocation()
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://creatrixspace.com'

  useEffect(() => {
    // Update SEO meta tags
    updateSEO({
      ...seoData,
      url: seoData.url || `${baseUrl}${location.pathname}`,
      canonical: seoData.canonical || `${baseUrl}${location.pathname}`,
    })

    // Inject structured data if provided
    if (structuredData) {
      injectStructuredData(structuredData)
    } else if (structuredDataType) {
      const defaultStructuredData = generateStructuredData(structuredDataType, {})
      injectStructuredData(defaultStructuredData)
    }
  }, [location.pathname, seoData, structuredData, structuredDataType, baseUrl])

  return null
}

