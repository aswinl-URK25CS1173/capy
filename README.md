# 🏟️ GreenField Sports Arena — Turf Booking Platform

> A premium, full-stack Cricket & Football turf booking web application.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Supabase (Auth + DB + RLS) |
| Payments | Stripe (Checkout + Webhooks) |
| Charts | Recharts |
| Notifications | React Hot Toast |

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Only for webhook handler

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Open **SQL Editor** → **New Query**
4. Paste and run `supabase/schema.sql`
5. Paste and run `supabase/seed.sql` (optional demo data)

### 4. Set up Stripe

1. Create a [Stripe account](https://stripe.com) (test mode)
2. Get your publishable + secret keys from Dashboard → Developers → API Keys
3. Set up webhook:
   - Go to Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
   - Copy the webhook signing secret

For local development use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Configure Supabase Auth (Google OAuth)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Google**
3. Add your Google OAuth credentials
4. Add redirect URL: `http://localhost:3000/auth/callback`

### 6. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
turf-booking/
├── app/
│   ├── page.tsx              # Landing page
│   ├── booking/
│   │   └── page.tsx          # Booking flow (date + slots + payment)
│   ├── dashboard/
│   │   └── page.tsx          # User bookings dashboard
│   ├── admin/
│   │   └── page.tsx          # Admin panel (charts, bookings, settings)
│   └── api/
│       ├── stripe/
│       │   ├── checkout/     # Create Stripe checkout session
│       │   └── webhook/      # Handle Stripe payment events
│       ├── bookings/         # CRUD bookings
│       └── slots/            # Get slot availability
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   └── server.ts         # Server client (cookies)
│   ├── utils.ts
│   └── demo-data.ts          # Demo/seed data
├── types/
│   └── index.ts              # Full TypeScript types
└── supabase/
    ├── schema.sql            # Full DB schema + RLS policies
    └── seed.sql              # Demo data
```

---

## 🔐 Security Model

| Role | Access |
|------|--------|
| **Anonymous** | View turf info, check slot availability |
| **User** | Book slots, view own bookings, cancel own bookings |
| **Admin** | Full access to all bookings, manage slots, view analytics |

All access is enforced via **Supabase Row Level Security** at the database level.

---

## 💳 Payment Flow

```
User selects slot
    ↓
POST /api/stripe/checkout
    → Creates pending booking in DB
    → Creates Stripe Checkout Session
    ↓
User redirected to Stripe hosted checkout
    ↓
On success: Stripe webhook fires
    → POST /api/stripe/webhook
    → Updates booking status to 'confirmed'
    ↓
User redirected to /booking/success
```

Double-booking is prevented by:
1. Partial unique index in Postgres (only one confirmed/pending per slot)
2. Slot availability check before creating Stripe session
3. Pessimistic locking during checkout

---

## 🎨 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, sports, features, testimonials |
| `/booking` | Full booking flow with calendar + slot grid |
| `/dashboard` | User's upcoming & past bookings |
| `/admin` | Admin panel: overview, bookings table, slot manager, settings |

---

## 🛠️ Admin Features

- **Revenue Charts** – Weekly/monthly area & bar charts
- **Sport Split** – Pie chart showing cricket vs football demand  
- **Today's Schedule** – Live view of today's bookings
- **Booking Table** – Full booking management with filters
- **Slot Manager** – Click to block/unblock individual slots
- **Settings** – Opening hours, slot duration, pricing, Stripe status

---

## 🌱 Demo Data

The app ships with realistic demo data including:
- 847 total historical bookings
- ₹6.78L total revenue (simulated)
- 5 demo user profiles
- 15 demo bookings (past + today + future)

All demo data is clearly labeled in the UI.

---

## 📦 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel deploy
```

Add all env vars to Vercel project settings.

Update Stripe webhook URL to your production domain.

---

## 🤝 Going Live Checklist

- [ ] Switch Stripe from test to live mode
- [ ] Set up Google OAuth with production URLs  
- [ ] Configure Supabase production project
- [ ] Set up Stripe webhook with production URL
- [ ] Enable Supabase email confirmations
- [ ] Configure custom domain
- [ ] Add real turf photos
- [ ] Update pricing in Supabase admin
