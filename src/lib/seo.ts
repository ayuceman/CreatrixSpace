export interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'business.business'
  siteName?: string
  locale?: string
  noindex?: boolean
  canonical?: string
}

const DEFAULT_SEO: Required<Omit<SEOData, 'keywords' | 'image' | 'url' | 'type' | 'noindex' | 'canonical'>> = {
  title: 'CreatrixSpace - Premium Coworking Spaces in Nepal',
  description: 'Premium coworking spaces for modern professionals. Flexible plans, 24/7 access, high-speed internet, and vibrant community in Kathmandu, Nepal.',
  siteName: 'CreatrixSpace',
  locale: 'en_US',
}

export function updateSEO(data: SEOData) {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://creatrixspace.com'
  const fullTitle = data.title 
    ? `${data.title} | ${DEFAULT_SEO.siteName}`
    : DEFAULT_SEO.title
  const description = data.description || DEFAULT_SEO.description
  const image = data.image || `${baseUrl}/creatrix-space-productivity.png`
  const url = data.url || (typeof window !== 'undefined' ? window.location.href : baseUrl)
  const canonical = data.canonical || url

  // Update title
  if (document.title !== fullTitle) {
    document.title = fullTitle
  }

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, name)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  // Basic meta tags
  updateMetaTag('description', description)
  if (data.keywords) {
    updateMetaTag('keywords', data.keywords)
  }

  // Open Graph tags
  updateMetaTag('og:title', fullTitle, 'property')
  updateMetaTag('og:description', description, 'property')
  updateMetaTag('og:image', image, 'property')
  updateMetaTag('og:url', url, 'property')
  updateMetaTag('og:type', data.type || 'website', 'property')
  updateMetaTag('og:site_name', DEFAULT_SEO.siteName, 'property')
  updateMetaTag('og:locale', data.locale || DEFAULT_SEO.locale, 'property')

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', fullTitle)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', image)

  // Robots meta
  if (data.noindex) {
    updateMetaTag('robots', 'noindex, nofollow')
  } else {
    const robotsElement = document.querySelector('meta[name="robots"]')
    if (robotsElement) {
      robotsElement.remove()
    }
  }

  // Canonical URL
  let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonicalElement) {
    canonicalElement = document.createElement('link')
    canonicalElement.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalElement)
  }
  canonicalElement.setAttribute('href', canonical)
}

export function generateStructuredData(type: 'Organization' | 'LocalBusiness' | 'Article', data: Record<string, any>) {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://creatrixspace.com'
  
  const schemas: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CreatrixSpace',
      url: baseUrl,
      logo: `${baseUrl}/creatrix-logo.png`,
      description: DEFAULT_SEO.description,
      ...data,
    },
    LocalBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'CreatrixSpace',
      description: DEFAULT_SEO.description,
      url: baseUrl,
      image: `${baseUrl}/creatrix-space-productivity.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati',
        addressCountry: 'NP',
      },
      ...data,
    },
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      ...data,
    },
  }

  return schemas[type] || schemas.Organization
}

export function injectStructuredData(data: Record<string, any>) {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data, null, 2)
  document.head.appendChild(script)
}

