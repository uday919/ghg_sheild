# 🛡️ GHG Shield

**Full-service GHG compliance platform for California SB 253**

A productized SaaS platform built for ISO 14064 certified consultants managing GHG reporting for US mid-size companies.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| Auth | Clerk (Managed Auth) |
| Backend/DB | Supabase (PostgreSQL + RLS) |
| Storage | Supabase Storage Buckets |
| Payments | DodPayments |
| AI | Anthropic Claude API (claude-3-5-sonnet) |
| PDF | React-PDF (@react-pdf/renderer) |
| Email | Resend |
| State | Zustand |
| Charts | Recharts |
| Forms | React Hook Form + Zod |

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
RESEND_API_KEY=...
NEXT_PUBLIC_DODPAYMENTS_KEY=...
DODPAYMENTS_WEBHOOK_SECRET=...
```

### 3. Database & Storage Setup
1. Create a [Supabase](https://supabase.com) project.
2. Run the migration script to setup tables and storage:
   ```bash
   npx tsx scripts/setup-supabase.ts
   ```
3. Set up [Clerk](https://clerk.com) and configure the Dashboard Redirect URLs.

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
app/
├── (public)/        → Landing page, pricing
├── (auth)/          → Managed Auth flows (Clerk)
├── (client)/        → Client portal (dashboard, reports, documents, action items)
├── (admin)/         → Admin panel (client management, data entry, reports, docs, messaging)
└── api/             → API routes (AI, PDF, webhooks, email, seed)
components/
├── ui/              → Base components (Tailwind 4)
├── charts/          → Recharts components
├── admin/           → Admin-specific components (Messenger, etc.)
├── client/          → Client-specific components
└── pdf/             → React-PDF template
lib/                 → Core libraries (Supabase, calculations, Claude, email, payments)
hooks/               → React hooks (useClient, useEmissions)
store/               → Zustand stores
types/               → TypeScript types
```

## License
Proprietary — All rights reserved.
