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
import { CTAClose } from '../components/cta-close'
import { useBookTour } from '@/lib/book-tour-context'

export function HomePage() {
  const { openTour } = useBookTour()

  return (
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
  )
}
