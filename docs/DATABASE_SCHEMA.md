# UrbanNest MVP Database Architecture

Senior PostgreSQL & Supabase architectural specification for **UrbanNest** MVP e-commerce.

---

## 1. Entity-Relationship Diagram (ERD)

```text
+-----------------------+           +-----------------------+
|      auth.users       |           |      categories       |
|-----------------------|           |-----------------------|
| id (PK, UUID)         |           | id (PK, UUID)         |
+-----------------------+           | name (TEXT)           |
           | 1:1                    | slug (TEXT, UNIQUE)   |
           v                        | description (TEXT)    |
+-----------------------+           | image_url (TEXT)      |
|       profiles        |           | created_at (TZ)       |
|-----------------------|           +-----------------------+
| id (PK, UUID, FK)     |                       | 1:N
| email (TEXT, UNIQUE)  |                       v
| full_name (TEXT)      |           +-----------------------+
| avatar_url (TEXT)     |           |       products        |
| role (TEXT: cust/adm) |           |-----------------------|
| created_at (TZ)       |           | id (PK, UUID)         |
| updated_at (TZ)       |           | title (TEXT)          |
+-----------------------+           | slug (TEXT, UNIQUE)   |
           |                        | description (TEXT)    |
           | 1:N                    | price (NUMERIC)       |
           v                        | compare_at_price (NUM)|
+-----------------------+           | stock (INTEGER)       |
|        orders         |           | images (TEXT[])       |
|-----------------------|           | category_id (FK, UUID)|
| id (PK, UUID)         |           | is_featured (BOOLEAN) |
| order_number (UNIQUE) |           | is_published (BOOLEAN)|
| user_id (FK, UUID)    |<----+     | created_at (TZ)       |
| status (TEXT)         |     |     | updated_at (TZ)       |
| total_amount (NUMERIC)|     |     +-----------------------+
| shipping_address(JSON)|     |                 |
| created_at (TZ)       |     |                 | 1:N
| updated_at (TZ)       |     |                 v
+-----------------------+     |     +-----------------------+
           |                  |     |      order_items      |
           | 1:N              |     |-----------------------|
           v                  |     | id (PK, UUID)         |
+-----------------------+     |     | order_id (FK, UUID)   |
|      order_items      |     |     | product_id (FK, UUID) |
|-----------------------|     |     | quantity (INTEGER)    |
| id (PK, UUID)         |     |     | price (NUMERIC)       |
| order_id (FK, UUID)---+-----+     | created_at (TZ)       |
| product_id (FK, UUID)-+-----------+-----------------------+
| quantity (INTEGER)    |
| price (NUMERIC)       |
| created_at (TZ)       |
+-----------------------+
```

---

## 2. Table-by-Table Architectural Specifications

### 2.1 `profiles`
- **Why it exists:** Stores application-level customer and administrator identities linked to Supabase Auth.
- **Business problem it solves:** Decouples user data from Supabase’s internal `auth.users` system. Safely stores role authorization (`customer` vs `admin`) and customer profile metadata without exposing sensitive credentials.
- **Relationships:**
  - **1:1 with `auth.users`**: `profiles.id` references `auth.users(id)` with `ON DELETE CASCADE`.
  - **1:Many with `orders`**: A profile can place multiple orders over time.
- **Why specific columns were chosen:**
  - `id (UUID)`: Directly matches `auth.users.id` for zero-join ID lookups via `auth.uid()`.
  - `email (TEXT, UNIQUE)`: Mirror of user email for fast display in admin and profile pages.
  - `full_name (TEXT)`: Human-readable name for shipping labels and personalized greetings.
  - `avatar_url (TEXT)`: Optional CDN/storage link for customer avatar image.
  - `role (TEXT)`: Enforces RBAC with `CHECK (role IN ('customer', 'admin'))` default to `'customer'`.
  - `created_at / updated_at (TIMESTAMPTZ)`: Standard chronological audit tracking.

---

### 2.2 `categories`
- **Why it exists:** Groups furniture and decor items into structured catalog taxonomies.
- **Business problem it solves:** Enables intuitive catalog exploration (Living Room, Bedroom, Dining Room, Home Office), breadcrumbs, faceted search, and clean SEO-friendly routing.
- **Relationships:**
  - **1:Many with `products`**: One category contains many products (`ON DELETE RESTRICT`).
- **Why specific columns were chosen:**
  - `id (UUID)`: Standard primary key using `gen_random_uuid()`.
  - `name (TEXT)`: Customer-facing category title (e.g. "Living Room").
  - `slug (TEXT, UNIQUE)`: SEO-optimized URL path identifier (e.g. `living-room`).
  - `description (TEXT)`: Category summary for SEO meta tags and collection header banners.
  - `image_url (TEXT)`: Visual hero banner displayed on category landing pages.
  - `created_at (TIMESTAMPTZ)`: Tracks category establishment date.

---

### 2.3 `products`
- **Why it exists:** Central entity representing sellable physical inventory.
- **Business problem it solves:** Stores commercial pricing, physical inventory levels, rich descriptions, and imagery while strictly preventing overselling at the database level.
- **Relationships:**
  - **Many:1 with `categories`**: Every product belongs to one category (`category_id` FK).
  - **1:Many with `order_items`**: A product is referenced across multiple line items.
- **Why specific columns were chosen:**
  - `id (UUID)`: Unique identifier for programmatic queries and cart keys.
  - `title (TEXT)`: Display name of the furniture piece.
  - `slug (TEXT, UNIQUE)`: Search-engine optimized URL identifier (e.g. `nordic-boucle-curved-sofa`).
  - `description (TEXT)`: Full markdown/text product description covering dimensions, materials, and care.
  - `price (NUMERIC(10,2))`: Exact standard selling price in USD with `CHECK (price >= 0)`. Avoids floating-point rounding errors.
  - `compare_at_price (NUMERIC(10,2))`: Original price for showing discount strikethroughs (e.g. was $1,890, now $1,690).
  - `stock (INTEGER)`: Real-time inventory count with `CHECK (stock >= 0)`. The database engine guarantees stock can never become negative.
  - `images (TEXT[])`: Array of high-resolution CDN image links. Simpler and faster to query than a separate image table for MVP.
  - `category_id (UUID)`: Enforces relational taxonomy (`ON DELETE RESTRICT`).
  - `is_featured (BOOLEAN)`: Flag to display items on the homepage hero or curated collections.
  - `is_published (BOOLEAN)`: Allows draft product creation without immediate public storefront exposure.
  - `created_at / updated_at (TIMESTAMPTZ)`: Automatic audit timestamps.

---

### 2.4 `orders`
- **Why it exists:** Represents completed customer purchase transactions and delivery agreements.
- **Business problem it solves:** Acts as the single source of truth for financial totals, delivery addresses, and the order fulfillment state machine (`pending` -> `processing` -> `shipped` -> `delivered` -> `cancelled`).
- **Relationships:**
  - **Many:1 with `profiles`**: Every order is placed by an authenticated customer (`user_id`).
  - **1:Many with `order_items`**: Contains one or more purchased line items.
- **Why specific columns were chosen:**
  - `id (UUID)`: Unique internal database identifier.
  - `order_number (TEXT, UNIQUE)`: Clean customer-facing identifier (e.g. `UN-2026-9812`).
  - `user_id (UUID)`: Foreign key to `profiles.id` (`ON DELETE RESTRICT` to preserve financial audit logs).
  - `status (TEXT)`: State machine constrained to `'pending'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`.
  - `total_amount (NUMERIC(10,2))`: Final charged total in USD with `CHECK (total_amount >= 0)`.
  - `shipping_address (JSONB)`: Point-in-time snapshot of recipient name, street, city, state, and zip. Stored as JSONB so future customer profile address changes do not retroactively alter where past packages were delivered.
  - `created_at / updated_at (TIMESTAMPTZ)`: Order placement and status update timestamps.

---

### 2.5 `order_items`
- **Why it exists:** Represents individual items purchased within a parent order.
- **Business problem it solves:** **Solves the Dynamic Pricing Dilemma.** Product prices change over time. If orders read prices from `products.price`, changing a sofa price tomorrow would alter past financial reports. `order_items` stores an immutable snapshot of unit price and quantity at the exact instant of purchase.
- **Relationships:**
  - **Many:1 with `orders`**: Parent order reference with `ON DELETE CASCADE`.
  - **Many:1 with `products`**: Catalog product reference with `ON DELETE RESTRICT`.
- **Why specific columns were chosen:**
  - `id (UUID)`: Unique line item identifier.
  - `order_id (UUID)`: Foreign key linking to parent `orders.id`.
  - `product_id (UUID)`: Foreign key linking to `products.id`.
  - `quantity (INTEGER)`: Number of units purchased (`CHECK (quantity > 0)`).
  - `price (NUMERIC(10,2))`: Immutable captured unit price at time of purchase (`CHECK (price >= 0)`).
  - `created_at (TIMESTAMPTZ)`: Purchase timestamp.

---

## 3. Storage Architecture: `product-images` Bucket

In addition to relational tables, UrbanNest integrates an S3-compatible cloud object storage bucket for visual catalog assets.

### 3.1 Bucket Specifications
- **Bucket ID:** `product-images`
- **Public Visibility:** `true` (Enables global CDN edge caching for public storefront visitors)
- **File Size Ceiling:** 5 MB per individual asset (`5242880` bytes)
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`
- **Path Strategy:** `products/<timestamp>-<sanitized-filename>`

### 3.2 Relational Coupling
- Rather than maintaining an unnecessary separate relational join table for image records, `products.images` stores a PostgreSQL `TEXT[]` array containing immutable Supabase public CDN URLs.
- When an administrator uploads a new product image via the Admin Product Form, the client uploads the raw binary asset directly to `product-images`, extracts the permanent public URL, and appends it to `products.images` upon form submission.

### 3.3 Storage Row-Level Security (RLS)
- **SELECT:** Public (Anonymous & Authenticated) to allow storefront rendering without auth cookies.
- **INSERT / UPDATE / DELETE:** Strictly restricted to authenticated accounts verified with `profiles.role = 'admin'`.

---

## 4. Order Lifecycle & Fulfillment Pipeline

### 4.1 Order Status State Machine
UrbanNest models the physical fulfillment journey through a deterministic state machine enforced by check constraints on `public.orders.status`:

```
   [ Customer Places Order ]
               │
               ▼
           ┌─────────┐
           │ pending │  (Order recorded, inventory decremented)
           └────┬────┘
                │
         Admin confirms
                ▼
         ┌────────────┐
         │ processing │ (Warehouse allocation & package boxing)
         └──────┬─────┘
                │
        Courier dispatched
                ▼
          ┌─────────┐
          │ shipped │  (In transit to customer destination)
          └────┬────┘
               │
       Delivery confirmed
               ▼
         ┌───────────┐
         │ delivered │ (Customer received package - Terminal Success)
         └───────────┘

   * Any non-delivered order can transition to `cancelled` by administrative action.
```

### 4.2 Row-Level Security (RLS) Policy Matrix for Orders

| Table | Operation | Target Role | Permitted Condition | Business Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `orders` | `SELECT` | `customer` | `auth.uid() = user_id` | Shoppers can exclusively view their own order history |
| `orders` | `SELECT` | `admin` | `public.is_admin()` | Administrators can view all customer orders across the platform |
| `orders` | `INSERT` | `customer` | `auth.uid() = user_id` | Authenticated users can create orders tied to their own account |
| `orders` | `UPDATE` | `admin` | `public.is_admin()` | Only store administrators can advance or update fulfillment statuses |
| `order_items` | `SELECT` | `customer` | `EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())` | Customers can inspect line items belonging to their orders |
| `order_items` | `SELECT` | `admin` | `public.is_admin()` | Admins can view line items for any order |
| `order_items` | `INSERT` | `customer` | `EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())` | Inserted atomically as part of customer order placement |

