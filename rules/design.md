# Design Specification — rules/design.md

## Reference

This design replicates the layout and UX of the KFG reference site.
Target accuracy: 99.9%. When in doubt, match the reference exactly.
This file is the single source of truth for all frontend visual decisions.

## Brand

- **Restaurant name:** KFG
- **Logo file:** `/public/logo.png` (KFG logo with chicken drumstick)
- **Footer logo:** Same file with CSS `filter: brightness(0) invert(1)` for white version

## Design Workflow

When the user provides a screenshot + inspected styles from the reference:
1. Study the screenshot and styles carefully
2. Implement changes to match exactly
3. Take a Playwright screenshot of the result
4. Compare side-by-side with the reference
5. Iterate until 99.9% match — pixel-level accuracy on spacing, colors, fonts, layout
6. Only mark done when the comparison passes

---

## Page Structure (top to bottom)

```
┌─────────────────────────────────────────┐
│  HEADER (sticky top)                    │
│  [Logo]                    [Sign In]    │
├─────────────────────────────────────────┤
│  CATEGORY TABS BAR (sticky below header)│
│  [Tab1] [Tab2] [Tab3] [Tab4] ...       │
│  horizontally scrollable on mobile      │
├─────────────────────────────────────────┤
│                                         │
│  CATEGORY SECTION TITLE                 │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ image  │ │ image  │ │ image  │      │
│  │        │ │        │ │        │      │
│  │ name   │ │ name   │ │ name   │      │
│  │ price  │ │ price  │ │ price  │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  NEXT CATEGORY SECTION TITLE            │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │  ...   │ │  ...   │ │  ...   │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  ... repeats for all categories ...     │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER (simple)                        │
│  [Logo] · © Restaurant Name 2026        │
└─────────────────────────────────────────┘
```

---

## Header

- **Position:** Sticky top, z-50
- **Height:** 64px
- **Background:** White (`#FFFFFF`)
- **Border bottom:** 1px solid `#E5E5E5`
- **Layout:** Flex, justify-between, items-center
- **Left side:** Restaurant logo image (max-height 40px, auto width)
- **Right side:** "Sign In" text link (NOT a button) — plain text, `#333333`, font-weight 500, links to `/admin/login`
- **Padding:** `0 24px` desktop, `0 16px` mobile
- **No navigation links** — just logo and sign in. That's it.
- **Shadow:** None. Clean flat border only.

---

## Category Tabs Bar

- **Position:** Sticky, sits directly below the header (top: 64px), z-40
- **Background:** White (`#FFFFFF`)
- **Border bottom:** 1px solid `#E5E5E5`
- **Height:** 48px
- **Layout:** Horizontal row of text tabs
- **Overflow behavior:** Horizontally scrollable on mobile with `-webkit-overflow-scrolling: touch`, no visible scrollbar (hide with CSS)
- **Tab styling:**
  - Font size: 14px
  - Font weight: 500
  - Text transform: uppercase
  - Letter spacing: 0.5px
  - Color (default): `#666666`
  - Color (active): `#E4002B` (red — matches KFC reference accent)
  - Active tab underline: 2px solid `#E4002B` at bottom of tab
  - Padding: `12px 16px`
  - Cursor: pointer
  - No background color on tabs — text only
  - Whitespace: nowrap (tabs never wrap to second line)
- **Behavior:**
  - Clicking a tab smooth-scrolls the page to that category section
  - Active tab updates on scroll (intersection observer) as user scrolls through sections
  - First tab is active by default on page load
- **Gap between tabs:** 0 — tabs sit flush, padding handles spacing

---

## Category Section

- **Section element:** `<section id="{category-slug}">`
- **Section title:**
  - Font size: 22px desktop, 20px mobile
  - Font weight: 700
  - Color: `#1A1A1A`
  - Text transform: none (sentence case, NOT uppercase)
  - Margin: `32px 0 16px 0`
  - Padding left: matches grid padding (24px desktop, 16px mobile)

---

## Menu Item Card Grid

- **Layout:** CSS Grid
- **Columns:**
  - Desktop (≥1024px): `grid-template-columns: repeat(4, 1fr)`
  - Tablet (≥768px): `repeat(3, 1fr)`
  - Mobile (<768px): `repeat(2, 1fr)`
- **Gap:** 16px
- **Grid padding:** `0 24px` desktop, `0 16px` mobile
- **Max width:** 1200px, centered with `margin: 0 auto`

---

## Menu Item Card

This is the most important component. Match the KFC reference card exactly.

- **Shape:** Rounded rectangle
- **Border radius:** 12px
- **Background:** `#FFFFFF`
- **Border:** 1px solid `#EEEEEE`
- **Box shadow:** `0 1px 3px rgba(0,0,0,0.06)` — extremely subtle
- **Overflow:** hidden (image clips to rounded top corners)
- **Cursor:** default (not clickable — no detail page)
- **Hover effect:** Subtle lift — `transform: translateY(-2px)` and `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` with `transition: all 0.2s ease`

### Card Image
- **Position:** Top of card, full width
- **Aspect ratio:** 1:1 (square)
- **Object fit:** `cover`
- **Background color (placeholder):** `#F5F5F5` — shown while image loads or if no image
- **Use `next/image`** with proper width={300} height={300} for optimization
- **Alt text:** item name

### Card Body
- **Padding:** `12px`

### Item Name
- **Font size:** 14px
- **Font weight:** 600
- **Color:** `#1A1A1A`
- **Line height:** 1.3
- **Max lines:** 2 (use `-webkit-line-clamp: 2` with overflow hidden)
- **Text transform:** uppercase
- **Margin bottom:** 8px

### Item Price
- **Font size:** 15px
- **Font weight:** 700
- **Color:** `#E4002B` (red accent)
- **Format:** Currency symbol + amount with 2 decimal places (e.g., "$12.50")
- **No line clamping** — price is always one line

### Item Description
- **NOT shown on the card** — keep it clean like the reference
- Description field exists in the database for potential future use, but the card only shows image + name + price

---

## Footer

- **Background:** `#1A1A1A`
- **Padding:** `24px`
- **Layout:** Flex, column, center aligned
- **Logo:** Same restaurant logo but white/inverted version, max-height 32px
- **Copyright text:** "© {Year} KFG. All rights reserved."
  - Font size: 13px
  - Color: `#999999`
  - Margin top: 12px
- **That's it.** No link columns, no social media, no newsletter. Dead simple.

---

## Typography

- **Font family:** `Inter` via Google Fonts (or system fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- **Load weights:** 400, 500, 600, 700 only
- **Base size:** 16px
- **Never use font sizes below 12px**

---

## Colors

| Token            | Value      | Usage                               |
|------------------|------------|-------------------------------------|
| `--primary`      | `#E4002B`  | Active tab, price, accent buttons   |
| `--text-dark`    | `#1A1A1A`  | Headings, item names                |
| `--text-body`    | `#333333`  | Body text, sign in link             |
| `--text-muted`   | `#666666`  | Inactive tabs, secondary text       |
| `--text-light`   | `#999999`  | Footer text, hints                  |
| `--bg-white`     | `#FFFFFF`  | Header, tabs, cards, page bg        |
| `--bg-gray`      | `#F5F5F5`  | Image placeholder, empty states     |
| `--border`       | `#EEEEEE`  | Card borders                        |
| `--border-dark`  | `#E5E5E5`  | Header/tabs bottom border           |

---

## Responsive Breakpoints

| Name    | Width     | Grid cols | Notes                        |
|---------|-----------|-----------|------------------------------|
| Mobile  | < 768px   | 2         | Tabs scroll, 16px padding    |
| Tablet  | 768-1023  | 3         | Tabs may still scroll        |
| Desktop | ≥ 1024px  | 4         | Tabs fit without scroll      |

---

## Scroll & Sticky Behavior

1. Header is `position: sticky; top: 0`
2. Category tabs bar is `position: sticky; top: 64px` (sits below header)
3. Both have white backgrounds so content scrolls behind them cleanly
4. On tab click: `document.getElementById(slug).scrollIntoView({ behavior: 'smooth', block: 'start' })` with an offset equal to header + tabs height (64 + 48 = 112px) so the section title isn't hidden behind the sticky bars. Use `scroll-margin-top: 112px` on each section element.
5. Intersection Observer watches each category section and updates the active tab as the user scrolls. Threshold: 0.3 (30% of section visible triggers the tab switch). Root margin: `-112px 0px 0px 0px` to account for sticky header+tabs.

---

## Loading & Empty States

- **While data loads:** Show skeleton cards — same grid layout, but cards are gray shimmer blocks (pulse animation on `#F5F5F5` to `#EBEBEB`)
- **If a category has no active items:** Hide that category entirely (both from tabs and from the page)
- **If no categories exist at all:** Show centered message: "Menu coming soon!" in `--text-muted`, 18px

---

## Image Guidelines for Admin Upload

- Recommended: Square images (1:1 ratio), minimum 400x400px
- Accepted formats: JPG, PNG, WebP
- Max file size: 5MB
- Images are displayed at 1:1 aspect ratio on cards regardless of original dimensions (object-fit: cover handles cropping)

---

## What NOT to Design

- No hero banner / promotional section at top
- No "Order Now" or "Add to Cart" buttons anywhere
- No item detail modal or page
- No search bar
- No filters beyond category tabs
- No animations beyond card hover and skeleton loading
- No dark mode toggle
- No language switcher
- No breadcrumbs