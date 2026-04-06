import { HeroSection } from '../components/hero-section'
import { FeaturesSection } from '../components/features-section'
import { VirtualOfficeHighlight } from '../components/virtual-office-highlight'
import { LocationsPreview } from '../components/locations-preview'
import { PricingPreview } from '../components/pricing-preview'
import { TestimonialsSection } from '../components/testimonials-section'
import { CTASection } from '../components/cta-section'
import { SEOContentSection } from '../components/seo-content-section'
import { FAQSection } from '../components/faq-section'
import { SEOHead } from '@/components/seo/seo-head'

export function HomePage() {
  return (
    <>
      <SEOHead
        title="Premium Co Working Space in Nepal | Kathmandu & Lalitpur"
        description="Co working space in kathmandu with hot desks available now. Private offices are fully booked. CreatrixSpace offers premium coworking spaces in Kathmandu (Dhobighat) and Lalitpur with 24/7 access, high-speed internet, meeting rooms, event spaces, and modern facilities. Membership from NPR 500/day, 1,999/week, 8,999/month. Virtual office package available for business address and mail handling."
        image={`${import.meta.env.VITE_APP_URL || 'https://creatrixventures.space'}/FleaMarket03-2026.jpg`}
        keywords="co working space, coworking space nepal, coworking space kathmandu, coworking space lalitpur, shared office space nepal, workspace kathmandu, workspace lalitpur, flexible workspace nepal, hot desk nepal, private office kathmandu, meeting room kathmandu, remote work nepal, coworking dhobighat, coworking kupondole, coworking jhamsikhel, event space nepal, virtual office nepal, business address kathmandu"
        structuredDataType="LocalBusiness"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'CreatrixSpace',
          description: 'Premium co working space in Nepal with locations in Kathmandu and Lalitpur',
          url: 'https://creatrixventures.space',
          telephone: '+977 9700045256',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kathmandu, Lalitpur',
            addressRegion: 'Bagmati',
            addressCountry: 'NP',
          },
          areaServed: [
            { '@type': 'City', name: 'Kathmandu', addressCountry: 'NP' },
            { '@type': 'City', name: 'Lalitpur', addressCountry: 'NP' }
          ],
          priceRange: '$$',
          openingHours: 'Mo-Su 00:00-23:59',
          image: 'https://creatrixventures.space/creatrix-logo.png',
        }}
      />
      <div className="overflow-hidden">
        <HeroSection />
        <SEOContentSection />
        <FeaturesSection />
        <VirtualOfficeHighlight />
        <LocationsPreview />
        <PricingPreview />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  )
}
