# Restaurant Menu App

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Neon Postgres · Drizzle ORM · Vercel

## What This Is
Digital menu for a restaurant. Customers scan QR → see menu items by category → tell waiter their choice. Admins manage categories and items via a protected dashboard. No cart, no ordering, no payments.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Write detailed specs upfront to reduce ambiguity

### 2. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Review lessons at session start

### 3. Verification Before Done
- Never mark a task complete without proving it works
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 4. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them

## Task Management
1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Track Progress**: Mark items complete as you go
3. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles
- **Simplicity First**: Impact minimal code. Don't over-engineer.
- **No Laziness**: Find root causes. No temporary fixes.
- **Minimal Impact**: Changes should only touch what's necessary.

## Key Rules
- Public menu page: follow `rules/design.md` with 99.9% accuracy — it IS the spec
- Mobile-first: most users arrive via QR code on phone
- Admin dashboard: simple and functional — not fancy
- Use Drizzle ORM for all queries — no raw SQL
- Validate inputs server-side with zod
- JWT auth in httpOnly cookie, protected via middleware.ts
- Images via Vercel Blob or Cloudinary
- Use next/image for optimization

## Environment Variables
```
DATABASE_URL, JWT_SECRET, BLOB_READ_WRITE_TOKEN, ADMIN_EMAIL, ADMIN_PASSWORD
```

## Do NOT
- Add cart, ordering, payments, or user accounts
- Create separate pages per menu item — everything on one page
- Add dark mode, i18n, or search
- Deploy anywhere other than Vercel