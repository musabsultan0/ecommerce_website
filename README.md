# ShopEase — E-Commerce Assessment

A small e-commerce site with a Next.js + TypeScript frontend and a Go REST API backend. No database is used — products live in memory on the server, and the cart lives in the browser.

## 1. Project Overview

- Landing page with a hero banner, trust badges, and a filterable grid of 100 products
- Product details page (dynamic route) with specifications, reviews, color variants, and related products
- Fully working cart: add, increase/decrease quantity, remove, clear, live count + total
- Loading, error (with retry), and empty states throughout
- Responsive layout (mobile → desktop)

## 2. Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | Go (standard `net/http`, no framework) |
| State     | React Context + `localStorage`      |
| Data      | In-memory Go slice (no database)    |

## 3. Folder Structure

```
ecommerce-assessment/
├── backend/
│   ├── main.go                  # server startup, routes, CORS
│   ├── models/product.go        # Product struct + in-memory data
│   └── handlers/product_handler.go  # GET /api/products, /api/products/{id}
└── frontend/
    └── app/
        ├── page.tsx              # home page
        ├── products/[id]/page.tsx  # product details (dynamic route)
        ├── cart/page.tsx         # cart page
        ├── components/           # Navbar, ProductCard, Footer, Loading, Error
        ├── context/CartContext.tsx  # cart state, add/remove/qty/total
        ├── lib/api.ts             # fetch calls to the Go backend
        └── types/product.ts       # shared TypeScript types
```

## 4. Setup & Run

### Backend (Go)
```bash
cd backend
go run main.go
```
Runs at `http://localhost:8080`. Test it directly: `http://localhost:8080/api/products`

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`. Make sure the backend is running first, or you'll see the error state (which is intentional — see below).

Optional: copy `.env.local.example` to `.env.local` if your backend runs on a different URL.

## 5. API Documentation

| Method | Endpoint              | Description                     |
|--------|-----------------------|----------------------------------|
| GET    | `/api/products`       | Returns all products as JSON array |
| GET    | `/api/products/{id}`  | Returns one product, or 404 if not found |
| GET    | `/api/health`         | Simple health check              |

Example response for `/api/products/1`:
```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "price": 2499,
  "description": "Over-ear wireless headphones...",
  "image": "https://...",
  "category": "Electronics",
  "stock": 25
}
```

## 6. Key Technical Decisions

**Why Go's standard `net/http` instead of a framework (Gin/Echo)?**
The API surface is tiny (two real endpoints), so a framework would add dependency weight without real benefit. Standard library keeps the backend easy to read and explain.

**Why no database?**
Explicitly out of scope for this assessment. Products are generated once at startup in `models/product.go` from 10 base templates × 10 color variants = 100 products, each with specifications and reviews — this "resets" on server restart, which is an accepted trade-off for a no-DB assessment.

**Why generate 100 products instead of hand-writing them:**
Ten realistic base products (Headphones, Smart Watch, etc.) are each expanded into 10 color variants with a small price step per variant. This keeps the data DRY — adding one more base template automatically adds 10 more products — and is easy to explain: "one template describes a product family, the generator produces its variants."

**Why products are fetched from the API, not hardcoded in Next.js:**
`app/lib/api.ts` is the only place that knows the backend's URL and shape. Pages call `fetchProducts()` / `fetchProductById()` and never see raw data — this keeps the frontend genuinely decoupled from the backend, matching the requirement.

**State management — why React Context instead of Redux/Zustand:**
The app only needs one piece of shared state (the cart), consumed by three components (Navbar, Cart page, Product page). Context + a custom `useCart()` hook is enough and avoids an unnecessary dependency.

**Cart persistence — why `localStorage` instead of a backend cart:**
Since there's no database, persisting the cart server-side isn't practical for this scope. `localStorage` survives page refreshes, which satisfies "cart shouldn't disappear on reload" without needing sessions or auth.

**CORS handling:**
The frontend (port 3000) and backend (port 8080) are different origins, so `main.go` wraps every handler in a small `enableCORS` middleware that sets `Access-Control-Allow-Origin`.

**Error/loading/empty states:**
Every data-fetching page tracks an explicit `status: "loading" | "error" | "success"` instead of inferring state from data shape — this makes each UI branch (spinner, retry button, empty message) predictable and easy to test manually.

**Styling:**
Tailwind CSS was chosen for speed and consistency across responsive breakpoints (`sm:`, `md:`, `lg:` prefixes) without writing separate CSS files per component.

## 7. Known Limitations (by design, given the "no database" scope)

- Product data resets when the Go server restarts
- No authentication / user accounts
- No real checkout or payment integration
- Cart is per-browser (via `localStorage`), not synced across devices
