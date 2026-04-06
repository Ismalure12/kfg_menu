# KFG Restaurant Menu App

## Stack
Next.js 14 (App Router) · JavaScript (JSX, no TypeScript) · Inline styles (no Tailwind) · Neon Postgres · Prisma ORM · Vercel

## What This Is
Digital menu for KFG restaurant. Customers scan QR → see menu items by category → tell waiter their choice. Admins manage categories, items, sub-items, and social links via a protected dashboard.

There is an anonymous cart — no user accounts, no checkout, no payments. The cart is stored in `localStorage` (UUID key `kfg_cart_id`) and persisted to the `cart_items` DB table. It's for the customer to build their order and show it to the waiter.

## Database Schema (Prisma)
- `AdminUser` — admin accounts with JWT auth
- `Category` — menu categories (e.g. Chicken, Pizza, Burgers)
- `MenuItem` — items inside categories; has optional `imageUrl`
- `SubItem` — size/variant options per item (e.g. Small/Medium/Large); cascade-deletes with parent item
- `CartItem` — anonymous cart rows keyed by `cartId` UUID
- `SocialLink` — platform + value pairs managed from admin

## Key Architecture
- Public menu: `src/app/page.jsx` (server component, Prisma query) → `src/components/public/MenuPreview.jsx` (client component)
- `MenuPreview` maps categories to layout types: `grid` (items with sub-items), `list` (single-price items), `sauce` (sauces/condiments)
- Admin dashboard: `src/app/admin/dashboard/` — protected by `middleware.js` checking JWT cookie
- API routes: `src/app/api/` — all use Prisma, validated with Zod

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing

### 2. Verification Before Done
- Never mark a task complete without proving it works
- Run `npx next lint` after every change
- Ask: "Would a staff engineer approve this?"

### 3. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.

## Core Principles
- **Simplicity First**: Minimal code impact. Don't over-engineer.
- **No Laziness**: Find root causes. No temporary fixes.
- **Mobile-First**: Most users arrive via QR code on a phone.

## Key Rules
- Use **Prisma** for all DB queries — never raw SQL, never `$queryRaw`
- Validate inputs server-side with **Zod**
- JWT auth in httpOnly cookie, protected via `middleware.js`
- Use `next/image` for all images
- Public menu components use **inline styles** (not Tailwind classes)
- Admin dashboard uses Tailwind utility classes
- iOS mobile: any `<input>` must have `font-size ≥ 16px` or iOS Safari will zoom in
- Clicking a category tab must call `window.scrollTo({ top: 0, behavior: 'smooth' })`

## Running the Seed Script
```bash
source <(grep -v '^#' .env | sed 's/^/export /') && node prisma/seed-kfg.js
```
The seed script requires the `PrismaPg` adapter — not plain `new PrismaClient()`.

## Environment Variables
```
DATABASE_URL, JWT_SECRET, BLOB_READ_WRITE_TOKEN, ADMIN_EMAIL, ADMIN_PASSWORD
```

## Do NOT
- Add checkout, payments, or user accounts
- Create separate pages per menu item — everything on one page
- Add dark mode or i18n
- Use Drizzle ORM (project migrated to Prisma)
- Deploy anywhere other than Vercel
- Use `$queryRaw` or raw SQL
- Set `font-size < 16px` on any `<input>` element
