# Nova Learn — Student Learning Dashboard

A premium, dark-themed student learning dashboard built with React 19, TypeScript, Vite, and Tailwind CSS v4. Deployed live on Vercel.

**Live Demo:** https://student-learning-dashboard-naziawork27-9979s-projects.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Animations | Framer Motion (spring physics) + GSAP (canvas/ticker) |
| Database | Supabase (PostgreSQL) with localStorage fallback |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment variables template
cp .env.example .env

# 3. Fill in your Supabase credentials in .env (optional — app works without them)

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

### Supabase Setup (optional)

If you want live cloud data, create a `courses` table in your Supabase project using this SQL:

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  icon_name TEXT DEFAULT 'Code',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  category TEXT,
  difficulty TEXT
);
```

Then add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`. Without them, the app runs fully offline using localStorage — no configuration required.

---

## Environment Variables

See [`.env.example`](.env.example) for all required and optional variables. The two critical ones for Supabase:

```
VITE_SUPABASE_URL=       # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=  # Your Supabase public anon key
```

> Variables prefixed with `VITE_` are intentionally exposed to the browser bundle by Vite. The `SUPABASE_SERVICE_ROLE_KEY` is server-side only and must never be used client-side.

---

## Architectural Choices

### 1. Client-Only SPA (No SSR)

This is a pure client-side React SPA — there are no server components, no API routes, and no Node.js server at runtime. The choice was deliberate:

- The data layer (Supabase) is accessed directly from the browser using the public anon key, which is safe because Supabase's Row Level Security (RLS) governs access.
- Vite produces a fully static `dist/` folder that Vercel serves from its CDN edge — zero cold starts, instant loads globally.
- A `vercel.json` rewrite rule (`/* → /index.html`) ensures React Router-style navigation works on direct URL access and page refresh without 404s.

### 2. Server / Client Split Simulation

Since this is not a Next.js app, there are no literal Server Components. However, the architecture mirrors the server/client split pattern:

- **"Server-like" layer — `src/lib/supabase/client.ts`:** All data fetching, mutations, and seeding logic live here, isolated from the UI. Components never call Supabase directly — they go through `dbService`. This makes it trivial to swap the backend (e.g., move to a Next.js API route or tRPC) without touching any component.
- **"Client" layer — React components:** Components are pure presentational + interaction handlers. They receive data as props from `App.tsx`, which acts as the single coordinator/context owner. No component owns its own data-fetching lifecycle.
- **Optimistic UI:** `handleUpdateCourseProgress` in `App.tsx` updates React state immediately before awaiting the Supabase call, so the UI feels instant even on slow connections.

### 3. Offline-First Fallback

`dbService` checks `isSupabaseConfigured()` before every operation. If no env vars are set, it routes all reads/writes to `localStorage` with the same interface. This means:

- The app works 100% out-of-the-box in a demo or sandboxed environment with no setup.
- The mock database is seeded with realistic course data on first load.
- Switching to Supabase only requires adding two env vars — no code changes.

### 4. Animation Architecture

Two animation libraries are used for distinct purposes:

- **Framer Motion** handles all React-tree animations: page transitions (`AnimatePresence`), staggered grid entrance (`staggerChildren`), spring-physics hover effects, and the `layoutId="active-nav"` sliding nav indicator that morphs between tabs.
- **GSAP** drives the `<AmbientCanvas>` — a fullscreen WebGL-style canvas with mouse-reactive atmospheric particles. GSAP's `ticker` syncs the canvas draw loop to the browser's RAF (requestAnimationFrame), and `gsap.to` provides silky mouse-lerp interpolation. This separation keeps React re-renders out of the hot animation path.

### 5. Styling with Tailwind CSS v4

Tailwind v4 is used as a Vite plugin (`@tailwindcss/vite`) rather than a PostCSS plugin. This means:

- No `tailwind.config.js` needed — configuration is done via CSS `@theme` in `index.css`.
- Custom fonts (`Inter`, `JetBrains Mono`) are registered as CSS variables and consumed as `font-sans` / `font-mono` throughout the app.
- Hardware-accelerated animations use only `transform` and `opacity` — never `width`, `height`, or `top/left` — to avoid triggering browser layout/paint.

---

## Project Structure

```
src/
├── App.tsx                          # Root: state coordinator, data fetching, tab routing
├── main.tsx                         # React DOM entry point
├── index.css                        # Global styles, Tailwind v4 theme tokens
│
├── lib/
│   ├── types.ts                     # Shared TypeScript interfaces (Course, NavTab, etc.)
│   └── supabase/
│       └── client.ts                # Data layer: Supabase + localStorage dbService
│
└── components/
    ├── dashboard/
    │   ├── bento-grid.tsx           # Main grid layout with staggered entrance
    │   ├── hero-tile.tsx            # Welcome card, stats strip, streak widget
    │   ├── course-card.tsx          # Individual course tile with progress controls
    │   ├── animated-progress.tsx    # Spring-animated progress bar
    │   └── activity-tile.tsx        # GitHub-style learning heatmap
    │
    ├── layout/
    │   ├── sidebar.tsx              # Collapsible desktop sidebar with layoutId nav
    │   └── mobile-nav.tsx           # Bottom tab bar for mobile
    │
    ├── ui/
    │   ├── ambient-canvas.tsx       # GSAP-powered mouse-reactive background canvas
    │   ├── glow-card.tsx            # Reusable glassmorphic card with pointer glow
    │   ├── magnetic.tsx             # Magnetic cursor attraction wrapper component
    │   ├── lucide-icons.tsx         # Dynamic icon resolver by string name
    │   └── skeleton.tsx             # Shimmer skeleton loaders for loading states
    │
    └── views/
        ├── courses-view.tsx         # Full courses management (add, delete, progress)
        ├── progress-view.tsx        # Analytics and progress breakdown
        ├── achievements-view.tsx    # Badges and milestone tracking
        └── settings-view.tsx        # User preferences and data reset
```

---

## Challenges & Solutions

**1. Disk space constraints during development**
The local environment had insufficient disk space to run `npm install` or `npm run build`. The solution was deploying directly via the Vercel REST API — uploading raw source files so Vercel's build infrastructure handled the install and build entirely in the cloud.

**2. Vite `import.meta.env` TypeScript typing**
Vite's `import.meta.env` can cause TypeScript errors in strict mode when accessed without proper type augmentation. The `(import.meta as any).env` cast in `client.ts` avoids the need for a global `vite-env.d.ts` declaration while keeping the build clean.

**3. Tailwind v4 configuration**
Tailwind v4 has no `tailwind.config.js` — all configuration moves into CSS. Registering custom fonts and theme tokens required using `@theme` inside `index.css`, which is a breaking change from v3. The `@tailwindcss/vite` plugin also replaces the PostCSS pipeline entirely.

**4. Two-library animation coordination**
Running Framer Motion (React lifecycle) and GSAP (imperative canvas loop) side by side required care. The `AmbientCanvas` cleanup function properly removes GSAP ticker callbacks and event listeners on unmount to prevent memory leaks and stale closures.

---

## Scripts

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # TypeScript type check (tsc --noEmit)
```

---

## Deployment

Deployed to Vercel as a static Vite SPA. The `vercel.json` at the project root configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The rewrite rule is essential — without it, navigating to any route other than `/` returns a 404 from Vercel's CDN since there are no actual files at those paths.
