# UrbanNest CI/CD & Deployment Architecture

This document details the continuous integration, continuous delivery (CI/CD), and versioned deployment pipeline for the **UrbanNest** monorepo.

---

## 1. Overview & Architecture

UrbanNest uses a modern, multi-tiered deployment model combining **GitHub Actions** as the automated quality gate and **Vercel** for edge hosting and preview deployments.

```
Development:
  Feature Branch ──> Pull Request ──> GitHub Actions CI (Quality Gate: Typecheck, Lint, Build)
                                          │
                                          └──> Vercel Preview Deployment (Ephemeral URL)

Production:
  Merge to main ──> GitHub Actions CI (Validation)
                       │
                       └──> Vercel Production Deployment (Live Storefront)

Release:
  git tag vX.Y.Z ──> GitHub Actions Release Workflow ──> Production Release Marker
```

---

## 2. Monorepo & Tooling Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Monorepo Engine** | [Turborepo](https://turbo.build/) | `^2.10.12` | Task orchestration, target filtering, build artifact caching |
| **Package Manager** | [pnpm](https://pnpm.io/) | `11.25.0` (Lockfile v9) | Strict dependency resolution, isolated workspace symlinks |
| **Runtime** | Node.js | `>=22` | Server runtime & tooling engine |
| **Primary App** | [Next.js](https://nextjs.org/) | `16.3.4` (Turbopack) | Customer storefront and administrative operations |
| **Hosting Platform** | [Vercel](https://vercel.com/) | Native Git Integration | Edge network, SSR compute, assets CDN |
| **Quality Gate** | [GitHub Actions](https://github.com/features/actions) | Ubuntu Latest | Automated linting, typechecking, and build validation |

---

## 3. GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)

The primary CI pipeline runs automatically on:
1. **Pushes to `main`**
2. **Pull Requests targeting `main`**

### Pipeline Stages

```
┌─────────────────────────────────┐
│           Checkout              │ actions/checkout@v4
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│          Setup pnpm             │ pnpm/action-setup@v4 (v11.25.0)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│          Setup Node             │ actions/setup-node@v4 (Node 22 + pnpm store cache)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│      Install Dependencies       │ pnpm install --frozen-lockfile
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│          Type Check             │ pnpm check-types (turbo run check-types)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│             Lint                │ pnpm lint (turbo run lint with --max-warnings 0)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│            Build                │ pnpm turbo run build --filter=web
└─────────────────────────────────┘
```

### Key Optimizations & Security Practices

- **Concurrency Protection**: Stale CI runs on older commits for the same branch or PR are immediately cancelled using `cancel-in-progress: true`.
- **Least-Privilege Security**: Global workflow permissions are strictly limited to `contents: read`. No write or token alteration privileges are permitted on the CI gate.
- **Strict Dependency Caching**: Caching is driven through `actions/setup-node@v4` with `cache: "pnpm"`, ensuring deterministic caching without redundant action dependencies.
- **Turborepo Scoping**: The build stage selectively builds the primary deployment target (`--filter=web`), avoiding unnecessary compute overhead for unrelated applications.
- **Secret Isolation**: No production database secrets, service role keys, or API tokens are hardcoded into CI files. Safe fallback placeholders are provided during compile-time static page collection.

---

## 4. Vercel Deployment Configuration

Vercel connects directly to the GitHub repository via Vercel's native GitHub integration.

### Monorepo Settings in Vercel Dashboard

When setting up or verifying the UrbanNest project in Vercel:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Next.js` | Automatically configured |
| **Root Directory** | `apps/web` | Points Vercel to the Next.js app package |
| **Build Command** | `cd ../.. && npx turbo run build --filter=web` | Runs Turborepo from the monorepo root |
| **Output Directory** | `.next` | Standard Next.js output |
| **Install Command** | `pnpm install` | Uses workspace root lockfile |

> **Note:** If Vercel Root Directory is left as repository root (`.`):
> - Build Command: `pnpm turbo run build --filter=web`
> - Output Directory: `apps/web/.next`

### Preview vs. Production Deployments

- **Preview Deployments**: Triggered automatically on every Pull Request or push to non-main branches. Vercel provisions an isolated preview URL for team review.
- **Production Deployments**: Triggered automatically upon merging approved, CI-validated Pull Requests into `main`.

---

## 5. Required Environment Variables

Configure the following variables in the **Vercel Project Settings → Environment Variables**:

| Variable | Environment | Required | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Dev | Yes | Supabase project API URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Dev | Yes | Public Supabase anonymous client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Optional | Admin service role key (strictly server-side actions) |
| `NEXT_PUBLIC_SITE_URL` | Production | Recommended | Canonical URL (`https://urbannest.com` or custom domain) |

*In GitHub Actions, you may optionally set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Repository Secrets. If omitted, the workflow gracefully falls back to non-secret build-time placeholders.*

---

## 6. Versioned Release Workflow

UrbanNest uses **Semantic Versioning (SemVer)** tags (`vMAJOR.MINOR.PATCH`) to track production releases.

### Release Tag Convention
- `v1.0.0` - Initial major release
- `v1.0.1` - Patch release (bug fixes, hotfixes)
- `v1.1.0` - Minor release (new feature additions, backward-compatible enhancements)

### How to Cut a Release

1. Ensure `main` is clean, up to date, and all CI checks pass:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create an annotated semantic version tag:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0 - Production Catalog & Architecture"
   ```
3. Push the tag to GitHub:
   ```bash
   git push origin v1.0.0
   ```
4. **Automated Release Workflow (`.github/workflows/release.yml`)**:
   - Checks out the repository
   - Executes full typecheck, lint, and build verification
   - Automatically generates release notes and creates an official **GitHub Release**

---

## 7. Rollback Strategy

If a critical incident or regression occurs in production:

### 1. Instant Vercel Rollback (Zero Downtime)
1. Go to **Vercel Dashboard → UrbanNest Project → Deployments**.
2. Locate the last known good deployment.
3. Click the three dots (`...`) and select **Instant Rollback**.
4. Traffic is immediately redirected to the prior immutable build artifact without rebuilding.

### 2. Git-Level Rollback
1. Revert the problematic commit on `main`:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
2. The CI pipeline validates the revert, and Vercel automatically deploys the restored state.

---

## 8. Local Validation Cheat Sheet

Before pushing changes to GitHub or opening a Pull Request, run the identical validation sequence locally:

```bash
# 1. Ensure lockfile consistency
pnpm install --frozen-lockfile

# 2. Type check all monorepo workspaces
pnpm check-types

# 3. Lint all monorepo workspaces
pnpm lint

# 4. Build primary web application
pnpm turbo run build --filter=web
```
