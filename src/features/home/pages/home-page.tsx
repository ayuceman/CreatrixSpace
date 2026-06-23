import { HeroSection } from '../components/hero-section'
import { AboutSection } from '../components/about-section'
import { LocationsSection } from '../components/locations-section'
import { MembershipSection } from '../components/membership-section'
import { SpacesSection } from '../components/spaces-section'
import { AmenitiesSection } from '../components/amenities-section'
import { CommunitySection } from '../components/community-section'
import { FAQSection } from '../components/faq-section'
import { ConciergeSection } from '../components/concierge-section'
import { CTASection } from '../components/cta-section'
import { useBookTour } from '@/lib/book-tour-context'
import { SEOHead } from '@/components/seo/seo-head'

export function HomePage() {
  const { openTour } = useBookTour()

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
          description:
            'Premium co working space in Nepal with locations in Kathmandu and Lalitpur',
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
            { '@type': 'City', name: 'Lalitpur', addressCountry: 'NP' },
          ],
          priceRange: '$$',
          openingHours: 'Mo-Su 00:00-23:59',
          image: 'https://creatrixventures.space/creatrix-logo.png',
        }}
      />
      <div>
        <HeroSection onBookTour={() => openTour()} />
        <AboutSection />
        <LocationsSection onBookTour={(loc) => openTour({ location: loc })} />
        <MembershipSection />
        <SpacesSection />
        <AmenitiesSection />
        <CommunitySection />
        <FAQSection />
        <ConciergeSection />
        <CTASection />
      </div>
    </>
  )
}
