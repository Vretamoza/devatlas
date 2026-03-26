# devatlas — Project Context

## App Purpose

A curated, structured, and searchable "tech dictionary." Content is **admin-managed** (not user-generated) to ensure quality. Regular users have read-only access for exploration and discovery.

**Primary goal: information discovery and retrieval** — not content creation.

## User Roles

- **User (default)** — read-only: browse, search, filter, view resource details
- **Admin** — full CRUD: create, edit, delete resources. Hidden behind `/admin` route or conditionally rendered components. No full auth yet — use a flag or hidden route, but structure so auth can be added later without refactoring.

## Core Features

1. **Resource exploration** — list of resources with title, description, category, subcategory, tags, type; clicking opens the external URL
2. **Global search** — matches title, description, tags; results update responsively
3. **Filtering & navigation** — filter by category, subcategory, type; filters are combinable; browse broad → narrow progressively
4. **Category-based navigation** — selecting a category shows its subcategories and relevant resources
5. **Resource detail (lightweight)** — description, tags, notes visible without deep navigation
6. **Sorting** — by newest, title, rating; works alongside active filters
7. **Admin CRUD** — create/edit/delete resources; clearly separated from user browsing; prevent accidental actions
8. **Data fetching** — from Supabase (resources, categories, subcategories, tags); handle loading, empty, and error states; UI updates immediately after admin changes

## UX Principles (guide all UI decisions)

- Optimize for discovery — users find resources without knowing exact names
- Progressive disclosure — start broad, allow narrowing; avoid overwhelming options
- Scannable list view — enough metadata visible to judge relevance without clicking
- Search and filters always accessible
- Categories, subcategories, tags are always selected from existing values, never free-typed
- Admin actions clearly separated from browsing; safe from accidental edits/deletes
- Structure for future auth (admin/user roles) without coupling UI to current assumptions
- Core functionality first — defer AI/automation/integrations

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 + daisyUI v5 (CSS-first config, no tailwind.config.js)
- Design system: custom `devatlas` daisyUI theme in `src/index.css`
- Fonts: DM Sans (sans) + DM Mono (mono) via Google Fonts

## Database Schema (`schema.sql`)

PostgreSQL via Supabase (uses `pgcrypto` for UUIDs).

### Tables

**`categories`** — top-level resource categories (e.g. Frontend, Backend, DevOps, AI)
- `id` uuid PK
- `name` text unique
- `created_at`

**`subcategories`** — belong to a category
- `id` uuid PK
- `name` text
- `category_id` uuid FK → categories (cascade delete)
- unique on (name, category_id)

**`resources`** — the core entity (links/tools/articles/videos)
- `id` uuid PK
- `title` text
- `description` text (nullable)
- `url` text
- `type` enum: `documentation | tool | article | video`
- `category_id` uuid FK → categories (set null on delete)
- `subcategory_id` uuid FK → subcategories (set null on delete)
- `is_favorite` boolean (default false)
- `status` enum: `pending | learned` (default pending)
- `rating` int 1–5 (nullable)
- `notes` text (nullable)
- `created_at`, `updated_at` (auto-updated via trigger)

**`tags`** — free-form labels
- `id` uuid PK
- `name` text unique

**`resource_tags`** — many-to-many join between resources and tags
- `resource_id` FK → resources (cascade)
- `tag_id` FK → tags (cascade)
- PK: (resource_id, tag_id)

## UI & Styling Rules

### Component library
- **Use daisyUI components by default** for every UI element: `btn`, `card`, `badge`, `input`, `select`, `modal`, `drawer`, `navbar`, `menu`, `dropdown`, `table`, `skeleton`, `alert`, `tooltip`, etc.
- Only write custom CSS when daisyUI has no equivalent. Prefer daisyUI modifier classes (`btn-primary`, `btn-sm`, `card-compact`, etc.) over ad-hoc Tailwind utility combinations.
- Use daisyUI semantic color classes (`text-primary`, `bg-base-200`, `border-base-300`) — never hardcode hex values or raw Tailwind color classes like `bg-purple-600`.

### Visual style
- **Minimalistic** — whitespace over decoration. No gradients, shadows only where daisyUI applies them by default, no heavy borders.
- Surfaces use `bg-base-100` / `bg-base-200`. Avoid stacking too many background layers.
- Use `badge` for tags/type labels, `kbd` for shortcuts, `divider` for section breaks — lean on semantic daisyUI elements.
- Iconography should be consistent (pick one icon library and stick to it across the entire app).

### Responsiveness
- Every layout must work on mobile, tablet, and desktop.
- Use daisyUI's `drawer` for mobile nav, `navbar` for top bar, responsive `grid` or `flex` for content areas.
- Test every new feature at all breakpoints before considering it done.

### Visual consistency
- Every new page/feature must reuse the same layout shell, spacing rhythm, and component patterns as existing pages.
- No feature should look "dropped in" — if it introduces a new pattern, that pattern must be applied retroactively to similar existing UI.
- Use the same card structure for every resource item, the same badge style for every tag, the same button hierarchy everywhere.

### Seed data
Categories: Frontend, Backend, DevOps, AI
Subcategories: Frameworks, Component Libraries (Frontend) · API REST, Authentication (Backend) · CI/CD, Docker (DevOps) · LLMs (AI)
