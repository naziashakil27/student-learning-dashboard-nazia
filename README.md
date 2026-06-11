# Nova Learn — Student Learning Dashboard

> A premium, dark-themed learning dashboard built to feel like a real SaaS product. Track courses, log study streaks, visualize progress, and manage your entire learning journey — all in one place.

**Live Demo:** https://student-learning-dashboard-naziawork27-9979s-projects.vercel.app

**GitHub:** https://github.com/naziashakil27/student-learning-dashboard-nazia

---

## What Is This?

Nova Learn is a student learning dashboard that takes inspiration from products like Linear, Vercel, and Raycast. It's built with a deep obsidian dark theme, smooth spring animations, and a bento-grid layout that makes tracking your learning feel less like a chore and more like using a tool you actually enjoy.

It works out of the box with zero setup — no database, no API keys, nothing. Just open it and it runs using localStorage as a mock database. When you're ready to go live with real data, you drop in your Supabase credentials and it connects automatically.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript | Latest stable, full type safety |
| Build Tool | Vite 6 | Sub-second HMR, fast production builds |
| Styling | Tailwind CSS v4 | Utility-first, configured via CSS `@theme` |
| Animations | Framer Motion + GSAP | React tree animations + imperative canvas |
| Database | Supabase (PostgreSQL) | Managed Postgres with a great JS client |
| Fallback | localStorage | Works offline with no setup required |
| Icons | Lucide React | Clean, consistent icon set |
| Deployment | Vercel | CDN edge, zero config for Vite SPAs |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/naziashakil27/student-learning-dashboard-nazia.git
cd student-learning-dashboard-nazia

# 2. Install dependencies
npm install

# 3. Copy the env template
cp .env.example .env

# 4. Start the dev server
npm run dev
# Opens at http://localhost:3000
```

The app works immediately without filling in any environment variables. The localStorage fallback kicks in automatically and seeds it with four starter courses.

---

## Connecting Supabase (Optional)

If you want real persistent cloud data, create a `courses` table in your Supabase project:

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

-- Seed some starter data
INSERT INTO courses (title, progress, icon_name, description, category, difficulty) VALUES
('Advanced React Patterns', 68, 'Layers', 'Master Compound Components, Render Props, State Reducer, and concurrent rendering hooks.', 'Frontend Dev', 'Advanced'),
('TypeScript Mastery', 85, 'Code', 'Deep generics, lookup types, and decorators.', 'Languages', 'Advanced'),
('Framer Motion Fundamentals', 42, 'Sparkles', 'Dynamic physical constants, spring systems, layoutId.', 'Creative Dev', 'Intermediate'),
('System Design Basics', 15, 'FileCode', 'Explore load balancers, database replication, and rate limiters.', 'Architecture', 'Beginner');
```

Then add these two lines to your `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

That's it. No code changes needed — the app detects the credentials and switches to Supabase automatically.

---

## Environment Variables

See [`.env.example`](.env.example) for the full reference. The two that matter:

```
VITE_SUPABASE_URL        # Your Supabase project URL
VITE_SUPABASE_ANON_KEY   # Your public anon key (safe for browser use)
```

> Important: Never commit your actual `.env` file. It is already blocked by `.gitignore`. The `SUPABASE_SERVICE_ROLE_KEY` is server-side only and should never be exposed to the browser.

---

## Architecture

### Client-Only SPA

This is a pure client-side React app — no server, no API routes, no SSR. The decision was intentional:

- Supabase is accessed directly from the browser using the public anon key. This is safe because Supabase's Row Level Security handles access control at the database level.
- Vite outputs a fully static `dist/` folder. Vercel serves it from the CDN edge globally with zero cold starts.
- A rewrite rule in `vercel.json` (`/* → /index.html`) makes React's client-side routing work correctly on direct URL access and page refresh.

### Server / Client Split (Without Next.js)

Since this is a Vite SPA rather than Next.js, there are no literal Server Components. But the architecture deliberately mirrors that pattern:

- **Data layer (`src/lib/supabase/client.ts`)** acts as the "server layer." All Supabase queries, mutations, and seeding logic live here. No component ever calls Supabase directly — everything goes through `dbService`. This isolation means swapping the backend (to a Next.js API route, tRPC, or REST) requires zero component changes.
- **React components** are purely presentational. They receive data as props from `App.tsx`, which is the single state coordinator. No component owns its own data-fetching lifecycle.
- **Optimistic UI** — progress updates reflect instantly in the UI before the async Supabase call resolves, making interactions feel snappy even on slow connections.

### Offline-First Design

Every `dbService` method checks `isSupabaseConfigured()` before touching Supabase. If the env vars aren't set, all reads and writes go to localStorage using the exact same interface. The result:

- The app works 100% in a demo or sandboxed environment with zero configuration.
- First load seeds localStorage with four realistic courses.
- Switching to Supabase is a two-line `.env` change — no code changes, no migrations needed on the client side.

---

## Animation System

Two libraries handle animations, each for a specific job:

### Framer Motion — React Tree Animations

All React component animations use Framer Motion with spring physics:

- **Bento grid entrance** — `staggerChildren: 0.12` with `type: "spring", stiffness: 260, damping: 24` makes each card enter in a cascading wave
- **Page transitions** — `AnimatePresence` with `mode="wait"` handles tab switching with a clean fade + translate
- **Sidebar nav indicator** — `layoutId="active-nav"` creates the morphing highlight that slides between nav items, identical to how Linear and Stripe do it
- **Card hover effects** — `whileHover: { scale: 1.02, y: -1 }` with spring physics on every `GlowCard`
- **Progress bars** — animate from `0%` to the actual value on mount using `type: "spring", stiffness: 80, damping: 15`
- **Streak particle** — fire emoji scales up and floats out with `AnimatePresence` on every study log

### GSAP — Canvas and Imperative Animations

GSAP handles everything that lives outside the React tree:

- **AmbientCanvas** — a fullscreen `<canvas>` with 12–28 atmospheric particle blobs that drift slowly, react to mouse position, and parallax on scroll. GSAP's `ticker` hooks directly into `requestAnimationFrame` for zero-overhead rendering.
- **Mouse lerp** — `gsap.to(mouse, { x, y, duration: 1.0, ease: "power2.out" })` gives the particle tracking a smooth, physical lag
- **Magnetic buttons** — `gsap.to(el, { x: pullX, y: pullY })` on nav icons and CTA buttons creates the tactile magnetic pull effect

Keeping GSAP out of the React component tree means animations never trigger re-renders, and the canvas loop never competes with React's scheduler.

---

## Project Structure

```
student-learning-dashboard/
├── index.html                         # Entry point — title, meta tags
├── vite.config.ts                     # Vite + Tailwind plugin config
├── vercel.json                        # SPA rewrite rule for Vercel
├── .env.example                       # Environment variable reference
│
└── src/
    ├── App.tsx                        # Root coordinator — state, routing, data
    ├── main.tsx                       # React DOM entry point
    ├── index.css                      # Global styles, Tailwind v4 @theme tokens
    │
    ├── lib/
    │   ├── types.ts                   # Shared TypeScript interfaces
    │   └── supabase/
    │       └── client.ts              # dbService — Supabase + localStorage layer
    │
    └── components/
        ├── dashboard/
        │   ├── bento-grid.tsx         # Main grid with staggered entrance animation
        │   ├── hero-tile.tsx          # Welcome card, stats strip, streak widget
        │   ├── course-card.tsx        # Course tile with progress controls
        │   ├── animated-progress.tsx  # Spring-animated progress bar
        │   └── activity-tile.tsx      # GitHub-style learning heatmap
        │
        ├── layout/
        │   ├── sidebar.tsx            # Collapsible desktop sidebar
        │   └── mobile-nav.tsx         # Fixed bottom tab bar for mobile
        │
        ├── ui/
        │   ├── ambient-canvas.tsx     # GSAP canvas — particle background
        │   ├── glow-card.tsx          # Glassmorphic card with hover glow
        │   ├── magnetic.tsx           # GSAP magnetic cursor wrapper
        │   ├── lucide-icons.tsx       # Dynamic icon resolver by string name
        │   └── skeleton.tsx           # Shimmer skeleton loaders
        │
        └── views/
            ├── courses-view.tsx       # Course management — add, filter, delete
            ├── progress-view.tsx      # Analytics and progress breakdown
            ├── achievements-view.tsx  # Badge and milestone tracking
            └── settings-view.tsx      # User preferences, data reset, SQL helper
```

---

## Responsive Design

- **Desktop (1024px+):** Full sidebar + 4-column bento grid. Hero tile spans full width.
- **Tablet (768px–1024px):** Sidebar collapses to icon-only strip. Grid adjusts to 2 columns.
- **Mobile (< 768px):** Sidebar hidden. Fixed bottom navigation bar with spring-animated active indicator. Grid stacks to single column.

All breakpoints use Tailwind's responsive prefixes (`md:`, `lg:`). No JavaScript-based layout switching.

---

## Challenges

**Disk space during development**
The local machine had no space for `npm install` or `npm run build`. The solution was deploying directly via the Vercel REST API — source files are uploaded raw and Vercel's build servers handle the install and build entirely in the cloud.

**Tailwind v4 migration**
Tailwind v4 eliminates `tailwind.config.js`. All theme configuration moves into `index.css` using `@theme`. Custom fonts (`Inter`, `JetBrains Mono`) are registered as CSS variables. The `@tailwindcss/vite` plugin also replaces the PostCSS pipeline, which changes the setup significantly from v3.

**Two animation libraries coexisting**
Running Framer Motion inside React and GSAP on the canvas required careful cleanup. The `AmbientCanvas` `useEffect` returns a cleanup function that removes all GSAP ticker callbacks and event listeners on unmount to prevent memory leaks and stale animation loops.

**Vite `import.meta.env` typing**
Accessing `import.meta.env` in strict TypeScript mode requires type augmentation or a cast. The `(import.meta as any).env` pattern in `client.ts` avoids adding a global `vite-env.d.ts` declaration file while keeping the build error-free.

**Vercel deployment protection**
By default, Vercel enables SSO authentication on preview and new deployments. This had to be explicitly disabled in the project's Deployment Protection settings to make the site publicly accessible without a Vercel login.

---

## Scripts

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
npm run lint     # TypeScript type check (tsc --noEmit)
```

---

## Deployment

Deployed to Vercel as a static Vite SPA. The `vercel.json` at the project root handles framework detection and client-side routing:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The rewrite rule is essential. Without it, navigating directly to any route other than `/` returns a 404 because there are no actual files at those paths on the CDN — only `index.html` exists, and React handles routing client-side from there.

---

## License

MIT — free to use, fork, and build on.
