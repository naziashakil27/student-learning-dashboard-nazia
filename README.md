# Nova Learn — Student Learning Dashboard

Nova Learn is a premium, high-velocity, dark-themed Student Learning Dashboard inspired by top tier SaaS platforms like **Linear**, **Vercel**, **Stripe**, **Raycast**, and **Arc Browser**. Designed with rigorous craftsmanship, modular TypeScript structures, and high-performance spring mechanics, it is fully internship-hire ready.

---

## 🚀 Key Visual Architecture Decisions

### 1. Unified Visual Aura
We avoided standard saturated purple gradients and generic card boards in favor of a **deep space obsidian slate** aesthetic (`#09090B`). Custom subtle radial glows represent active state changes, soft glassmorphic backdrops offer layered depth, and a fine grain mesh noise texture overlay produces high-end tactile quality.

### 2. Client vs Server Bridging
The dashboard is fully built for a production-ready **React + Vite single-page application** environment (supporting port `3000` inside our sandboxed container) but mirrors standard Next.js directory modularity:
* **Server-Component Data-Oriented Principles**: Fetching and mutating logic takes place systematically through isolated database service layers (`src/lib/supabase/client.ts`). The main context acts as the centralized coordinator, flowing raw data as safe props to interactive components.
* **Synchronized Skeleton State Loading**: To avoid layout shifts and optimize Cumulative Layout Shift (CLS), we built premium animated shimmer card skeletons. Swapping tab views triggers a micro-sync database delay, demonstrating these shimmering pulse blocks before rendering final bento layouts.

### 3. Infinite Persistence Failover
To guarantee 100% interactive fidelity directly out-of-the-box in sandbox states without crashing on empty environment configurations:
* **Real Cloud Supabase integration ready**: Whenever `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` secrets are detected, the system immediately binds mutations and lists to your live PostgreSQL database instances.
* **Intuitive LocalStorage Database Mock**: If no keys are set, it boots a high-fidelity mock datastore seeded with classic masteries ("Advanced React Patterns", "TypeScript Mastery"), supporting adding, deletion, study streaks, and progress changes with total persistence.

---

## 🎨 Interactive Animation Strategy

Every interactive node leverages core **Framer Motion spring mechanics** rather than sluggish linear easing interpolation to produce a smooth, tactile, physical behavior:
* **Hover Micro-Animations**: Card elements scale slightly (`scale: 1.02`), shift upward on the y-axis, and emit an ambient radial glow spotlight with responsive springs (`stiffness: 350`, `damping: 22`).
* **Staggered Page entrance load**: Dashboard grid cells enter in an elegant orchestrated wave (`staggerChildren` of `0.12s`). Cells transition dynamically: `opacity: 0 -> 1` and `translateY: 20 -> 0`, maintaining near-zero Cumulative Layout Shift (CLS).
* **Sliding Layout morphing highlights**: Navigating tabs on desktop or mobile utilizes Framer Motion's advanced `layoutId="active-nav"` and `layoutId="active-mobile-nav"`. Active selectors morph and slide fluidly between anchors, similar to Linear or Stripe's premium sidebar rails.
* **Streak ignition sparks**: Logging a study hour triggers an instant orange fire particle puff animation that scales up and floats out of bounds, while bouncing the active daily count.

---

## 🗄️ Supabase Schema & Database Integration

### テーブル定義 (SQL DDL)
To connect your own remote Supabase database, execute the following SQL statement in the **Supabase SQL Editor**:

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

-- Seed Initial Data
INSERT INTO courses (title, progress, icon_name, description, category, difficulty) VALUES
('Advanced React Patterns', 68, 'Layers', 'Master Compound Components, Render Props, State Reducer, and concurrent rendering hooks.', 'Frontend Dev', 'Advanced'),
('TypeScript Mastery', 85, 'Code', 'Deep generics, lookup types, and decorators.', 'Languages', 'Advanced'),
('Framer Motion Fundamentals', 42, 'Sparkles', 'Dynamic physical constants, spring systems, layoutId.', 'Creative Dev', 'Intermediate'),
('System Design Basics', 15, 'FileCode', 'Explore load balancers, database replication, and rate limiters.', 'Architecture', 'Beginner');
```

---

## 🖥️ Responsive Design Choices

* **Desktop View (>1024px)**: Full bento display. Hero Tile occupies a full row span, flanked by individual masteries and custom heatmaps. The collapsible side launcher is persistent, expanding or retracting based on user preferences.
* **Tablet View (768px-1024px)**: Dual-column layout. The vertical sidebar retracts to a space-efficient icon-only strip, maximizing spatial efficiency for studying details.
* **Mobile View (<768px)**: 100% native mobile feel. Elements stack neatly into a single contiguous column. The side menus are removed in favor of a modern, sleek bottom tab navigation bar configured for rapid thumb touch targets.

---

## ⚡ Performance Optimization & UX Safeguards

1. **Hardware Acceleration**: Animations strictly adjust `transform` and `opacity` properties to trigger hardware GPU layers, completely preventing expensive CPU restyles or layout shifts.
2. **Flexible Type Casting**: Refactored `import.meta` evaluation to avoid build-time TypeScript compiler hurdles, ensuring standalone compatibility with multiple environments.
3. **No Unrequested Clutter**: Avoided simulated telemetry data, artificial terminal debug text, or unnecessary margins. The design respects negative space, prioritizing readability, typography, and clean contrast.
