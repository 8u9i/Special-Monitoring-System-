# Code Deletion Log

## 2026-07-01 Refactor Session

### Dead Code Summary
Total lines removed: **~450** (mostly static data array)

---

### Unused Imports Removed

**`src/app/app.ts`**
- `signal` from `@angular/core` — only `toSignal` was used in the file; `signal()` was never called directly
- `NavigationEnd` from `@angular/router` — duplicate import (also imported via `Router, RouterOutlet, NavigationEnd`); removed entirely since `currentUrl` signal was also dead
- `filter, map` from `rxjs` — only used by the removed `currentUrl` signal
- `toSignal` from `@angular/core/rxjs-interop` — only used by the removed `currentUrl` signal

### Unused Variables/Methods Removed

**`src/app/app.ts`**
- `private currentUrl = toSignal(...)` — only consumer was the dead `isLoginPage` method
- `isLoginPage = () => ...` — method defined but never referenced in template or anywhere else

**`src/app/state.ts`** — 6 dead methods/computed removed:
- `categories = computed(...)` — never called; all components use their own local `uniqueCategories()` computed
- `getStudentBadges(studentId)` — defined and exported but never called from any component
- `getStudentBadgesByTrail(studentId, trail)` — defined and exported but never called from any component
- `toggleHadithQuick(studentId, hadithNumber)` — defined but never called; components use `toggleHadithStatus` directly
- `toggleSurahQuick(studentId, surahNumber)` — defined but never called; components use `toggleSurahStatus` directly
- `toggleEnglishQuick(studentId, unitNumber)` — defined but never called; components use `toggleEnglishStatus` directly

### Unused Exports Removed

**`src/app/hadith-data.ts`**
- `HADITHS_DATA: Hadith[]` — static data array of 40 hadiths, never imported or referenced anywhere in the codebase. The app exclusively uses API data loaded via `loadAll()` in `TrackerState`.

### Dead API Service Methods Removed

**`src/app/api.service.ts`** — 5 methods that were defined but never called:
- `deleteEnglishProgress()` — no component calls this; English progress is toggled via `setEnglishProgress` with `'none'`
- `getStudentBadges(studentId)` — only `getAllStudentBadges()` (no parameter) is used
- `createBadge()` — no UI for badge creation exists
- `deleteBadge()` — no UI for badge deletion exists
- `sync()` — no component calls bulk sync
- `SyncPayload` interface — only existed for the removed `sync()` method

### Unused CSS Removed

**`src/app/app.css`** — styles and keyframes not referenced by any template:
- `@keyframes fadeInUp` / `.animate-fade-in-up` — class not used in any template
- `@keyframes scaleIn` / `.animate-scale-in` — class not used in any template
- `.scale-102` — class not used in any template
- `.backdrop-blur-xs` — class not used in any template

Kept (still used): `@keyframes fadeIn`, `.animate-fade-in`, `.backdrop-blur-md`, `.z-55`

### Dead Code Left in Place (Preserved for Safety)

**`src/server.ts`** — API endpoints not called by client but kept as passive endpoints:
- `GET /api/student-hadiths/:studentId` — defined in server but no corresponding `ApiService` method calls it. Retained as a valid passive endpoint for external use.

### Additional Observations (Not Fixed)

- `catch(() => {})` empty blocks in `server.ts` (lines 98, 265) — fire-and-forget DB operations, intentionally silent. Left as-is to avoid unhandled promise rejections.
- `catch(() => {})` in `stages.component.ts` (lines 198, 218) — fire-and-forget API persistence, left as-is.
- Several `catch (err)` blocks in `server.ts` where `err` is declared but never referenced — these should ideally add `console.error` rather than removing the parameter. Left as-is since they're server-side error handlers.

### Impact
- Source files modified: 5
- Files unchanged: all template `.ts` files (no behavioral changes)
- Lines of code removed: ~450 lines (mostly from `HADITHS_DATA` static array)
- Bundle size reduction: negligible for `HADITHS_DATA` removal if tree-shaken; the API service methods would have been tree-shaken anyway but removing source code improves clarity

### Verification
- TypeScript compilation: `npx tsc --noEmit --project tsconfig.app.json` — **0 errors**
- All imports still resolve correctly
- All template references to signals/computeds remain intact (no template changes were made)
