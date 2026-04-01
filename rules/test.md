# KFG Menu — Test Strategy

## Overview
End-to-end tests using **Playwright** to validate the full user journey across both the public menu and admin dashboard. Tests run against a local dev server (`next dev`) hitting the real Neon Postgres database.

## Test Categories

### 1. Public Menu (Customer-Facing)
| ID | Test | What it validates |
|----|------|-------------------|
| P1 | Homepage loads with header, tabs, and menu items | SSR data fetching, component rendering |
| P2 | Category tabs are visible and clickable | Tab navigation, smooth scroll to section |
| P3 | Category tabs auto-scroll on mobile when vertical scroll changes active tab | IntersectionObserver + horizontal auto-scroll |
| P4 | Menu carousel renders per category with items | Design C carousel, image loading |
| P5 | Carousel horizontal scroll works (swipe / arrow click) | CSS scroll-snap, arrow visibility |
| P6 | Scroll progress bar updates as carousel scrolls | Progress bar width changes |
| P7 | Header shows logo and sign-in link | Logo image loads, link href correct |
| P8 | Footer renders with social icons | Footer content present |
| P9 | Empty menu shows "Menu coming soon!" | Empty state handling |
| P10 | Page loads with skeleton then resolves | loading.jsx renders before content |

### 2. Admin Authentication
| ID | Test | What it validates |
|----|------|-------------------|
| A1 | Login page renders with email/password form | Form fields present |
| A2 | Invalid credentials show error | 401 response handling |
| A3 | Valid login redirects to dashboard | JWT cookie set, redirect works |
| A4 | Unauthenticated access to /admin/dashboard redirects to login | Middleware protection |
| A5 | Logout clears cookie and redirects | DELETE /api/auth/login, cookie removal |

### 3. Admin Dashboard
| ID | Test | What it validates |
|----|------|-------------------|
| D1 | Dashboard overview shows category and item counts | Stats fetching, rendering |
| D2 | Categories page lists all categories | GET /api/categories |
| D3 | Create a new category | POST /api/categories, form submission |
| D4 | Edit an existing category | PUT /api/categories/[id] |
| D5 | Toggle category active status | PUT with isActive toggle |
| D6 | Delete a category | DELETE /api/categories/[id] |
| D7 | Menu items page lists items with thumbnails | GET /api/menu-items |
| D8 | Filter menu items by category | Query param filtering |
| D9 | Create a new menu item | POST /api/menu-items |
| D10 | Edit an existing menu item | PUT /api/menu-items/[id] |
| D11 | Delete a menu item | DELETE /api/menu-items/[id] |

### 4. API Validation
| ID | Test | What it validates |
|----|------|-------------------|
| V1 | POST /api/categories with empty name returns 400 | Zod validation |
| V2 | POST /api/menu-items with negative price returns 400 | Zod validation |
| V3 | POST /api/categories without auth returns 401 | Auth middleware |
| V4 | Duplicate category slug returns 409 | Prisma unique constraint |

### 5. Responsive / Mobile
| ID | Test | What it validates |
|----|------|-------------------|
| R1 | Admin sidebar collapses to hamburger on mobile | Responsive layout |
| R2 | Admin tables switch to card view on mobile | md:hidden / hidden md:block |
| R3 | Category tabs horizontally scrollable on mobile | overflow-x-auto, touch scroll |
| R4 | Carousel items swipeable on mobile viewport | Touch scroll behavior |

### 6. Skeleton Loading
| ID | Test | What it validates |
|----|------|-------------------|
| S1 | Public menu loading.jsx renders skeleton before content | Suspense boundary |
| S2 | Admin dashboard shows skeleton numbers while fetching | Inline loading state |
| S3 | Admin categories shows skeleton rows while fetching | Inline loading state |
| S4 | Admin menu items shows skeleton cards while fetching | Inline loading state |

## Running Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/public-menu.spec.js

# Run in headed mode (see browser)
npx playwright test --headed
```

## Test Environment
- **Browser:** Chromium (primary), optionally Firefox/WebKit
- **Viewports:** Desktop (1280x720), Mobile (375x667)
- **Base URL:** `http://localhost:3000`
- **Database:** Real Neon Postgres (same as dev)
- **Auth:** Tests that need admin access login via the API first and reuse the auth cookie

## Conventions
- Test files live in `tests/` at project root
- One file per test category (e.g., `public-menu.spec.js`, `admin-auth.spec.js`)
- Use `test.describe()` to group related tests
- Use `test.beforeAll()` for shared setup like authentication
- Prefer `data-testid` attributes for selectors when text content isn't reliable
- Clean up test-created data in `test.afterAll()` where possible
