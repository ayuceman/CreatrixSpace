import { HeroSection } from '../components/hero-section'
import { FeaturesSection } from '../components/features-section'
import { LocationsPreview } from '../components/locations-preview'
import { PricingPreview } from '../components/pricing-preview'
import { TestimonialsSection } from '../components/testimonials-section'
import { CTASection } from '../components/cta-section'

export function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <LocationsPreview />
      <PricingPreview />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
