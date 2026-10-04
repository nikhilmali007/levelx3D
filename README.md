# 💎 Level X 3D — E-Commerce Web App

> Next-Gen 3D E-Commerce Platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Three.js**, **Framer Motion**, **Lenis Smooth Scroll**, and **Supabase**.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-JS%20Client-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## ⚡ Features

- **Next.js 14 App Router Architecture**: Clean scalable structure (`src/app`, `src/components`, `src/lib`, `src/types`, `src/hooks`).
- **Real-Time Interactive 3D Canvas**: Three.js WebGL hero visualizer with kinetic geometry, orbit physics, particle nebula, and wireframe switcher.
- **3D Product Inspection Modal**: 360-degree interactive viewer with real-time material swapping (Cyan, Pink, Purple, Emerald) and 3D manufacturing specifications.
- **Lenis Smooth Momentum Scrolling**: High-refresh luxury smooth scroll physics.
- **Framer Motion Micro-Interactions**: Spring animations, slide-in cart drawer, and interactive hover feedback.
- **shadcn/ui Design Tokens**: Dark cyberpunk aesthetic with glassmorphic cards, glow badges, and accessible buttons.
- **Full E-Commerce State Management**: Persistent cart with quantity controls, subtotal calculation, free worldwide express shipping tier progress bar, and animated checkout.
- **Supabase JS Client Integration**: Pre-configured in `src/lib/supabase/client.ts` reading `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.local`.

---

## 🚀 Quick Start

### 1. Configure Supabase Environment Variables
Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Scalable Folder Structure

```
src/
├── app/
│   ├── layout.tsx             # Root layout with SmoothScroll (Lenis), Navbar, CartDrawer, Footer
│   ├── page.tsx               # Home Page (3D Hero, Features, Product Grid, 3D Studio, Specs)
│   └── globals.css            # Tailwind directives, design tokens, Lenis styles
├── components/
│   ├── 3d/
│   │   ├── hero-canvas.tsx           # Interactive Three.js kinetic 3D scene
│   │   └── product-viewer-modal.tsx  # 360° 3D product inspector modal
│   ├── ecommerce/
│   │   ├── product-card.tsx          # Card with quick 3D inspect and add-to-cart
│   │   ├── product-grid.tsx          # Filterable catalog with search
│   │   ├── cart-drawer.tsx           # Slide-over cart with checkout flow
│   │   └── features-bar.tsx          # Value proposition bar
│   ├── layout/
│   │   ├── navbar.tsx                # Glassmorphic header with Supabase status pill
│   │   ├── footer.tsx                # Brand footer with newsletter
│   │   └── smooth-scroll.tsx         # Lenis smooth scroll provider
│   └── ui/
│       ├── button.tsx                # shadcn/ui button variants
│       ├── badge.tsx                 # Neon and gradient badges
│       ├── card.tsx                  # Glassmorphic cards
│       └── input.tsx                 # Sleek input components
├── hooks/
│   └── use-cart.ts            # Persistent cart state hook
├── lib/
│   ├── supabase/
│   │   └── client.ts          # Supabase client reading env vars with fallback
│   ├── products-data.ts       # Initial catalog artifacts
│   └── utils.ts               # cn helper and currency formatter
└── types/
    └── product.ts             # Product and Cart TypeScript definitions
```

---

## 👤 Author & Repository

- **GitHub Repository**: [https://github.com/nikhilmali007/levelx3D](https://github.com/nikhilmali007/levelx3D)
- **Author**: [@nikhilmali007](https://github.com/nikhilmali007)
