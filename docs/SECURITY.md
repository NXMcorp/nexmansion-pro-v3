# Security notes

## Authentication
- Passwords hashed with bcrypt (cost factor 10).
- Sessions via NextAuth JWT with HTTP-only cookies.
- Role-based access control in `src/server/auth/session.ts` (`requireUser`, `requireRole`).

## Authorization (RLS)
The application enforces these access rules at the query layer (mappable to SQL RLS):
- **Traveller**: read/edit own profile; read own bookings/payments; manage own favourites; review only after completed stays; read conversations they belong to.
- **Host**: read/manage only their properties; see bookings for own properties; manage own property availability; access traveller details only tied to valid bookings on their properties.
- **Admin/Support**: elevated operational access, always logged to `audit_logs`.
- **Public**: only `PUBLISHED`/`VERIFIED` properties; approved reviews; public collection info.
- **KYC / verification documents**: private table, never exposed in public routes.

## Payments
- Stripe Checkout used server-side; no PAN/CVV stored.
- Webhook signature verification structure in place.
- Idempotent booking creation (transactional).

## Input safety
- All API routes validate with Zod schemas.
- React's text rendering escapes HTML content.
- File upload validation (for dispute evidence etc.) is stubbed for V1 — integrate with signed storage URLs before production.

## Headers / transport
- The app should be served over HTTPS in production.
- Next.js defaults provide basic XSS/clickjacking protection; in production add a strict Content-Security-Policy and HSTS via a reverse proxy or `next.config.js` headers.

## Privacy / GDPR
- Minimal data collection (only what is required to complete a booking).
- Profile page includes data export / deletion UI (stubbed for V1; wire to jobs before launch).
- Cookie preference management is scaffolded.
- Privacy, Terms and Cookies pages exist with clear "pending legal review" notes where needed.

## Secrets
- All secrets via environment variables; never committed.
- Client bundles receive only `NEXT_PUBLIC_*` variables.
- Stripe webhook secret, NEXTAUTH_SECRET and DB credentials must be set in production.
