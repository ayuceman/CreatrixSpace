import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/components/layout/root-layout'
import { HomePage } from '@/features/home/pages/home-page'
import { LocationsPage } from '@/features/locations/pages/locations-page'
import { LocationDetailPage } from '@/features/locations/pages/location-detail-page'
import { PricingPage } from '@/features/pricing/pages/pricing-page'
import { BookingPage } from '@/features/booking/pages/booking-page'
import { PaymentPage } from '@/features/payment/pages/payment-page'
import { MembershipPage } from '@/features/memberships/pages/membership-page'
import { BlogPage } from '@/features/blog/pages/blog-page'
import { BlogPostPage } from '@/features/blog/pages/blog-post-page'
import { AboutPage } from '@/features/about/pages/about-page'
import { CareersPage } from '@/features/careers/pages/careers-page'
import { ContactPage } from '@/features/contact/pages/contact-page'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { ResetPasswordPage } from '@/features/auth/pages/reset-password-page'
import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout'
import { DashboardOverviewPage } from '@/features/dashboard/pages/dashboard-overview-page'
import { DashboardBookingsPage } from '@/features/dashboard/pages/dashboard-bookings-page'
import { DashboardProfilePage } from '@/features/dashboard/pages/dashboard-profile-page'
import { DashboardBillingPage } from '@/features/dashboard/pages/dashboard-billing-page'
import { TermsPage } from '@/features/legal/pages/terms-page'
import { PrivacyPage } from '@/features/legal/pages/privacy-page'
import { NotFoundPage } from '@/features/error/pages/not-found-page'
import { ROUTES } from '@/lib/constants'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.LOCATIONS,
        element: <LocationsPage />,
      },
      {
        path: ROUTES.LOCATION_DETAIL,
        element: <LocationDetailPage />,
      },
      {
        path: ROUTES.PRICING,
        element: <PricingPage />,
      },
      {
        path: ROUTES.BOOKING,
        element: <BookingPage />,
      },
      {
        path: '/payment',
        element: <PaymentPage />,
      },
      {
        path: '/payment/esewa/success',
        element: <PaymentPage />,
      },
      {
        path: '/payment/esewa/failure',
        element: <PaymentPage />,
      },
      {
        path: ROUTES.MEMBERSHIP,
        element: <MembershipPage />,
      },
      {
        path: ROUTES.BLOG,
        element: <BlogPage />,
      },
      {
        path: ROUTES.BLOG_POST,
        element: <BlogPostPage />,
      },
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />,
      },
      {
        path: ROUTES.CAREERS,
        element: <CareersPage />,
      },
      {
        path: ROUTES.CONTACT,
        element: <ContactPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPasswordPage />,
      },
      {
        path: ROUTES.TERMS,
        element: <TermsPage />,
      },
      {
        path: ROUTES.PRIVACY,
        element: <PrivacyPage />,
      },
    ],
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardOverviewPage />,
      },
      {
        path: ROUTES.DASHBOARD_BOOKINGS,
        element: <DashboardBookingsPage />,
      },
      {
        path: ROUTES.DASHBOARD_PROFILE,
        element: <DashboardProfilePage />,
      },
      {
        path: ROUTES.DASHBOARD_BILLING,
        element: <DashboardBillingPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
