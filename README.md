# Hassan Akram — AI & Automation Engineer Portfolio

A modern, high-converting freelance developer portfolio website built with **Next.js 16 / App Router**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Supabase**.

Includes a complete public marketing & case study site paired with a private, authenticated **Admin Control Panel** for managing projects, testimonials, client inquiries, and live site copy without touching code.

---

## ✨ Features

### Public Portfolio Site
- **Hero Section:** Animated mesh background, dynamic availability badge, headline with gradient typography, and dual CTAs.
- **Interactive About Section:** Live stat counters (Projects built, Years exp, Tech stack, Client satisfaction) and tech marquee.
- **Core Services Grid:** 5 specialized service cards (AI Agent Development, n8n Workflow Automation, HubSpot CRM Integrations, Chatbots, and Full-Stack Apps).
- **Filterable Case Studies:** Category filter tabs (AI, Automation, CRM, Web App) with smooth AnimatePresence transitions.
- **Detailed Project Lightbox & Dedicated Case Study Pages:** Modal dialog preview and full standalone slug pages (`/projects/[slug]`) with image galleries, problem/solution breakdown, and tech stack badges.
- **Client Testimonials Carousel:** Smooth auto-advancing testimonials with company details and avatar previews.
- **Lead Generation Contact Form:** Validated with Zod and React Hook Form, directly saving inquiries to Supabase and sending email notifications via Resend.
- **Optional Calendly Embed:** Toggleable via environment variable (`NEXT_PUBLIC_CALENDLY_URL`).
- **Dark / Light Mode:** Seamless theme switching with persistent client preferences via `next-themes`.
- **SEO & Social Sharing:** Dynamic Open Graph metadata, Twitter cards, dynamic XML sitemap (`/sitemap.xml`), `robots.txt`, and JSON-LD structured data.

### Private Admin Panel (`/admin`)
- **Protected Authentication:** Secured via Supabase Auth and Next.js middleware.
- **Dashboard Overview (`/admin`):** Real-time statistics on total projects, featured highlights, review counts, and unread client inquiries.
- **Project Management (`/admin/projects`):** Search, category filtering, instant featured toggle, reordering, and deletion.
- **Project Editor (`/admin/projects/new` & `/admin/projects/[id]/edit`):** Drag-and-drop image uploader to Supabase Storage, slug auto-generator, dynamic tech stack tag builder, and full markdown-ready case study editor.
- **Testimonial Manager (`/admin/testimonials`):** Full CRUD modal for updating client reviews and ratings.
- **Inquiries Inbox (`/admin/messages`):** Filter by status (Unread, Read, Replied), review client budgets and project scopes, and one-click "Reply via Email" mailto launcher.
- **Live Site Settings (`/admin/settings`):** Change hero headline, availability status, bio text, and stat counters on the fly without redeploying.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI Primitives + Lucide Icons
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Animations:** Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **Email:** Resend API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (Node 20+ recommended)
- A free [Supabase](https://supabase.com) account

### 2. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CALENDLY_URL=   # optional
```

### 4. Supabase Database Setup
1. In your Supabase dashboard, go to the **SQL Editor**.
2. Run `supabase/migrations/001_initial_schema.sql` to create tables and RLS security policies.
3. Run `supabase/migrations/002_seed_data.sql` to populate initial projects, testimonials, and default site copy.
4. Follow `supabase/storage-setup.md` to create the `portfolio-media` storage bucket for project cover photos.

### 5. Create Admin Account
In the Supabase Dashboard:
1. Navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email and a secure password.
4. Now log into your portfolio at `/admin/login`.

### 6. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your portfolio, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the control panel.

---

## 📦 Production Build & Deployment

To verify that the build compiles cleanly:
```bash
npm run build
```

Deploy seamlessly to [Vercel](https://vercel.com):
1. Import the Git repository in Vercel.
2. Add the environment variables from your `.env.local`.
3. Hit **Deploy**.
