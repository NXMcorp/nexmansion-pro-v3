# NexMansion Architecture

## Overview

NexMansion is a Next.js 14 App Router application with:

- **Server Components** for data-driven pages (home, collection, villa detail, dashboards) for performance and security.
- **Client Components** for interactivity (booking panel, filters, auth forms, gallery lightbox).
- **Route handlers** (`app/api/*`) for all mutations — booking creation, payments, favorites, concierge, contact.
- **Server-side domain services** (`src/server/*`) centralising auth, db, pricing, payments, email.
- **Pure library layer** (`src/lib/*`) for money, dates, i18n, utilities — tested and framework-agnostic.

## Layers

```
UI (app/ + components/)
        │
        ▼
   Server Actions / Route Handlers
        │
        ▼
   Domain Services (auth, payments, pricing, availability)
        │
        ▼
   Database layer (src/server/db)  ──►  SQLite (dev) / Postgres (prod adapter)
```

## Booking flow

1. Guest selects dates on villa page. Booking panel calls `/api/bookings/quote` which validates availability, computes authoritative price, returns breakdown.
2. Guest clicks "Reserve" → `/api/bookings` creates the booking in a transaction:
   - Re-reads availability inside a write transaction (prevents double-booking).
   - Inserts booking with initial state (`AWAITING_HOST` for request-book, `AWAITING_PAYMENT` for instant-book).
   - Creates a hold availability block.
   - Writes audit log entry.
3. Guest is redirected to `/book/[slug]/confirm` where they add concierge services and accept terms.
4. `/api/bookings/[id]/pay` either creates a Stripe Checkout session (when `STRIPE_SECRET_KEY` is set) or confirms in demo mode.
5. On success, booking transitions to `CONFIRMED` and the hold block becomes a `booking` block.

## State machine — bookings

See `BookingStatus` in `src/lib/types.ts`. Enforced transitions:

```
DRAFT → AWAITING_HOST | AWAITING_PAYMENT
AWAITING_HOST → APPROVED | DECLINED | EXPIRED
APPROVED → AWAITING_PAYMENT
AWAITING_PAYMENT → PAYMENT_PROCESSING → CONFIRMED | FAILED
CONFIRMED → CHECKED_IN → COMPLETED
CONFIRMED → CANCELLATION_REQUESTED → CANCELLED | REFUNDED
ANY → DISPUTED
```

Every transition is recorded in `booking_status_history` with actor.

## Payments

Provider abstraction in `src/server/payments` allows adding crypto or regional providers without modifying booking logic. Stripe is implemented server-side; no card data touches NexMansion servers. When Stripe is not configured, bookings flow through a demo mode suitable for previews.

## Extending to Postgres / Supabase

The schema and queries in `src/server/db/index.ts` use standard SQL. To move to Postgres:

1. Replace the `better-sqlite3` instance with a `pg` Pool.
2. Promisify queries (or use a sync-compatible client if desired).
3. Translate the `initSchema()` DDL into a Prisma/migration file.
4. Add Row-Level Security policies (predicates already exist per user/host in queries).

The data model matches the spec exactly (countries → destinations → collections → properties, with bookings, payments, services, reviews, conversations, concierge, support, disputes, audit logs).
