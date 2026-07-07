# متابع الحفظ — Special Monitoring System

An interactive, gamified system for tracking the memorization of Prophetic Hadiths, Quran surahs, and English vocabulary. Designed for teachers and halaqa supervisors to monitor student progress with a nature-inspired, hand-drawn aesthetic.

## Features

- **Three learning tracks:** Hadith (40 hadiths), Quran (114 surahs), English vocabulary (180 units across 6 books)
- **Gamification:** XP system with 5 progression stages (Seed → Shadow), badge unlocks, and level-up celebrations
- **Student management:** Add, edit, delete students with avatars and notes
- **Quick logging:** Toggle memorization status (memorized / review / none) from the adventure map
- **Dashboard:** Leaderboard, statistics, and hadith of the day
- **RTL layout:** Full Arabic language support with nature-themed UI

## Tech Stack

- Next.js 16 (App Router, React 19, TypeScript 5)
- PostgreSQL (via `pg` driver)
- Tailwind CSS v4
- Lucide React (icons)
- ESLint + TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_USER` | Admin username |
| `AUTH_PASS` | Admin password |
| `COOKIE_SECRET` | HMAC-SHA256 signing secret for session tokens |

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (port 4000)
npm run dev
```

### Build

```bash
# Production build
npm run build

# Start production server (port 4000)
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
  app/
    api/                   # Next.js API routes (REST endpoints)
    login/                 # Login page
    dashboard/             # Main dashboard
    hadith/                # Hadith tracking
    quran/                 # Quran tracking
    english/               # English vocabulary tracking
    reference/             # Reference materials
    stages/                # Stage management
  components/
    layout/                # Sidebar, layout components
    app-icon.tsx           # Lucide icon wrapper
  lib/
    auth.ts                # HMAC-signed session tokens
    constants.ts           # Quran surahs, stages, icons, avatars
    db.ts                  # PostgreSQL connection pool + XP calc
    tracker-context.tsx     # Global state (React Context)
    types.ts               # TypeScript interfaces
```

## Data Persistence

All data is stored in a PostgreSQL database. Session tokens are HMAC-SHA256 signed and validated on every protected API request.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_USER` | Admin username for login |
| `AUTH_PASS` | Admin password for login |
| `COOKIE_SECRET` | Secret key for session token signing (HMAC-SHA256) |
| `NODE_ENV` | `production` enables Secure cookies |
