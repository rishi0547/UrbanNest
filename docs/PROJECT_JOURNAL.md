# UrbanNest Engineering Journal

A living document tracking the technical evolution, architectural decisions, sprint milestones, and engineering notes for the **UrbanNest** modern furniture and home decor e-commerce platform.

---

## 1. Project Overview & Vision

**UrbanNest** is a performance-first, design-centric e-commerce platform specializing in contemporary furniture, lighting, and interior accents.

- **Primary Business Goal**: Deliver a frictionless luxury shopping experience with sub-second page transitions, dynamic product customization, persistent cross-device carts, and a streamlined checkout flow.
- **Target Tech Stack**:
  - **Framework**: Next.js 16 (App Router with React 19 Server Components)
  - **Database & Auth**: Supabase (PostgreSQL, Row Level Security, SSR Cookie-based Auth)
  - **Styling**: Tailwind CSS v4, CSS variables (OKLCH color space), ShadCN UI ("base-nova" / Base UI)
  - **State Management**: Zustand (Client UI & Cart), TanStack Query v5 (Server Data Cache)
  - **Monorepo Tooling**: Turborepo, pnpm workspaces, TypeScript 7

---

## 2. Milestone Tracking

| Milestone | Focus Area | Status | Target Completion | Key Deliverables |
| :--- | :--- | :---: | :---: | :--- |
| **M0: Foundation & Cleanup** | Repo Architecture | **COMPLETED** | Week 15 (Day 1) | Boilerplate pruned, standard `cn` utility, font optimization, scalable directory layout |
| **M1: Supabase Setup** | Data Infrastructure | **COMPLETED** | Week 15 (Day 2) | `@supabase/ssr` installed, browser/server/middleware clients initialized, `.env.example` |
| **M2: Database Schema & Seed** | Catalog & Profiles | **COMPLETED** | Week 15 (Day 3) | PostgreSQL 5-table MVP schema, performance indexes, RLS policies, seed catalog data |
| **M3: Product Discovery** | Catalog & Filtering | **COMPLETED** | Week 15 (Day 7) | Grid layout, faceted search, category routing, responsive product cards, TanStack Query |
| **M4: Cart & Session Engine** | Zustand + LocalStorage | **COMPLETED** | Week 15 (Day 8) | Persistent cart store, SSR hydration wrapper, real-time navbar badge, `/cart` view |
| **M5: Checkout & Orders** | Order Pipeline & History | **COMPLETED** | Week 15 (Day 9) | Atomic Server Action order placement, line items, stock validation, `/checkout`, `/orders` |
| **M6: Admin Back-Office** | Operations & Fulfillment | **COMPLETED** | Week 15 (Day 9) | Product CRUD, image storage, fulfillment table, inline status controls, `/admin/orders` |
| **M7: Storefront Redesign** | Brand Aesthetics & Polish | **COMPLETED** | Week 15 (Day 10) | Natura-inspired luxury furniture homepage, Playfair Display + Inter typography, warm luxury palette, 10 sections |

---

## 3. Architectural Decision Records (ADRs)

### ADR-001: Feature-Sliced Modular Directory Structure
- **Context**: The default `apps/web` structure flattened all pages, components, and utilities at the root, making long-term growth disorganized.
- **Decision**: Implemented a feature-sliced directory structure (`features/auth`, `features/products`, `features/cart`, `features/orders`, `features/admin`) alongside shared UI libraries (`components/ui`, `components/layout`, `components/shared`).
- **Consequences**:
  - *Positive*: Clear bounded contexts, high cohesion, easy isolation when refactoring.
  - *Trade-off*: Slightly deeper folder paths, requires discipline to avoid circular imports between features.

### ADR-002: Tailwind CSS v4 & Standardized `cn` Utility
- **Context**: The project was scaffolded with Tailwind v4 `@theme inline` and an external non-standard npm package `cn` (`^0.2.5`) that lacked `tailwind-merge` conflict resolution.
- **Decision**: Removed `cn` package. Installed `clsx` and `tailwind-merge`, and standardized `apps/web/lib/utils.ts` to `twMerge(clsx(...))`.
- **Consequences**:
  - *Positive*: Allows class overrides (e.g., `px-2` overridden by `px-4` inside child components) without CSS specificity bugs.
  - *Trade-off*: Small additional runtime overhead for string merging, which is negligible for UI components.

### ADR-003: SSR-First Supabase Authentication with Async Cookies
- **Context**: Next.js 15 & 16 transitioned `cookies()` from `next/headers` into an asynchronous function returning a Promise. Traditional synchronous Supabase helpers throw runtime errors.
- **Decision**: Implemented `@supabase/ssr` with `await cookies()`, utilizing batch `getAll` and `setAll` handlers, coupled with an active middleware session refresher.
- **Consequences**:
  - *Positive*: Fully compliant with Next.js 16, zero hydration auth flickering, secure HTTP-only cookie storage.
  - *Trade-off*: Any server component calling `createClient()` must be asynchronous.

### ADR-004: Dual-Tier State Management Strategy
- **Context**: E-commerce applications handle both remote server state (products, user orders) and immediate client state (cart drawer toggle, optimistic item counters).
- **Decision**:
  - **TanStack Query v5**: Server state caching, background revalidation, query invalidation.
  - **Zustand**: Fast, lightweight client-side state with `persist` middleware for the local shopping cart and UI flags.
- **Consequences**:
  - *Positive*: Clean separation of concerns; no unnecessary network round-trips for modal/drawer toggles.

### ADR-005: Lean 5-Table Core MVP Schema
- **Context**: Early-stage e-commerce schemas often suffer from premature complexity by adding coupons, multi-tier reviews, wishlists, and raw payment token tables before basic order pipelines stabilize.
- **Decision**: Constrained the core database to 5 essential entities (`profiles`, `categories`, `products`, `orders`, `order_items`).
- **Consequences**:
  - *Positive*: High engineering velocity, clean relational integrity, simple RLS policies, zero redundant tables.
  - *Trade-off*: Reviews and wishlists deferred to Post-MVP milestones.

### ADR-006: Server Actions for Auth Mutations & Edge Middleware Route Guards
- **Context**: In Next.js App Router, auth forms can either submit via client-side REST route handlers (`/api/auth/*`) or via native Server Actions.
- **Decision**: Implemented authentication via Server Actions (`features/auth/actions.ts`) with React Hook Form + Zod on the client, and route guard redirects in `middleware.ts`.
- **Consequences**:
  - *Positive*: Direct cryptographic cookie access on the server, zero API boilerplate, automatic layout cache revalidation with `revalidatePath`.
  - *Trade-off*: Requires client components to manage submission pending states with `isSubmitting` and transitions.

### ADR-007: Database-Backed RBAC via `profiles.role` with Server Guard Utilities
- **Context**: Authorization tiers (`admin` vs `customer`) can either be encoded into JWT custom claims (`app_metadata`) or stored directly in the database `profiles.role` column.
- **Decision**: Stored roles in `public.profiles.role` backed by database check constraint `CHECK (role IN ('customer', 'admin'))` and implemented server-side guard helpers in `features/auth/roles.ts` (`isAdmin()`, `isCustomer()`, `requireAdmin()`, `requireAuth()`), enforced at both edge middleware and server components.
- **Consequences**:
  - *Positive*: Instantaneous role updates via SQL without waiting for JWT token refresh cycles, simple SQL updates for staff promotion/demotion, and direct alignment with PostgreSQL RLS policies.
  - *Trade-off*: Admin route checks perform a database lookup for the user profile.

### ADR-008: Admin Product CRUD via Server Actions & Direct Supabase Storage
- **Context**: Managing product records and high-resolution assets requires secure admin authorization, asset storage, and instant cache updates across the Next.js Data Cache.
- **Decision**: Implemented product CRUD via Server Actions (`createProductAction`, `updateProductAction`, `deleteProductAction`) guarded by `requireAdmin()`, with image uploads directed straight to Supabase Storage (`product-images` bucket) via `@supabase/ssr` browser client. Product images are stored as `TEXT[]` in PostgreSQL `products.images`.
- **Consequences**:
  - *Positive*: Zero serverless function timeout or memory bottleneck on binary uploads, immediate Next.js Data Cache invalidation via `revalidatePath`, and complete client/server Zod schema alignment.
  - *Trade-off*: Client must handle direct storage uploads before invoking the final Server Action mutation.

### ADR-009: TanStack Query SSR Hydration Architecture for Customer Catalog
- **Context**: The storefront catalog must deliver fast initial paints for customer SEO while enabling instant client-side filtering, searching, and sorting without full page reloads or hydration mismatch.
- **Decision**: Implemented TanStack Query v5 with a singleton `getQueryClient()` helper, server prefetching via `queryClient.prefetchQuery()`, and client-side hydration via `<HydrationBoundary state={dehydrate(queryClient)}>`. Hierarchical query keys (`productQueryKeys`) provide granular cache invalidation.
- **Consequences**:
  - *Positive*: Full server-rendered HTML for search engine crawlers, instant client-side transitions on category filter tabs without spinners, and zero redundant network waterfalls.
  - *Trade-off*: Requires separate client-safe API functions (`createBrowserClient`) to ensure server modules like `next/headers` are never imported into client component bundles.

### ADR-010: Zustand Persistent Shopping Cart with LocalStorage & Hydration Safety
- **Context**: Shoppers expect their cart contents to persist across page refreshes, tab closures, and navigation without forcing an upfront database write or sign-in requirement.
- **Decision**: Implemented client-side cart state using **Zustand v5** combined with the `persist` middleware configured for `localStorage` (`urbannest-cart-storage`). Created a custom hydration-safe `useCart()` hook that returns predictable defaults during SSR, avoiding React 19 / Next.js 16 hydration mismatches.
- **Consequences**:
  - *Positive*: Zero network latency for quantity adjustments and item additions; instantaneous badge updates in the navigation header; offline and guest cart capability.
  - *Trade-off*: Cart items must be reconciled with real-time stock and prices upon proceeding to checkout.

### ADR-011: Atomic Checkout Pipeline & Relational Order Line Items
- **Context**: Placing an order requires validating customer shipping credentials, recalculating line items and tax/shipping against server-authoritative catalog prices, verifying stock availability, inserting an order record, inserting all child order items, decrementing product inventory, and clearing client cart state without race conditions.
- **Decision**: Implemented `createOrderAction` in `features/orders/actions.ts` executing the complete order placement sequence server-side with `requireAuth()`. Order items capture `price_at_purchase` to protect historical audit trails against future product price shifts. Order statuses follow a deterministic state machine (`pending` -> `processing` -> `shipped` -> `delivered`, with `cancelled` as terminal abort), manageable by admins through `updateOrderStatusAction` guarded by `requireAdmin()`.
- **Consequences**:
  - *Positive*: Client manipulation of prices/totals is impossible; stock depletion is verified prior to commitment; clean separation between dynamic catalog and immutable order history.
  - *Trade-off*: Multi-step writes in Server Actions execute sequentially against Supabase REST client without direct raw SQL transaction blocks, mitigated by immediate rollback error handling.

---

## 4. Current Log & Daily Entries

### Entry: Week 15 (Day 2) - Architecture Refactoring & Supabase Foundation
- **Tasks Executed**:
  - Purged unused Turborepo boilerplate (`page.module.css`, template SVGs, unused local Geist WOFF files).
  - Configured Google `next/font/google` Geist font directly in `layout.tsx`.
  - Replaced faulty `cn` package with `clsx` + `tailwind-merge`.
  - Created scalable folders (`features/`, `components/`, `lib/`, `hooks/`, `providers/`, `stores/`, `types/`).
  - Added `@supabase/supabase-js` and `@supabase/ssr`.
  - Created `client.ts`, `server.ts`, and `middleware.ts`.
  - Verified `pnpm check-types`, `pnpm lint`, and `pnpm build` (all passed).

### Entry: Week 15 (Day 3) - Core MVP Database Schema & RLS Architecture
- **Tasks Executed**:
  - Designed the complete 5-table PostgreSQL schema for UrbanNest MVP (`profiles`, `categories`, `products`, `orders`, `order_items`).
  - Implemented automatic profile sync via `auth.users` trigger (`handle_new_user`).
  - Implemented automatic timestamp trigger (`handle_updated_at`).
  - Added performance B-tree indexes for foreign keys, slugs, and featured flags.
  - Formulated complete Row Level Security (RLS) policies for public, customer, and admin roles.
  - Created seed data for initial furniture categories and luxury products.
- **Decisions Made**: Adopted ADR-005 (Lean 5-Table Core MVP Schema).
- **Bugs Found**: None.
- **Fixes Applied**: None.

### Entry: Week 15 (Day 4) - Authentication & Route Protection
- **Tasks Executed**:
  - Installed `react-hook-form` and `@hookform/resolvers`.
  - Created ShadCN UI primitives: `Input`, `Label`, `Card` (`CardHeader`, `CardTitle`, `CardContent`, etc.).
  - Created Zod validation schemas in `features/auth/schemas.ts` (`loginSchema`, `registerSchema`).
  - Created Server Actions in `features/auth/actions.ts` (`loginAction`, `registerAction`, `logoutAction`).
  - Built interactive client components: `LoginForm`, `RegisterForm`, `LogoutButton`.
  - Implemented `/login`, `/register`, and protected `/profile` routes.
  - Configured Next.js root `middleware.ts` with session token refreshing and route protection redirects.
  - Authored comprehensive authentication architecture guide in `docs/AUTH_FLOW.md`.
  - Verified TypeScript checks, ESLint, and production builds (`next build` compiled in 10.7s with 7 static/dynamic routes).
- **Decisions Made**: Adopted ADR-006 (Server Actions for Auth Mutations & Edge Middleware Route Guards).
- **Bugs Found**: None.
- **Fixes Applied**: None.

### Entry: Week 15 (Day 5) - Role-Based Authorization (RBAC)
- **Tasks Executed**:
  - Created role management utilities in `features/auth/roles.ts` (`isAdmin`, `isCustomer`, `requireAdmin`, `requireAuth`).
  - Created protected `/admin` executive operations center dashboard.
  - Integrated role checking in Edge Middleware (`apps/web/lib/supabase/middleware.ts`): unauthenticated visitors are redirected to `/login?redirectTo=/admin`, and customers are redirected to `/`.
  - Added Section 8 in `docs/SQL_QUERIES.sql` for promoting and demoting users via SQL (`UPDATE public.profiles SET role = 'admin' ...`).
  - Authored comprehensive role architecture and flow guide in `docs/ROLE_FLOW.md`.
  - Updated documentation across `PROJECT_JOURNAL.md`, `FEATURES.md`, and `INTERVIEW_NOTES.md`.
  - Verified TypeScript compilation, ESLint, and production build (`next build` compiled in 6.0s with `/admin` dynamic route).
- **Decisions Made**: Adopted ADR-007 (Database-Backed RBAC via `profiles.role` with Server Guard Utilities).
- **Bugs Found**: None.
- **Fixes Applied**: None.
- **Next Focus**: Build the Admin Product Management System (`features/products`).

### Entry: Week 15 (Day 6) - Admin Product Management System & Supabase Storage
- **Tasks Executed**:
  - Installed and styled ShadCN UI primitives: `Textarea` and `Badge` (`default`, `secondary`, `destructive`, `outline`, `success`).
  - Created product Zod validation schema in `features/products/schemas.ts` (`productSchema`, `generateSlug`).
  - Created Supabase Storage helper in `lib/supabase/storage.ts` (`uploadProductImage`) for the `product-images` bucket with type checking and 5MB limits.
  - Implemented secure admin Server Actions in `features/products/actions.ts` (`createProductAction`, `updateProductAction`, `deleteProductAction`), enforcing `requireAdmin()`, schema mapping, and `revalidatePath`.
  - Built full-featured client component `ProductForm` supporting both Create and Edit modes, auto-slug generator, category selector, image upload, and error alerts.
  - Built interactive `DeleteProductButton` client component with inline confirmation state.
  - Implemented `/admin/products` catalog data table showing thumbnails, prices, inventory levels, category badges, publication status, and quick actions.
  - Implemented `/admin/products/new` for catalog item creation.
  - Implemented `/admin/products/[id]` for dynamic product editing with `notFound()` safety.
  - Added Section 9 in `docs/SQL_QUERIES.sql` for `product-images` bucket creation and Storage RLS policies.
  - Updated `DATABASE_SCHEMA.md`, `FEATURES.md`, `INTERVIEW_NOTES.md`, and `PROJECT_JOURNAL.md`.
  - Verified `check-types`, `lint`, and production `build`.
- **Decisions Made**: Adopted ADR-008 (Admin Product CRUD via Server Actions & Direct Supabase Storage).
- **Bugs Found**: None.
- **Fixes Applied**: None.
- **Next Focus**: Build Customer Storefront Product Listing & Dynamic Filtering (`features/products`).

### Entry: Week 15 (Day 7) - Customer Product Catalog & TanStack Query Foundation
- **Tasks Executed**:
  - Created singleton `getQueryClient()` factory in `lib/query-client.ts` with Next.js App Router guidelines (`isServer` check, pending query dehydration, 1-minute stale time).
  - Created global `<QueryProvider>` in `providers/query-provider.tsx` and wrapped `RootLayout` in `app/layout.tsx`.
  - Built product catalog feature layer in `features/products/catalog/`: `types.ts`, `query-keys.ts`, `api.ts`, `queries.ts`.
  - Implemented `useProducts`, `useProductBySlug`, `useFeaturedProducts`, and `useCategories` hooks.
  - Built luxury customer UI components: `StorefrontNav`, `ProductCard`, `ProductGrid`, and `ProductDetailsView` with interactive image gallery and Add to Cart placeholder.
  - Created `/products` catalog listing route with server-side TanStack Query prefetching and `HydrationBoundary`.
  - Created `/products/[slug]` dynamic details route with dynamic OpenGraph metadata and server prefetching.
  - Updated homepage with storefront hero, featured products preview, and navigation.
  - Resolved App Router bundle boundary by decoupling client queries from server headers.
  - Verified `check-types` (0 errors), `lint` (0 warnings), and `build` (10 routes compiled in 2.0s with Turbopack).
- **Decisions Made**: Adopted ADR-009 (TanStack Query SSR Hydration Architecture for Customer Catalog).
- **Bugs Found**: Turbopack build error on `next/headers` import trace when dynamic `server.ts` was referenced in client-reachable code.
- **Fixes Applied**: Decoupled `features/products/catalog/api.ts` to rely on browser/universal client, eliminating `next/headers` from client chunk trees.
- **Next Focus**: Shopping Cart Architecture with Zustand & LocalStorage Sync (`features/cart`).

### Entry: Week 15 (Day 8) - Zustand Shopping Cart & Live Storefront Integration
- **Tasks Executed**:
  - Built persistent Zustand cart store in `features/cart/cart-store.ts` (`items`, `totalItems`, `subtotal`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`).
  - Created hydration-safe `useCart` wrapper hook to eliminate SSR hydration mismatches.
  - Built dynamic client `CartBadge` component and mounted it into `storefront-nav.tsx` for real-time navbar updates.
  - Connected Product Details view (`ProductDetailsView`) "Add to Cart" button to the Zustand store with interactive toast feedback and "View Cart" shortcut.
  - Built full-featured customer `/cart` page with line item thumbnails, quantity controls with stock caps, subtotal calculation, free shipping progress bar ($500 threshold), and empty cart state.
  - Verified `check-types`, `lint`, and production `build` (compiled cleanly in 4.5s with Turbopack, generating `/cart` route).
- **Decisions Made**: Adopted ADR-010 (Zustand Persistent Shopping Cart with LocalStorage & Hydration Safety).
- **Bugs Found**: None.
- **Fixes Applied**: None.
- **Next Focus**: Order Processing & Checkout System (`features/orders`).

### Entry: Week 15 (Day 9) - Checkout, Orders System & Admin Fulfillment
- **Tasks Executed**:
  - Created complete orders feature module in `features/orders/`:
    - `types.ts`: `OrderStatus`, `ShippingAddress`, `OrderItemProduct`, `OrderItem`, `Order`.
    - `schemas.ts`: Zod validation for shipping addresses (`shippingAddressSchema`) and checkout input (`checkoutOrderSchema`).
    - `query-keys.ts`: Hierarchical TanStack Query keys (`orderQueryKeys.all`, `orderQueryKeys.user()`, `orderQueryKeys.admin()`, `orderQueryKeys.detail(id)`).
    - `api.ts`: Client-safe order fetchers (`getUserOrders`, `getAdminOrders`, `getOrderById`).
    - `queries.ts`: TanStack Query hooks (`useUserOrders`, `useAdminOrders`, `useOrderDetail`).
    - `actions.ts`: Atomic Server Actions `createOrderAction` (server-side price reconciliation, stock validation & decrement, order + line items persistence, cache revalidation) and `updateOrderStatusAction` (admin status transition).
  - Built customer checkout page `/checkout` with React Hook Form + Zod, live order breakdown, and automated cart clearance upon completion.
  - Built customer order history page `/orders` with celebration banner, receipt breakdown, status badges, and shipping destination cards.
  - Built admin order operations console `/admin/orders` with live metrics, search filter, status filter tabs, and inline status dropdown triggers.
  - Updated executive admin dashboard (`/admin`) to show dynamic pending orders counter and active link to fulfillment pipeline.
  - Added "My Orders" link to `storefront-nav.tsx` for logged-in customers.
  - Updated project documentation across `PROJECT_JOURNAL.md`, `FEATURES.md`, `DATABASE_SCHEMA.md`, and `INTERVIEW_NOTES.md`.
  - Verified `check-types`, `lint`, and production `build` (`next build` compiled cleanly in Turbopack).
- **Decisions Made**: Adopted ADR-011 (Atomic Checkout Pipeline & Relational Order Line Items).
- **Bugs Found**: PostgreSQL error `42P17: infinite recursion detected in policy for relation "profiles"`. Caused by RLS policies directly querying `public.profiles` inside `public.profiles` policy definitions.
- **Fixes Applied**: Created `public.is_admin()` function with `SECURITY DEFINER STABLE` to safely bypass RLS on `public.profiles` when checking admin privileges, and updated all policies in `docs/SQL_QUERIES.sql` to call `public.is_admin()`.
- **Next Focus**: Multi-category facets, stripe/payment webhook integration, and verified buyer reviews.

### Entry: Week 15 (Day 10) - Luxury Furniture Brand Homepage Redesign (Natura-Inspired)
- **Tasks Executed**:
  - Engineered complete high-end luxury furniture storefront architecture inspired by the Natura Furniture reference, replacing the initial generic SaaS-style landing page.
  - Configured typography: integrated Google Fonts `Playfair Display` (serif, `--font-heading`) for titles/headlines and `Inter` (sans-serif, `--font-sans`) for body copy in `apps/web/app/layout.tsx`.
  - Implemented exact luxury color system in `apps/web/app/globals.css`:
    - Background: `#F8F6F2` (warm cream)
    - Primary: `#5D6B4D` (botanical forest olive)
    - Foreground: `#1A1A1A` (warm charcoal)
    - Border: `#E5E2DC` (warm soft stone)
    - Card: `#FFFFFF`
  - Created reusable `MotionWrapper` (`components/home/motion-wrapper.tsx`) leveraging `framer-motion` for scroll-triggered viewport fade-ups.
  - Implemented 10 modular sections under `components/home/`:
    1. **Navbar (`StorefrontNav`)**: 1280px container, Playfair Display brand logo, active Home pill button, category links, search icon, profile, and dynamic cart badge.
    2. **Hero Section (`HeroSection`)**: 40/60 split layout, Playfair Display heading ("Crafted for Comfort. Made for Life."), description, dual CTA buttons ("Shop Now →" & "Explore Collections"), 25k+ customer avatar strip, high-res lifestyle imagery, and floating 4.9★ rating info card.
    3. **Categories Section (`CategoriesSection`)**: 8 equal-spaced category cards (Sofas, Chairs, Tables, Beds, Storage, Lighting, Decor, Outdoor) with soft rounded containers and hover scale animations.
    4. **Best Sellers ("Our Most Loved Pieces") (`FeaturedCollection`)**: Left intro content block with "View All Products →" CTA, right header with carousel controls, and 4 clean, compact product cards displaying live Supabase data, ratings, wishlist buttons, and color swatches.
    5. **Promo Banner (`PromoBanner`)**: Full-width rounded banner (`rounded-[28px]`) with dark botanical olive background, "Up to 30% Off" heading, and "Shop Sale →" CTA paired with lifestyle interior photography.
    6. **Features / Trust Badges (`TrustBadges`)**: 4-column equal grid in a soft white container highlighting Free Shipping, 30-Day Returns, Secure Payments, and 24/7 Support with consistent icon sizing.
    7. **Inspiration Section (`InspirationSection`)**: Left intro text block and right 3-column article cards with lifestyle imagery, category badges, and reading times.
    8. **Testimonials Section (`TestimonialsSection`)**: Centered heading ("Real homes. Real stories."), top-right navigation arrows, and 3 equal-height testimonial cards with quote marks, avatar circles, verified buyer names, and pagination indicators.
    9. **Newsletter Section (`NewsletterSection`)**: Deep olive green rounded container with mail icon, Playfair heading, and an aligned white pill input with circular submit button.
    10. **Footer (`SiteFooter`)**: Four-column luxury layout on warm light cream background with brand wordmark, social icons, shop links, company links, customer service links, and a direct Need Help contact panel.
  - Verified compilation: `pnpm --filter web check-types` passed with 0 errors; `pnpm --filter web build` generated all production routes with Turbopack in 31s.
  - Performed browser visual verification across all sections using `browser_subagent` and direct screenshot inspection.
- **Decisions Made**: Adopted ADR-012 (Luxury Furniture Brand Design System & Natura-Inspired Homepage Architecture).
- **Next Focus**: Live payment gateways (Stripe/Razorpay), product review submission, and multi-image interactive carousel on details page.
