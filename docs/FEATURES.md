# UrbanNest Feature Specifications & Product Roadmap

Comprehensive functional breakdown, user stories, acceptance criteria, and implementation checklists for **UrbanNest**.

---

## 1. Feature Breakdown & User Stories

### Feature 1: Authentication & User Profiles (`features/auth`)
- **User Story**: As a shopper, I want to securely sign up, log in, or use Google OAuth so that my cart, shipping addresses, and order history persist across sessions.
- **Key Capabilities**:
  - Email + Password registration & login with Supabase Auth.
  - Social authentication (Google OAuth).
  - Auto-creation of a corresponding `profiles` record via PostgreSQL trigger.
  - Password reset via secure magic link / reset email.
  - Role-based routing (`customer` vs. `admin`).
- **Acceptance Criteria**:
  - Passwords must be at least 8 characters with at least one number and special character (validated via Zod).
  - Session tokens refresh seamlessly via Next.js middleware without layout flicker.
  - Non-authenticated users accessing `/profile` or `/orders` are redirected to `/login?redirectTo=...`.

---

### Feature 2: Product Catalog & Discovery (`features/products`)
- **User Story**: As a customer looking for home furnishings, I want to filter products by category, material, and price range, and sort by price/popularity so that I can quickly find items fitting my space.
- **Key Capabilities**:
  - Category hierarchy navigation (`/category/living-room`, `/category/bedroom`, etc.).
  - Faceted sidebar filters: Price slider, material multi-select, in-stock only toggle.
  - Server-driven URL query state synchronization (`?category=living-room&sort=price_asc&min=500&max=2000`).
  - Search bar with debounced input querying product titles and descriptions.
  - Responsive product cards with lazy-loaded thumbnails, hover image previews, and quick add-to-cart.
- **Acceptance Criteria**:
  - Filter changes update the URL query string without a full page reload.
  - Initial load renders via Server Components for SEO; subsequent filter changes use TanStack Query for instant UI updates.
  - Out-of-stock items display an unobtrusive "Sold Out" overlay and disable quick-add.

---

### Feature 3: Product Detail Experience (`features/products`)
- **User Story**: As a buyer, I want to see detailed dimensions, materials, multiple high-res angles, and customer reviews so that I can make a confident purchasing decision.
- **Key Capabilities**:
  - Multi-image gallery with interactive thumbnail selector and zoom on hover.
  - Structured technical specs: Dimensions (W x D x H), weight, primary materials, care instructions.
  - Real-time stock status badge ("In Stock", "Only 3 left!", "Backorder").
  - Verified buyer reviews breakdown with average star rating and review submission modal.
  - Related/recommended products carousel.
- **Acceptance Criteria**:
  - Page generates dynamic OpenGraph and Twitter card metadata for social sharing.
  - Dimensions display clearly with imperial/metric units.
  - Stock count decreases atomically upon order completion.

---

### Feature 4: Shopping Cart System (`features/cart`)
- **User Story**: As a shopper, I want a persistent cart that I can view via a slide-over drawer, adjust quantities, and see exact subtotals before initiating checkout.
- **Key Capabilities**:
  - Zustand-powered client cart with LocalStorage persistence for guest visitors.
  - Bidirectional database sync with `cart_items` table upon user login.
  - Slide-over sheet/drawer that opens instantly on add-to-cart without redirecting away from the catalog.
  - Real-time line item quantity increment/decrement and item removal with optimistic updates.
  - Order subtotal calculation with free shipping threshold progress bar.
- **Acceptance Criteria**:
  - Cart drawer state does not trigger full page re-renders.
  - Adding an item when unauthenticated persists in `localStorage`; logging in merges local items into the user's database cart without duplicate rows.
  - Quantities cannot exceed the product's available `stock_quantity`.

---

### Feature 5: Checkout & Order Creation (`features/orders`)
- **User Story**: As a customer, I want a secure, transparent checkout process where I enter shipping details, review costs, and complete payment.
- **Key Capabilities**:
  - Multi-step checkout form:
    1. Shipping Address & Contact Info (validated with Zod).
    2. Shipping Method Selection (Standard, White-Glove In-Home Assembly).
    3. Payment Details (Stripe Payment Element / secure gateway integration).
  - Server Action handling atomic order placement:
    - Verifies real-time item prices from `products` table (never trusts client price).
    - Checks stock availability.
    - Creates `orders` and `order_items` records in a database transaction.
    - Clears customer cart upon successful payment.
  - Dedicated `/orders/[orderNumber]/confirmation` receipt page.
- **Acceptance Criteria**:
  - Unit prices are recalculated on the server to prevent client-side price tampering.
  - Transaction rolls back if any product in the cart is oversold before completion.
  - Order number is generated in a clean format (e.g. `UN-2026-XXXX`).

---

### Feature 6: Customer Order Dashboard (`features/orders`)
- **User Story**: As a registered customer, I want to review my past orders, download invoices, and see shipment tracking status.
- **Key Capabilities**:
  - `/profile/orders` list displaying order number, date, total, and status badge.
  - Status pipeline: `Pending` -> `Processing` -> `Shipped` -> `Delivered`.
  - Itemized order breakdown showing thumbnail, purchased title, quantity, and historical price.
- **Acceptance Criteria**:
  - Protected by RLS: customers can only view their own orders (`auth.uid() = user_id`).
  - Visual status timeline indicates current shipment stage.

---

### Feature 7: Admin Back-Office (`features/admin`)
- **User Story**: As an administrator, I want to manage product listings, monitor stock levels, and update order statuses.
- **Key Capabilities**:
  - Role-guarded route group (`/admin/*`) restricted to users with `role = 'admin'` in `profiles`.
  - Product Catalog Table with sorting, search, and stock status indicators.
  - Product Creation and Edit modal/form with image URL management and category dropdowns.
  - Order fulfillment management: update status to `Processing`, `Shipped`, or `Delivered`.
- **Acceptance Criteria**:
  - Non-admin users attempting to load `/admin` receive a 403 Forbidden or redirect to `/`.
  - RLS policies prevent unauthorized POST/PATCH requests even if called directly via the API.

---

### Feature 8: Luxury Furniture Brand Storefront (`components/home`)
- **User Story**: As a discerning furniture shopper, I want to experience a warm, minimal, luxury e-commerce homepage with clear visual hierarchy, elegant typography, curated collections, and social proof so that I feel confident in the brand's quality and design aesthetic.
- **Key Capabilities**:
  - Max 1280px centered container layout with 24px desktop padding and 80-120px section spacing.
  - Playfair Display serif headings paired with Inter body copy.
  - Warm luxury palette: Background `#F8F6F2`, Primary `#5D6B4D`, Text `#1A1A1A`, Border `#E5E2DC`.
  - 10 structured sections:
    1. Premium Navbar with active Home pill, category links, search, account, and cart count badge.
    2. 40/60 split Hero section with Playfair headline, dual CTAs, customer avatars, lifestyle image, and floating rating card.
    3. 8-card equal-spaced category icons with hover elevation.
    4. Best Sellers ("Our Most Loved Pieces") with left intro content block and right product card grid with live Supabase data, ratings, wishlist button, and color swatches.
    5. Promo Banner with split olive background, 30% discount announcement, and strong CTA.
    6. Features / Trust Badges (Free Shipping, 30-Day Returns, Secure Payments, 24/7 Support).
    7. Inspiration Section with left text and right 3-column editorial cards.
    8. Testimonials Section ("Real homes. Real stories.") with quote marks, avatar circles, verified buyers, and carousel controls.
    9. Newsletter Section with aligned pill input and arrow submit button.
    10. Luxury four-column light footer with brand statement, social icons, links, and customer support channels.
- **Acceptance Criteria**:
  - Design matches the visual quality, proportions, and spacing of high-end furniture brand references without looking like a generic SaaS dashboard or AI template.
  - Fully responsive from mobile (375px) to wide desktop (1440px+).
  - Smooth scroll-triggered fade-up animations powered by Framer Motion.

---

## 2. Implementation Progress Checklist

| Component / Feature | Scope | Status | Notes |
| :--- | :--- | :---: | :--- |
| **Monorepo Setup** | Turborepo, pnpm workspaces, TS 7 | **DONE** | Working tree clean, types aligned |
| **UI System** | ShadCN "base-nova", Tailwind v4, standard `cn` | **DONE** | Tested with button component and `@/lib/utils` |
| **Supabase Client Layer** | `client.ts`, `server.ts`, `middleware.ts` | **DONE** | Async Next 16 cookies, `.env.example` created |
| **Database Migrations** | SQL schema, RLS policies, triggers, seed data | **DONE** | Script ready in `docs/SQL_QUERIES.sql` |
| **Auth UI & Flow** | Login/signup forms, Server Actions, middleware | **DONE** | Implemented in `features/auth` with Zod + React Hook Form |
| **Role-Based Auth (RBAC)**| `admin` vs `customer`, route guards, `/admin` shell | **DONE** | Implemented in `features/auth/roles.ts` and `app/admin/page.tsx` |
| **Admin Product CRUD** | Product schema, create/edit form, delete action, storage upload | **DONE** | Implemented in `features/products/`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]` |
| **Product Discovery** | Catalog grid, category navigation, search, filters | **DONE** | Implemented in `features/products/catalog`, `/products`, TanStack Query v5 |
| **Product Details Experience** | Gallery, dimensions, specs, stock status | **DONE** | Implemented in `/products/[slug]`, `ProductDetailsView` |
| **Cart Drawer & Store** | Zustand store, localStorage persist, /cart page, live badge | **DONE** | Implemented in `features/cart/`, `/cart`, `CartBadge`, `CartView` |
| **Checkout Flow** | Server Action order placement, atomic stock decrement, cart reset | **DONE** | Implemented in `features/orders/`, `/checkout`, `createOrderAction` |
| **Customer Order History** | Order history, itemized receipts, delivery status badges | **DONE** | Implemented in `/orders`, `UserOrdersView`, TanStack Query |
| **Admin Order Management**| Order fulfillment pipeline, status updater, live filter tabs | **DONE** | Implemented in `/admin/orders`, `AdminOrdersTable`, `updateOrderStatusAction` |
| **Luxury Storefront Redesign** | Natura-inspired warm luxury homepage, 10 sections, Framer Motion | **DONE** | Implemented in `app/page.tsx`, `components/home/`, `StorefrontNav` |

