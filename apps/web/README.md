# UrbanNest (Web Application)

Modern Furniture & Home Decor e-commerce platform built with Next.js App Router, Tailwind CSS, ShadCN UI, Zustand, TanStack Query, and Supabase.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 & [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Client) & [TanStack Query](https://tanstack.com/query) (Server)
- **Validation**: [Zod](https://zod.dev/)
- **Backend / Auth / DB**: [Supabase](https://supabase.com/)

## Architecture Overview

```text
apps/web/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
├── components/
│   ├── ui/              # ShadCN atomic primitive components (Button, Input, Dialog, etc.)
│   ├── layout/          # Layout components (Navbar, Footer, Sidebar, Header)
│   └── shared/          # Reusable cross-feature components (ProductCard, EmptyState, etc.)
├── features/            # Feature-sliced business modules
│   ├── auth/            # Auth forms, user session, guards
│   ├── products/        # Catalog, product details, filters, sorting
│   ├── cart/            # Cart drawer, cart line items, pricing calculation
│   ├── orders/          # Checkout flow, order history, order status
│   └── admin/           # Admin dashboard, inventory management, product forms
├── lib/                 # Core infrastructure and utilities
│   ├── supabase/        # Supabase browser, server, and admin clients
│   ├── validations/     # Zod schemas for input validation
│   ├── constants/       # App-wide constants, navigation links, config
│   └── utils/           # Utility functions (cn, formatters, calculations)
├── hooks/               # Custom reusable React hooks
├── providers/           # Context providers (QueryClientProvider, ThemeProvider, etc.)
├── stores/              # Zustand global client state stores (cartStore, uiStore, etc.)
└── types/               # Global TypeScript declarations, database schemas, API types
```

## Getting Started

Run the development server from the monorepo root:

```bash
pnpm dev
```

Or run directly inside `apps/web`:

```bash
pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
