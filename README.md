# GJS 20th Year Celebration Invitation

A stunning Apple-style event invitation micro-site built with Next.js, React, Framer Motion, and GSAP for GJS Property's 20th year celebration.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion for component animations, GSAP for scroll effects
- **Apple-Style Design**: Clean, modern UI with glass morphism effects
- **Responsive**: Fully responsive design that works on all devices
- **Form Validation**: React Hook Form with Zod validation
- **Calendar Integration**: One-click calendar event creation for Google, Outlook, and Apple Calendar
- **RSVP System**: Complete RSVP form with success states
- **Performance Optimized**: Fast loading with Next.js optimizations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion + GSAP
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🎨 Design Features

- Apple-inspired design language
- Glass morphism effects
- Smooth scroll animations
- Floating elements
- Gradient text effects
- Custom CSS animations
- Responsive typography

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gjs-20
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run deploy` - Deploy to Vercel production
- `npm run preview` - Preview Vercel deployment

## 🚀 Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
npm run deploy
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/gjs-20)

## 📋 Event Details

- **Date**: Thursday, 30th October 2024
- **Time**: 5:30 PM - 8:00 PM
- **Location**: Level 10, Shell House, 37 Margaret Street, Sydney
- **Access**: Via Wynyard Lane
- **RSVP Deadline**: Tuesday, 22nd October 2024

## 🎯 Features Overview

### Hero Section
- Animated title with gradient text
- Floating celebration elements
- Smooth scroll indicator
- Call-to-action button

### Event Details
- Clean card layout with icons
- Responsive grid system
- Hover animations
- Additional event information

### RSVP Form
- Complete form validation
- Real-time error handling
- Success state animation
- Guest count selection
- Dietary requirements field

### Calendar Integration
- One-click calendar event creation
- Support for Google, Outlook, and Apple Calendar
- Event summary card
- Contact information

### Footer
- Animated elements
- Contact details
- Professional branding

## 🎨 Customization

### Colors
The design uses a custom color palette defined in `globals.css`:
- Primary: #007AFF (Apple Blue)
- Secondary: #5856D6 (Purple)
- Accent: #FF3B30 (Red)

### Typography
- Primary font: SF Pro Display (Apple's system font)
- Fallback: Inter (Google Fonts)

### Animations
- Framer Motion for component animations
- GSAP for scroll-triggered animations
- CSS animations for micro-interactions

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for any environment-specific variables:

```env
NEXT_PUBLIC_SITE_URL=https://gjs-20.vercel.app
```

### RSVP API
To enable actual RSVP functionality, you'll need to:
1. Create an API endpoint at `/api/rsvp`
2. Set up a database to store RSVP data
3. Configure email sending service

## 📄 License

This project is created for GJS Property's 20th year celebration.

## 🤝 Contributing

This is a private project for GJS Property. For any issues or suggestions, please contact the development team.

---

Built with ❤️ for GJS Property's 20th Year Celebration