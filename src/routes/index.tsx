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
import { MeetingPage } from '@/features/meeting/pages/meeting-page'
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
import { AdminLoginPage } from '@/features/admin/pages/admin-login-page'
import { AdminProtectedRoute } from '@/features/admin/components/protected-route'
import { AdminLayout } from '@/features/admin/components/admin-layout'
import { AdminDashboardPage } from '@/features/admin/pages/admin-dashboard-page'
import { AdminBookingsPage } from '@/features/admin/pages/admin-bookings-page'
import { AdminPricingPage } from '@/features/admin/pages/admin-pricing-page'
import { AdminLocationsPage } from '@/features/admin/pages/admin-locations-page'
import { AdminSiteStatsPage } from '@/features/admin/pages/admin-site-stats-page'
import { AdminHeroPage } from '@/features/admin/pages/admin-hero-page'
import { AdminMembershipPage } from '@/features/admin/pages/admin-membership-page'
import { AdminSpacesPage } from '@/features/admin/pages/admin-spaces-page'
import { AdminAmenitiesPage } from '@/features/admin/pages/admin-amenities-page'
import { AdminBookTourPage } from '@/features/admin/pages/admin-book-tour-page'
import { AdminTestimonialsPage } from '@/features/admin/pages/admin-testimonials-page'
import { AdminFaqPage } from '@/features/admin/pages/admin-faq-page'
import { AdminMemberCompaniesPage } from '@/features/admin/pages/admin-member-companies-page'
import { AdminFormSubmissionsPage } from '@/features/admin/pages/admin-form-submissions-page'
import { AdminPlansPage } from '@/features/admin/pages/admin-plans-page'
import { AdminAddonsPage } from '@/features/admin/pages/admin-addons-page'
import { AdminOrdersPage } from '@/features/admin/pages/admin-orders-page'

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
        path: '/locations/:id',
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
        path: ROUTES.MEETING,
        element: <MeetingPage />,
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
    path: ROUTES.ADMIN_LOGIN,
    element: <AdminLoginPage />,
  },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: ROUTES.ADMIN_BOOKINGS, element: <AdminBookingsPage /> },
          { path: ROUTES.ADMIN_PRICING, element: <AdminPricingPage /> },
          { path: ROUTES.ADMIN_LOCATIONS, element: <AdminLocationsPage /> },
          { path: ROUTES.ADMIN_SITE_STATS, element: <AdminSiteStatsPage /> },
          { path: ROUTES.ADMIN_HERO, element: <AdminHeroPage /> },
          { path: ROUTES.ADMIN_MEMBERSHIP, element: <AdminMembershipPage /> },
          { path: ROUTES.ADMIN_SPACES, element: <AdminSpacesPage /> },
          { path: ROUTES.ADMIN_AMENITIES, element: <AdminAmenitiesPage /> },
          { path: ROUTES.ADMIN_BOOK_TOUR, element: <AdminBookTourPage /> },
          {
            path: ROUTES.ADMIN_TESTIMONIALS,
            element: <AdminTestimonialsPage />,
          },
          { path: ROUTES.ADMIN_FAQ, element: <AdminFaqPage /> },
          {
            path: ROUTES.ADMIN_MEMBER_COMPANIES,
            element: <AdminMemberCompaniesPage />,
          },
          {
            path: ROUTES.ADMIN_FORM_SUBMISSIONS,
            element: <AdminFormSubmissionsPage />,
          },
          { path: ROUTES.ADMIN_PLANS, element: <AdminPlansPage /> },
          { path: ROUTES.ADMIN_ADDONS, element: <AdminAddonsPage /> },
          { path: ROUTES.ADMIN_ORDERS, element: <AdminOrdersPage /> },
        ],
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
