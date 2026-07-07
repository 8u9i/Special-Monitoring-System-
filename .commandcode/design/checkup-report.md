# Design Checkup Report — نظام المتابعة الخاص

**Generated**: 2026-07-07
**Surface**: Product (app UI, dashboard, admin tools)
**Register**: Product — the interface is the instrument
**Composition**: Monitor (status boards, metrics, leaderboard, progress tracking)

---

## Vitals Scan

| Category | Score | Status |
|----------|-------|--------|
| Color System | 8/10 | 🟢 Strong |
| Typography | 7/10 | 🟢 Good |
| Layout / Composition | 7/10 | 🟢 Good |
| Motion | 4/10 | 🟡 Needs work |
| Interaction / States | 6/10 | 🟢 Adequate |
| Responsive | 7/10 | 🟢 Good |
| Accessibility | 6/10 | 🟢 Adequate |
| Surface / Component Quality | 7/10 | 🟢 Good |
| Voice / Identity | 8/10 | 🟢 Strong |
| Dark Mode | 8/10 | 🟢 Strong |
| **Overall** | **6.8/10** | 🟢 Solid foundation |

---

## Color System — 8/10 🟢

### What's working well

The amber/saffron primary (`#D4A23A`) on warm cream canvas (`#F5F0EB`) is a **distinctive, intentional choice** that avoids the generic blue-purple SaaS reflex. This palette has character and purpose.

- Warm, earthy tones suit the Islamic/Arabic domain — they feel authored, not downloaded
- Semantic color roles are well-assigned: green (success/memorized), amber (warning/review), blue (info), rose (danger/delete)
- Tag colors have proper text variants (`--color-tag-amber-text`, etc.) — this prevents the common "unreadable light text on light background" bug
- `primary-light` tints are used as subtle backgrounds throughout — effective at creating hierarchy without heavy borders
- Dark mode is a **complete token swap**, not a lazy inversion — every variable has a dark variant tuned for readability on dark backgrounds

### What could improve

- **The amber secondary competes with amber-primary in places.** On the dashboard, `--color-amber` is used for warning/review tokens, but it's visually close to the primary. Consider pushing amber-secondary slightly more toward yellow-gold or reducing its saturation to create clearer distinction.
- **Canvas-to-surface contrast is subtle.** `#F5F0EB` → `#FCFAF7` is only ~3% lightness difference. On low-quality displays or bright environments, the distinction between canvas and card surfaces can wash out. Consider deepening canvas to ~`#F0EAE4` for a 5% step.
- **The rose color for danger/delete is under-leveraged.** It exists as a token and a light variant, but only appears in the login error state and one delete button. More could be done — especially in confirmation modals and reset actions.

---

## Typography — 7/10 🟢

### What's working well

The font pairing is **thoughtful and domain-appropriate**:

- **Tajawal** for Arabic body — clean, modern Arabic sans-serif with excellent readability at small sizes
- **Amiri** for Quranic/hadith text — refined naskh-style serif that carries the weight of religious content appropriately
- **Cause** for English vocabulary — playful rounded font that differentiates English learning content
- **Inter** for UI labels and numbers — standard, reliable

The scale uses `clamp()` for headings — a good responsive choice that prevents oversized text on mobile.

### What could improve

- **The scale ratio is inconsistent.** Type sizes jump: 0.6875 → 0.75 → 0.875 → 1 → 1.25 → 1.563 → 1.953 — this is roughly a major-third scale (1.25) but with gaps and a missing step between `--text-lg` (1.25) and `--text-xl` (1.563). Either commit to a strict scale or accept the irregularity intentionally.
- **`--text-2xs` at 0.6875rem (11px) is below the accessibility floor.** Body/UI text should never drop below 0.75rem (12px). This size appears in badges, tags, and tertiary labels — all high-information-density elements where readability matters most. Bump to 0.75rem minimum.
- **Heading hierarchy could use more weight contrast.** `--text-3xl` and `--text-4xl` use the same `font-bold` (700). The largest heading should feel visually heavier — try 800 or use tighter letter-spacing.
- **Line-height on body (`1.8`) is generous for Arabic** — appropriate for reading comfort, but some UI labels at this line-height feel unnecessarily loose. Consider differentiating prose line-height (1.8 for reading) from UI label line-height (1.4-1.5 for scanning).

---

## Layout / Composition — 7/10 🟢

### What's working well

The composition correctly identifies the dominant work pattern as **Monitor**:

- Dashboard has stat cards → progress ring → leaderboard → hadith of day — a classic status-board flow
- Learning trails (hadith/quran/english) use accordion browse + student context card — effective for the "check each student's progress" workflow
- Student carousel enables quick switching without leaving context
- Sidebar + header shell is predictable and efficient

### What could improve

- **The dashboard stat cards are 4-across on desktop.** At lg (1024px), this creates four equal-weight cards that compete for attention. Consider making the "صاحب الصدارة" (top student) card span 2 columns and visually dominate — it's the most emotionally meaningful metric.
- **The hadith/quran pages have the same structure (carousel → stage card + accordion).** This consistency is good for learnability but makes the pages feel interchangeable. Each trail could have a distinctive entry element — a hero stat for quran (progress ring), a daily hadith pull for hadith.
- **The stages/admin page crams admin tools + student grid into one view.** The "أدوات الإدارة" sidebar shares space with the student cards at a 1:3 ratio. For admin tasks, this feels cramped — consider a dedicated admin layout or a tabbed approach.

---

## Motion — 4/10 🟡

### What's working well

- `prefers-reduced-motion` is properly respected with instant-duration overrides
- Progress bar width transitions (`1s ease-out`) feel satisfying
- Button press (`scale(0.98)`) gives tactile feedback
- The fade-in animation on modals is present

### What could improve

**This is the weakest category.** The motion system is nearly absent:

- **No page transitions.** Route changes are instant cuts. Even a 150ms crossfade on the content area would soften the navigation experience.
- **No entrance stagger.** The dashboard stats, leaderboard rows, and hadith accordion items all appear simultaneously. A staggered entrance (20ms per item) would create a sense of liveliness without slowing the experience.
- **The accordion expand/collapse is instant.** Animating `grid-template-rows` or `max-height` with a 200ms ease-out would make the browse experience feel fluid instead of jarring.
- **The celebration modal** exists but its entrance animation is unclear from the code.
- **No scroll-triggered reveals.** Given the long scrollable lists (114 surahs, ~40 hadiths), progressive loading feels inevitable — some visual acknowledgment would help.

**Prescription**: Add 3 core motion behaviors:
1. **Page content fade-in**: 200ms ease-out, 50ms delay on route change
2. **Accordion expand**: height transition, 200ms ease-out
3. **List stagger**: 20ms per-item delay on first render

---

## Interaction / States — 6/10 🟢

### What's working well

- Hover states on all interactive elements ✓
- `focus-visible` handled globally with primary-color outline ✓
- Active states on buttons (scale + color shift) ✓
- Disabled states (opacity + cursor) ✓
- Loading spinners on async actions ✓
- Empty states with instructional text ✓
- Escape key dismisses modals ✓
- Backdrop click dismisses modals ✓

### What could improve

- **Password visibility toggle on login uses the same icon (`lock`) for both states.** This is a bug — it should show `visibility` / `visibility_off` or equivalent icons.
- **No skeleton/placeholder states.** When `loadAll()` is fetching, the entire app shows a spinner. Individual card skeletons would feel faster and more polished.
- **No optimistic micro-feedback on status toggles.** When a teacher marks a hadith as "memorized", the button state changes but there's no brief pulse/animation to confirm the action registered. A 300ms scale pulse on the badge-number would help.
- **The confirm modal could be more opinionated.** It currently supports any callback, but delete/reset confirmations should have the destructive button styled in rose, not the default primary.

---

## Responsive — 7/10 🟢

### What's working well

- Grid breakpoints are well-chosen: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Mobile sidebar with overlay + slide-in from right (RTL-aware) ✓
- Touch targets ≥44px (`btn-icon: 44px`, `input-field: min-height 48px`) ✓
- `viewport-fit=cover` meta tag set ✓
- RTL handled comprehensively ✓
- `suppressHydrationWarning` on `<html>` ✓

### What could improve

- **The student carousel on mobile is a horizontal scroll with no scroll-snapping.** On touch devices, it scrolls freely and can stop mid-item. Adding `scroll-snap-type: x mandatory` on the container and `scroll-snap-align: start` on items would make it feel designed, not broken.
- **No container queries.** With the sidebar + content layout, the content area width changes. Some components (like the leaderboard row) could adapt more gracefully with container queries instead of viewport breakpoints alone.
- **iOS Safari input zoom**: Input font-size on login is 0.875rem (14px) which is below the 16px threshold — this triggers auto-zoom on iOS. Bump to 1rem on mobile.

---

## Accessibility — 6/10 🟢

### What's working well

- RTL layout with `dir="rtl"` on `<html>` ✓
- `focus-visible` outlines (2px solid, 2px offset) in primary color ✓
- `aria-expanded` on accordion items ✓
- `aria-modal="true"` on dialogs ✓
- `role="dialog"` on modals ✓
- Escape key handlers on modals ✓
- `aria-label` on mobile menu toggle ✓
- `suppressHydrationWarning` ✓

### What could improve

- **Missing `aria-current="page"` on active navigation items.** Screen readers can't identify the current page in the sidebar.
- **The carousel student selector has no ARIA role.** It should be `role="listbox"` with `role="option"` and `aria-selected` on each student item.
- **No skip-to-content link.** Common for Arabic RTL apps. Add a visually-hidden link at the top of the page.
- **Color contrast on tag text:** Tag amber text (`#7A6510`) on amber-light (`#FCF5E0`) should be verified — at small sizes (0.6875rem), this combination may fail WCAG AA for normal text.
- **Form labels are visible** (good), but the login form doesn't associate labels with inputs via `htmlFor`/`id`.

---

## Surface / Component Quality — 7/10 🟢

### What's working well

The component system is **consistent and composable**:

- Panel variants: `panel`, `panel-header`, `panel-title`, `panel-title-icon`
- Button system: `btn`, `btn-primary`, `btn-outline`, `btn-ghost`, `btn-sm/md/lg`, `btn-icon`
- Tag system: `tag`, `tag-primary`, `tag-amber`, `tag-green`, `tag-blue`
- Badge system: `badge-number`, `badge-number-memorized`, `badge-number-review`, `badge-number-none`
- Progress: `progress-bar`, `progress-fill`, `progress-fill-green`
- Empty state: `empty-state`, `empty-state-text`
- Modal: `modal-panel`, `animate-fade-in`
- Input: `input-field`

All components use the design token system — no hardcoded colors in components. This is excellent.

### What could improve

- **Zero border-radius everywhere (`rounded-none`)** is a deliberate stylistic choice, but it makes interactive elements feel slightly severe. Even a 2px radius on buttons and inputs would soften the UI without compromising the minimal aesthetic.
- **The `divider` token exists but is never used as a class** — `section-divider` exists in CSS but components use `border-t border-border-light` inline. Extract to a utility.
- **Some components duplicate structure.** The hadith and quran pages share an accordion pattern that could be abstracted into a reusable `<AccordionList>` component.
- **No toast variants beyond success/error.** A "warning" and "info" variant would be useful for the review status flow.

---

## Voice / Identity — 8/10 🟢

### What's working well

The app has a **strong, authentic identity** that avoids generic SaaS patterns:

- The name "يا إخوتي" (O my brothers) carries warmth and community — appropriate for a teacher-student spiritual context
- The `eco` (leaf/sprout) icon as the brand mark symbolizes growth and nurturing — not a generic tech icon
- The بسملة (Bismillah) at the bottom of the login page grounds the app in its religious context
- Hadith references are properly attributed ("الأحاديث مأخوذة من كتاب إتحاف الأخيار للشيخ سعيد بن مبروك القنوبي")
- Educational nudges are phrased warmly ("فكرة تربوية", not "Tip")
- The `military_tech` icon for the top student is playful and appropriate for young learners

### What could improve

- **The version string "v1.0 — متابع الحفظ"** at the bottom of the sidebar feels like developer cruft. Remove it or replace with a more meaningful footer.
- **The login error uses "فشل تسجيل الدخول"** — appropriate and direct, but could offer a recovery path ("تأكد من اسم المستخدم وكلمة المرور")

---

## Dark Mode — 8/10 🟢

- Complete token swap with properly tuned dark variants ✓
- `prefers-color-scheme: dark` media query respected ✓
- Manual override via `body.light` class ✓
- Dark canvas (`#12100E`) is genuinely dark, not gray — feels premium
- Text-on-dark contrast ratios appear well-considered

No significant issues. The dark mode implementation is thorough.

---

## Priority Prescriptions

| # | Area | Prescription | Impact |
|---|------|-------------|--------|
| 1 | Motion | Add accordion expand/collapse animation (200ms ease-out) | Makes browse experience feel responsive |
| 2 | Motion | Add page content fade-in on route change (200ms) | Softens navigation transitions |
| 3 | Accessibility | Add `aria-current="page"` to active nav items | Screen reader navigation |
| 4 | Accessibility | Bump `--text-2xs` from 0.6875rem to 0.75rem | Readability floor |
| 5 | Interaction | Fix password toggle icon (show different icon per state) | Usability bug |
| 6 | Responsive | Add scroll-snapping to student carousel | Mobile polish |
| 7 | Responsive | Bump login input font-size to 1rem on mobile | Prevent iOS zoom |
| 8 | Layout | Make top-student dashboard card visually dominant (span 2 cols) | Information hierarchy |
| 9 | Color | Slightly deepen canvas from `#F5F0EB` to `#F0EAE4` | Surface distinction |
| 10 | Typography | Differentiate prose line-height (1.8) from UI label line-height (1.5) | Scanning efficiency |

---

## Overall Assessment

**Solid foundation with strong identity.** The color palette, typography choices, and RTL implementation show real design intent — this isn't a generic template dressed up. The amber-on-warm-cream palette is distinctive, the Arabic font pairing is well-considered, and the Monitor composition matches the teacher's workflow.

The main gaps are in **motion** (nearly absent) and **polish at the edges** (scroll behavior, text size floor, ARIA completeness). These are high-impact, low-effort fixes that would elevate the experience from "functional" to "crafted."

No blockers. All prescriptions are enhancements, not rewrites.
