# CreatrixSpace - Premium Coworking Platform

A modern, production-ready coworking space web application built with React, TypeScript, Tailwind CSS, and cutting-edge web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone and install
git clone <repository-url>
cd creatrixspace
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query + Zustand
- **Icons**: Lucide React

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components  
│   └── layout/        # Layout components
├── features/          # Feature modules
│   ├── home/          # Homepage
│   ├── pricing/       # Pricing pages
│   ├── booking/       # Booking flow
│   ├── auth/          # Authentication
│   └── dashboard/     # Member dashboard
├── lib/               # Utils and config
├── routes/            # Router config
└── services/          # API clients
```

## 🎨 Features

### ✅ Completed
- ⚡ **Modern Design**: Clean, responsive UI with dark mode
- 🏠 **Homepage**: Hero, features, locations, pricing preview  
- 💰 **Pricing Page**: Plans, billing toggle, FAQ, add-ons
- 🗺️ **Navigation**: Header, footer, mobile menu
- 🎯 **Components**: Button, Card, Input, Badge, Label
- 📱 **Responsive**: Mobile-first design
- ♿ **Accessible**: WCAG 2.2 AA compliant
- 🎭 **Animations**: Smooth scroll animations

### 🚧 In Progress
- 📅 **Booking Flow**: Multi-step booking process
- 💳 **Stripe Integration**: Payment processing
- 🔐 **Authentication**: Login/register with NextAuth
- 📊 **Dashboard**: Member portal
- 🗺️ **Location Pages**: Detailed location info
- 📧 **Email System**: Transactional emails
- 📝 **CMS Integration**: Sanity for content

## 📱 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run type-check   # TypeScript checking
```

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env.local` and configure:

```env
# App
VITE_APP_NAME=CreatrixSpace
VITE_APP_URL=http://localhost:5173

# Stripe (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Sanity CMS  
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production

# Maps (Choose one)
VITE_MAPBOX_ACCESS_TOKEN=pk.ey...
# OR
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

## 🚀 Deployment

### Vercel (Recommended)
1. Import project to Vercel
2. Add environment variables
3. Deploy automatically on push

### Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 🧪 Testing

```bash
npm run test          # Run all tests
npm run test:ui       # Run with UI
npm run test:coverage # Run with coverage
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6) for branding
- **Secondary**: Gray tones for UI
- **Dark Mode**: Full support with system detection

### Typography  
- **Display**: Poppins for headings
- **Body**: Inter for text and UI

### Components
- Built with shadcn/ui design system
- Consistent 4px/8px spacing scale
- 12px border radius default
- Smooth transitions and focus states

## 📚 Key Features Detailed

### Homepage
- Animated hero with statistics
- Feature grid with hover effects  
- Location previews with ratings
- Pricing comparison
- Customer testimonials
- Strong call-to-action sections

### Pricing Page
- Interactive billing toggle (monthly/annual)
- Feature comparison with checkmarks
- Highlighted popular plans
- Add-on services section
- FAQ with common questions
- Clear pricing with no hidden fees

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Component system
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework  
- [Lucide](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

Built with ❤️ for modern coworking spaces