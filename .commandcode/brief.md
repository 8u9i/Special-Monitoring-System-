# Design Brief — "يا إخوتي" (Special Monitoring System)

**Last updated:** 2026-07-06
**Edit with:** `/design setup`

---

## Register

**Surface** — dashboard, tool, admin panel. Bias toward consistency and earned familiarity. An experienced operator should navigate by muscle memory.

This is a student progress tracking tool used by teachers/supervisors. Three learning tracks (Hadith, Quran, English vocabulary), XP/level system, leaderboards, celebration animations. Arabic RTL interface.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | Angular 21 (standalone components, signals, OnPush) |
| Styling | Tailwind CSS v4 (`@theme` block, CSS-first), PostCSS |
| Component Library | Angular Material 21 (Material Icons only — no components) |
| Icons | Material Icons font |
| Language | TypeScript 5.9 (strict mode) |
| Server | Express 5 (SSR with `@angular/ssr`) |

---

## Color Strategy

**Restrained warm-earth palette.** Strategy: Committed — one primary hue (gold) with deliberate restraint on accents.

- **Primary:** `#D4A23A` (saffron gold) — invariant across light/dark modes
- **Canvas:** `#F5F0EB` (warm sand) — page background
- **Surface:** `#FCFAF7` (off-white) → elevated `#FFFDFA` — card layering
- **Nav:** `#1F1B18` (dark brown) — sidebar, with lighter hover/active variants
- **Accents:** Muted amber (`#E8C96A`), blue (`#7DA8C4`), green (`#7DAB7D`), rose (`#D49A9A`) — desaturated, warm
- **Text:** Three-tier staircase: `#1C1814` → `#6B635C` → `#9C948C`
- **Dark mode:** Token-swapped via CSS custom properties. Backgrounds go to very dark warm browns (`#12100E`, `#1C1917`). Not pure black.

**Color rules:**
- OKLCH-first (though current palette uses hex — migrate to OKLCH as tokens stabilize)
- No indigo or blue defaults — gold is the brand
- Nesting hierarchy: canvas → surface → surface-elevated, each layer lighter in light mode

---

## Typography

**Arabic-first, RTL.** Three fonts: Display (Cause), Body (Tajawal), UI (Inter).

| Token | Stack | Role |
|---|---|---|
| `--font-body` | `"Tajawal", "Inter", sans-serif` | Default: body text, content |
| `--font-ui` | `"Inter", "Tajawal", sans-serif` | UI chrome: buttons, labels, inputs |
| `--font-cause` | `"Cause", cursive` | Decorative display (brand/accent moments) |

**Scale:** 9 steps from 11px to 36px. Target minimum ratio 1.25 between hierarchy steps.

**Line-height:** 1.8 on body (generous for Arabic readability). Tighter on headings.

**Measure:** 65–75ch for prose areas (reference page, hadith text displays).

---

## Layout

**RTL-first, mobile-first.** Sidebar collapses to overlay on mobile, persistent on desktop.

- **Grid:** 1-4-9 rhythm target (4px base). Currently pragmatic — some values break the 4px baseline.
- **Spacing:** `gap` used, not sibling margins. Vertical rhythm via `space-y-*`.
- **Containers:** `max-w-7xl mx-auto` on main content.
- **Zero border-radius** is the universal choice — flat, brutalist.
- **Cards/panels:** 1px solid border, no shadow (except modals).
- **No nested cards** — panels are always atomic.

---

## Interaction

**Nine states** for interactive elements: idle, hover, active, focused, loading, empty, error, disabled, overflow.

- **Touch targets:** ≥44×44px on buttons/links/labels, ≥48px on inputs/selects/textareas
- **Focus:** Primary-gold 2px outline with 2px offset on `:focus-visible`
- **Hover:** Color shift only — no scale on buttons (except English unit cards `hover:scale-105`)
- **Active:** `scale(0.98)` press feedback on primary/outline buttons
- **Transitions:** `0.15s ease` on interactive elements, `1s ease-out` on progress bars

---

## Motion

- **Animate `transform` and `opacity` only.**
- **Ease out, never bounce.**
- **Respect `prefers-reduced-motion`** — all animations/transitions zeroed to `0.01ms`.
- **Entry animation:** `fade-in` (opacity 0→1 + translateY 4px→0, 0.2s ease-out)
- **Leaderboard:** Staggered `fadeSlideIn` (opacity 0→1 + translateY 12px→0)

---

## Accessibility Targets

**WCAG AA minimum.**

- All text meets 4.5:1 contrast ratio against backgrounds (≥3:1 for large text)
- Touch targets exceed WCAG 2.5.5 (44px minimum)
- Keyboard-navigable: skip-to-content link, focus indicators on all interactive elements
- Screen reader: `aria-label`, `aria-modal`, `aria-labelledby`, `role="dialog"` on modals
- RTL: `direction: rtl` on body with explicit RTL rules for progress bars, icons, arrow flips
- Reduced motion: full suppression when user preference is set

---

## Design System Components

Defined as CSS classes in `src/styles.css` (not Tailwind utilities):

| Component | Description |
|---|---|
| `.panel` | Card container with surface background and border |
| `.panel-header` | Card header with bottom border separator |
| `.panel-title` | Card title with Tajawal font, primary icon slot |
| `.btn`s | Three variants (primary, outline, ghost) × three sizes (sm, md, lg) + icon |
| `.tag`s | Four color variants (primary, amber, green, blue) |
| `.badge-number`s | Three status variants (memorized, review, none) + small variant |
| `.progress-bar` | 6px height with primary or green fill |
| `.empty-state` | Centered placeholder with icon and text |
| `.input-field` | Unified input/textarea/select with canvas background |
| `.modal-panel` | 90vh max modal container with shadow |
| `.avatar-option` | Selectable avatar card grid |
| `.section-divider` | 1px horizontal rule |

---

## Anti-Patterns (Avoid)

- Nested cards (cards inside cards)
- Hardcoded hex colors in component templates — use CSS custom properties
- Tailwind `/opacity` syntax on CSS variables (`border-[var(--...)]/20` is invalid CSS)
- Indigo or blue as primary/default
- `margin` for spacing between siblings — use `gap` or `space-y-*`
- Bounce animations or `ease-in-out`
- Features gated behind hover (touch-first)
- Silent error handling — every error path needs user-facing feedback
