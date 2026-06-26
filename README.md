# متابع الحفظ — Hadith Memorization Tracker

An interactive, gamified system for tracking the memorization of Prophetic Hadiths, Quran surahs, and English vocabulary. Designed for teachers and halaqa supervisors to monitor student progress with a nature-inspired, hand-drawn aesthetic.

## Features

- **Three learning tracks:** Hadith (40 hadiths), Quran (114 surahs), English vocabulary (180 units across 6 books)
- **Gamification:** XP system with 5 progression stages (Seed → Shadow), badge unlocks, and level-up celebrations
- **Student management:** Add, edit, delete students with avatars and notes
- **Quick logging:** Toggle memorization status (memorized / review / none) from the adventure map
- **Dashboard:** Leaderboard, statistics, and hadith of the day
- **RTL layout:** Full Arabic language support with nature-themed UI

## Tech Stack

- Angular 21 (standalone components, signals, SSR)
- Tailwind CSS v4
- Express 5 (SSR server)
- TypeScript 5.9 (strict mode)
- Vitest (testing)
- ESLint + angular-eslint

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev
```

### Build

```bash
# Production build (browser + SSR bundles)
npm run build

# Serve production SSR
npm run serve:ssr:app
```

### Test & Lint

```bash
npm test
npm run lint
```

## Project Structure

```
src/
  index.html              # SPA shell
  main.ts                 # Browser bootstrap
  main.server.ts          # SSR bootstrap
  server.ts               # Express SSR server
  styles.css              # Global styles, Tailwind, theme
  app/
    app.ts                # Root component (all business logic)
    app.html              # UI template (~2500 lines)
    app.css               # Component animations
    app.routes.ts         # Client routes (empty — tab-based nav)
    state.ts              # Global state service (Angular Signals)
    hadith-data.ts        # 40 hardcoded Hadiths + data model
```

## Data Persistence

All data is stored in the browser's `localStorage`. No backend database is used. Seed data (4 sample students, 40 hadiths) loads on first visit.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Gemini AI API key (declared but not currently used) |
| `APP_URL` | Application URL (for self-referential links) |
