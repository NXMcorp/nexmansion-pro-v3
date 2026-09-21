# NexMansion

> Exceptional homes. Curated stays.

NexMansion is a curated luxury-villa marketplace. This repository is the V1 application: a full-stack Next.js product for the Bali launch with ten handpicked villas, booking flow, traveller/host/admin dashboards, payment structure, concierge workflow, verification and trust tooling.

The platform is designed so additional destinations (Dubai, French Riviera, Mykonos, Maldives, Saint-Barth…) can be added without code changes once inventory is curated.

---

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 App Router, React, TypeScript, Tailwind CSS |
| Auth | NextAuth (credentials), JWT sessions, bcrypt |
| Database | SQLite (local dev), Postgres-ready adapter layer; schema in `src/server/db/index.ts` |
| Payments | Stripe (optional, server-side), demo-mode confirmation when no Stripe key is present |
| Validation | Zod |
| Email | Console adapter in dev; provider abstraction in `src/server/email` |
| Testing | Vitest for domain logic |

> The V1 seed uses SQLite with `better-sqlite3` for a zero-setup local experience. To move to production Postgres/Supabase, replace the `src/server/db` module with a thin pg adapter pointing to the same schema.

---

## Quick start

```bash
npm install
cp .env.example .env      # then edit if needed
npm run db:seed           # creates tables + seeds 10 Bali villas + demo accounts
npm run dev               # http://localhost:3000
```

### Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Traveller | `traveller@nexmansion.com` | `nexmansion123` |
| Host | `host@nexmansion.com` | `nexmansion123` |
| Admin | `admin@nexmansion.com` | `nexmansion123` |

### Useful scripts

```bash
npm run dev          # start dev server on :3000
npm run build        # production build
npm run start        # run production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm test             # unit tests (vitest)
npm run db:seed      # re-seed DB
npm run db:reset     # delete DB + re-seed
```

---

## Environment variables

See `.env.example`. The most important:

| Variable | Purpose |
| --- | --- |
| `DATABASE_PATH` | SQLite file location (default `prisma/dev.db`). For Postgres, swap `src/server/db` for a pg adapter. |
| `NEXTAUTH_SECRET` | Secret for JWT signing. **Set in production.** |
| `NEXTAUTH_URL` | Public URL of the site. |
| `STRIPE_SECRET_KEY` | Optional. When set, real Stripe Checkout is used; otherwise bookings complete in demo mode. |
| `STRIPE_WEBHOOK_SECRET` | Optional. For Stripe webhook signature verification. |
| `NEXT_PUBLIC_BASE_URL` | Public origin (used for absolute URLs, sitemap, SEO). |

---

## Architecture

```
src/
  app/                 Next.js App Router routes
    (public)/          Editorial public pages (home, collections, villas, concierge, legal)
    (auth)/            Login, signup, password flows
    account/           Traveller dashboard (server pages + client components)
    host/              Host dashboard
    admin/             Admin / operations dashboard
    api/               Route handlers for auth, bookings, payments, favorites, concierge...
  components/          Reusable UI (ui/, layout/, property/, booking/, account/, admin/, home/, forms/)
  lib/                 Pure domain logic (money, utils, types, i18n)
  server/              Server-only modules:
    db/                SQLite/DB access + schema initialisation + domain queries
    auth/              NextAuth config + session helpers + role guards
    payments/          Provider abstraction (Stripe adapter ready)
    email/             Development email adapter (logs to console)
  types/               Shared TypeScript types
prisma/dev.db          Local SQLite database (gitignored)
scripts/seed.ts        Seed script
docs/                  Architecture notes

```

### Security model

- All money calculations are server-side (integer minor units only — no floats).
- Auth & role guards live in `src/server/auth/session.ts` (`requireUser`, `requireRole`).
- Sensitive documents (host KYC, verification) stay in private tables and are never exposed on public routes.
- Payment secrets are read server-side only; no keys ship to the browser.
- Input validation with Zod on all public API routes.
- Webhook signature verification structure is in place for Stripe.
- Audit log records security-sensitive actions (booking, approvals, payments).

### RLS / Authorization note

Because the local-dev database is SQLite (which has no row-level security), permission checks are enforced in application-layer query helpers and route guards. The `Host` and `Traveller` dashboards scope all queries to the authenticated user's ID. When porting to Postgres/Supabase, the same predicates map directly to SQL RLS policies.

---

## Feature flags

Future features are disabled via `feature_flags` table and default OFF:

- `crypto-payments`
- `nexcoin` (loyalty)
- `ai-concierge`
- `ar-vr`

No crypto/AI/AR UI is shown unless a flag is enabled and real credentials are configured.

---

## Demo content

The seed script inserts exactly **10 fictional luxury villas across Bali** (Uluwatu, Ubud, Canggu, Seminyak, Nusa Dua). All property names, descriptions and hosts are fictional. Photography uses Unsplash editorial imagery; in production these should be replaced with commissioned photography.

Coming-soon collections (Dubai, French Riviera, Mykonos, Maldives, Saint-Barth) exist in the data model but are explicitly marked "Coming soon" — no fake inventory is shown.

---

## Acceptance criteria (summary)

- **Public site**: homepage, Bali Collection, 10 seeded villas, property pages, filters, search, wishlist, concierge form, legal pages, SEO, sitemap, robots.txt.
- **Auth**: signup, login, logout, password recovery UI, role-based protected routes (traveller/host/admin).
- **Booking**: server-calculated prices, date selection, guest constraints, availability check, double-booking prevention via transactions, services add-ons, terms acceptance, Stripe-ready payment flow, demo-mode confirmation, booking in dashboard.
- **Host**: own-properties-only access, property management stub, availability, bookings, revenue, verification status.
- **Admin**: operational dashboard, property/host/user/booking views, concierge queue, disputes, settings, audit log.
- **Quality**: TypeScript passes, production build passes, unit tests pass for pricing.
- **Documentation**: README, architecture docs, `.env.example`, seed, deployment notes.

---

## Deployment

1. Provide a Postgres database and point `src/server/db/index.ts` to it (or use a pg adapter with the same schema — see `docs/DATABASE.md`).
2. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_BASE_URL`.
3. Add Stripe keys (optional for demo operation).
4. Configure transactional email provider.
5. `npm run build && npm start`.

---

## Roadmap

See `docs/ROADMAP.md`.

- **Phase 1 — Bali MVP** (current): 10 villas, luxury site, booking, secure payment, dashboards, verification, concierge, reviews, support.
- **Phase 2 — Bali growth**: 25–50 properties, iCal sync, automated onboarding, stronger analytics, referrals, loyalty.
- **Phase 3 — International collections**: Dubai, French Riviera, Mykonos, Maldives, Saint-Barth.
- **Phase 4 — Advanced NexMansion**: crypto payments (flagged), NexCoin loyalty, AR/VR, AI concierge, dynamic pricing, native apps.
