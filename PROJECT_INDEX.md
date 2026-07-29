# Project Index — Suraj Cleaning

**Last updated:** 2026-07-29
**Purpose:** Lightweight map of the codebase so the AI can resolve a task to the correct files without scanning everything.

---

## 1. Pages (Next.js App Router)

### Public Pages (`src/app/(pages)/`)
| File | Route | Description |
|------|-------|-------------|
| `layout.tsx` | — | Shared layout for all `(pages)` routes |
| `page.tsx` | `/` | **Homepage** — Hero, BestSellers, Categories, Testimonials |
| `about/page.tsx` | `/about` | About Us — company info, quality process |
| `products/page.tsx` | `/products` | Product listing — all products / by category |
| `products/[slug]/page.tsx` | `/products/:slug` | Single product detail |
| `cart/page.tsx` | `/cart` | Shopping cart |
| `checkout/page.tsx` | `/checkout` | Checkout form + Razorpay integration |
| `contact/page.tsx` | `/contact` | Contact form + company info |
| `distributor/page.tsx` | `/distributor` | Distributor enquiry form |
| `order-success/page.tsx` | `/order-success` | Post-payment success page |
| `order-failed/page.tsx` | `/order-failed` | Failed payment page |

### Orders Pages (`src/app/orders/`)
| File | Route | Description |
|------|-------|-------------|
| `page.tsx` | `/orders` | Order list (logged-in) |
| `[orderId]/page.tsx` | `/orders/:id` | Single order detail |

### Profile (`src/app/profile/`)
| File | Route | Description |
|------|-------|-------------|
| `page.tsx` | `/profile` | User profile page |
| `ProfileClient.tsx` | — | Client-side profile logic |

### Admin Pages (`src/app/admin/`)
| File | Route | Description |
|------|-------|-------------|
| `layout.tsx` | — | Admin layout + auth guard |
| `page.tsx` | `/admin` | Admin dashboard |
| `login/page.tsx` | `/admin/login` | Admin login |
| `products/page.tsx` | `/admin/products` | Product CRUD |
| `categories/page.tsx` | `/admin/categories` | Category management |
| `orders/page.tsx` | `/admin/orders` | Order management |
| `submissions/page.tsx` | `/admin/submissions` | Contact/distributor/newsletter submissions |
| `testimonials/page.tsx` | `/admin/testimonials` | Testimonial management |
| `settings/page.tsx` | `/admin/settings` | Admin settings |
| `quality-process/page.tsx` | `/admin/quality-process` | Quality process editor |

### Legal / Misc
| File | Route |
|------|-------|
| `privacy/page.tsx` | `/privacy` |
| `terms/page.tsx` | `/terms` |
| `signin/page.tsx` | `/signin` |
| `not-found.tsx` | 404 |
| `sitemap.ts` | `/sitemap.xml` |
| `robots.ts` | `/robots.txt` |
| `layout.tsx` | Root layout |
| `globals.css` | Global styles |
| `favicon.ico` / `icon.png` | Favicons |

---

## 2. Components

### Layout & Navigation
| File | Used By | Description |
|------|---------|-------------|
| `Header.tsx` | Root layout | Site header with nav, cart icon |
| `Footer.tsx` | Root layout | Site footer — company info, links, phone |
| `PublicLayout.tsx` | `(pages)/layout.tsx` | Wraps public pages with Header + Footer |
| `CartIcon.tsx` | Header | Cart icon with item count badge |
| `FloatingContactActions.tsx` | Public pages | Floating WhatsApp / phone buttons |

### Homepage Sections
| File | Used By | Description |
|------|---------|-------------|
| `HeroSection.tsx` | Home page | Hero banner — headline, CTA, hero image |
| `ProductCategories.tsx` | Home page | Category cards grid |
| `BestSellingProducts.tsx` | Home page | Best-seller product carousel |
| `ComboProducts.tsx` | Home page | Combo / mega-pack section |
| `Testimonials.tsx` | Home page | Customer testimonials carousel |
| `QualityProcessSection.tsx` | About page | Quality process steps |
| `AboutSection.tsx` | About page | About text block |
| `ContactSection.tsx` | Home/Contact | Contact info block |
| `DistributorSection.tsx` | Home/Distributor | Distributor CTA block |
| `NewsletterSection.tsx` | Footer area | Newsletter signup |
| `TrustBenefits.tsx` | Home page | Trust / benefit badges |
| `WordByWordText.tsx` | Various | Animated word-by-word reveal text |
| `MegaPackSection.tsx` | Home/Products | Mega pack promo section |

### View Components
| File | Used By | Description |
|------|---------|-------------|
| `AboutView.tsx` | About page | Full about page composition |
| `ContactView.tsx` | Contact page | Full contact page composition |
| `DistributorView.tsx` | Distributor page | Full distributor page composition |
| `OrderSuccessView.tsx` | order-success page | Success page composition |

### Product Components (`src/components/products/`)
| File | Used By | Description |
|------|---------|-------------|
| `ProductCard.tsx` | Product listing, BestSellers, Combo | Individual product card |
| `ProductDetailView.tsx` | Product [slug] page | Full product detail view |
| `ProductsView.tsx` | Products page | Product listing composition |
| `ProductImage.tsx` | ProductDetailView | Product image with gallery |
| `ProductsPageHeader.tsx` | Products page | Page title + breadcrumbs |

### Admin Components (`src/components/admin/`)
| File | Used By | Description |
|------|---------|-------------|
| `AdminDataTable.tsx` | All admin list pages | Generic table for CRUD with sorting, actions, delete confirm |
| `AdminFormModal.tsx` | All admin CRUD pages | Generic create/edit modal with image upload |
| `AdminUI.tsx` | All admin pages | Shared UI primitives: PageHeader, StatCard, Badge, Section, EmptyState, TableWrapper, Skeleton, LoadingSpinner |
| `AdminHeader.tsx` | Admin layout | Admin top bar |
| `AdminSidebar.tsx` | Admin layout | Admin navigation sidebar |
| `VariantEditor.tsx` | Admin products | Variant editor for products with consistent input styling |

### Shared / Utility Components
| File | Used By | Description |
|------|---------|-------------|
| `animations.tsx` | Various | Framer Motion animation wrappers |
| `GlobalErrorBoundary.tsx` | Root layout | Error boundary |

---

## 3. API Routes

### Admin Auth (`src/app/api/admin/auth/`)
| File | Route | Purpose |
|------|-------|---------|
| `login/route.ts` | POST /api/admin/auth/login | Admin login |
| `logout/route.ts` | POST /api/admin/auth/logout | Admin logout |
| `check/route.ts` | GET /api/admin/auth/check | Session validation |

### Admin Data (`src/app/api/admin/data/`)
| File | Route | Purpose |
|------|-------|---------|
| `[entity]/route.ts` | GET/POST /api/admin/data/:entity | Generic CRUD for any entity |
| `navigation/route.ts` | GET /api/admin/data/navigation | Navigation config |
| `orders/route.ts` | GET /api/admin/data/orders | Order queries |

### Admin Submissions (`src/app/api/admin/submissions/`)
| File | Route | Purpose |
|------|-------|---------|
| `route.ts` | GET /api/admin/submissions | List all submissions |
| `contact/route.ts` | — | Contact submissions |
| `distributor/route.ts` | — | Distributor submissions |
| `newsletter/route.ts` | — | Newsletter submissions |

### Checkout & Orders (`src/app/api/`)
| File | Route | Purpose |
|------|-------|---------|
| `checkout/route.ts` | POST /api/checkout | Create Razorpay order |
| `orders/create/route.ts` | POST /api/orders/create | Save order to DB |
| `orders/list/route.ts` | GET /api/orders/list | List user's orders |
| `orders/[orderId]/route.ts` | GET /api/orders/:id | Get single order |
| `orders/verify/route.ts` | POST /api/orders/verify | Verify Razorpay payment |
| `orders/webhook/route.ts` | POST /api/orders/webhook | Razorpay webhook handler |

### Public (`src/app/api/`)
| File | Route | Purpose |
|------|-------|---------|
| `contact/route.ts` | POST /api/contact | Contact form submission |
| `distributor/route.ts` | POST /api/distributor | Distributor form submission |
| `newsletter/route.ts` | POST /api/newsletter | Newsletter signup |
| `products/route.ts` | GET /api/products | List all products |
| `products/combo/route.ts` | GET /api/products/combo | Combo products |
| `upload/route.ts` | POST /api/upload | Cloudinary image upload |

### Auth (`src/app/api/auth/`)
| File | Route | Purpose |
|------|-------|---------|
| `google/route.ts` | GET /api/auth/google | Initiate Google OAuth |
| `google/callback/route.ts` | GET /api/auth/google/callback | OAuth callback |
| `session/route.ts` | GET /api/auth/session | Get current session |
| `signout/route.ts` | POST /api/auth/signout | Sign out |

---

## 4. Data Layer

### Data Files (`src/data/`)
| File | Purpose | Collection (MongoDB) |
|------|---------|---------------------|
| `products.json` | Product catalog | `products` |
| `products.ts` | Product data access functions | — |
| `product-types.ts` | Product + Variant type definitions | — |
| `categories.json` | Product categories | `categories` |
| `categories.ts` | Category data access functions | — |
| `company.json` | Company info (singleton) | `company` |
| `company.ts` | Company info access + cache | — |
| `navigation.ts` | Navigation items | — |
| `orders.ts` | Order data access | `orders` |
| `qualityProcess.json` | Quality process steps | `qualityProcess` |
| `qualityProcess.ts` | Quality process access | — |
| `testimonials.json` | Customer testimonials | `testimonials` |
| `testimonials.ts` | Testimonial access | — |
| `submissions/contact.json` | Contact form submissions | `contact` |
| `submissions/distributor.json` | Distributor submissions | `distributor` |
| `submissions/newsletter.json` | Newsletter signups | `newsletter` |

### Data Libraries (`src/lib/`)
| File | Purpose | Depends On |
|------|---------|------------|
| `db.ts` | MongoDB read/write with retry, bulk ops, indexes | `mongodb.ts` |
| `mongodb.ts` | MongoDB connection singleton | `MONGODB_URI` env |
| `data-store.ts` | File-system JSON read/write with cache | `fs`, `os`, `path` |
| `normalize.ts` | Normalizes raw product docs → `Product` type | `product-types.ts` |

---

## 5. Libraries / Services (`src/lib/`)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `razorpay.ts` | Razorpay order creation, verification, webhooks | `createRazorpayOrder`, `verifyRazorpaySignature`, `verifyWebhookSignature`, `getRazorpayKeyId`, `isRazorpayConfigured` |
| `auth.ts` | Google OAuth session signing/parsing | `signSession`, `parseSession`, `getSession` |
| `admin-auth.ts` | Admin credential validation + cookie check | `isAdminAuthenticated`, `validateCredentials` |
| `cloudinary.ts` | Cloudinary config + export | `initCloudinary`, default export |
| `order-schema.ts` | Zod schema for checkout form + Indian states | `checkoutSchema`, `CheckoutFormData`, `INDIAN_STATES` |
| `utils.ts` | `cn()` — classnames helper | `cn` |

---

## 6. Contexts

| File | Purpose | Key Exports |
|------|---------|-------------|
| `CartContext.tsx` | Cart state management (add, remove, quantity, localStorage) | `CartProvider`, `useCart`, `CartItem` |

---

## 7. Hooks

| File | Purpose |
|------|---------|
| `useAdminAuth.ts` | Client-side admin auth check — redirects to login if unauthenticated |

---

## 8. Types

| File | Purpose |
|------|---------|
| `types/index.ts` | `Product` interface (legacy — superseded by `product-types.ts`) |
| `types/product-types.ts` | `Product` + `Variant` interfaces (source of truth) |
| `types/images.d.ts` | Image type declarations |

---

## 9. Configuration

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config — image remote patterns |
| `next-env.d.ts` | Next.js type declarations |
| `proxy.ts` | Next.js proxy — admin route protection |
| `tsconfig.json` | TypeScript config |
| `.env` / `.env.local` / `.env.example` / `.env.vercel` | Environment variables |
| `eslint.config.mjs` | ESLint config |
| `postcss.config.mjs` | PostCSS config |

---

## 10. Dependency Map

### When a task mentions a topic, load these files:

#### **Footer phone number**
```
Footer.tsx
data/company.ts  →  /api/admin/data/company
```

#### **Hero section**
```
components/HeroSection.tsx
app/(pages)/page.tsx  →  imports HeroSection
public/images/hero-products.jpg
```

#### **Razorpay / Checkout / Payment**
```
lib/razorpay.ts
app/api/checkout/route.ts
app/api/orders/verify/route.ts
app/api/orders/create/route.ts
app/api/orders/webhook/route.ts
app/(pages)/checkout/page.tsx
app/(pages)/cart/page.tsx
lib/order-schema.ts  (checkout validation)
app/(pages)/order-success/page.tsx
app/(pages)/order-failed/page.tsx
.env  (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID)
```

#### **Product Variants**
```
data/product-types.ts  (Variant interface)
lib/normalize.ts  (variant normalization logic)
components/admin/VariantEditor.tsx
components/products/ProductCard.tsx
components/products/ProductDetailView.tsx
data/products.ts  (getProducts, getProductBySlug)
app/api/admin/data/[entity]/route.ts  (CRUD for products with variants)
app/api/products/route.ts
```

#### **Products (general)**
```
data/product-types.ts
data/products.ts
data/categories.ts
lib/normalize.ts
components/products/ProductCard.tsx
components/products/ProductDetailView.tsx
components/products/ProductsView.tsx
components/products/ProductsPageHeader.tsx
components/products/ProductImage.tsx
app/(pages)/products/page.tsx
app/(pages)/products/[slug]/page.tsx
app/api/products/route.ts
app/api/products/combo/route.ts
```

#### **Cart**
```
contexts/CartContext.tsx
components/CartIcon.tsx
app/(pages)/cart/page.tsx
components/products/ProductCard.tsx  (uses addItem)
components/products/ProductDetailView.tsx  (uses addItem)
```

#### **Company / Business Info**
```
data/company.ts
data/company.json
app/api/admin/data/[entity]/route.ts  (entity=company)
Footer.tsx  (displays company info)
ContactView.tsx  (displays company info)
app/(pages)/about/page.tsx
```

#### **Admin Authentication**
```
lib/admin-auth.ts
hooks/useAdminAuth.ts
app/admin/layout.tsx
app/api/admin/auth/login/route.ts
app/api/admin/auth/logout/route.ts
app/api/admin/auth/check/route.ts
proxy.ts
.env  (ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET)
```

#### **Google / User Auth**
```
lib/auth.ts
app/api/auth/google/route.ts
app/api/auth/google/callback/route.ts
app/api/auth/session/route.ts
app/api/auth/signout/route.ts
app/(pages)/signin/page.tsx
app/profile/page.tsx
app/profile/ProfileClient.tsx
.env  (NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
```

#### **Orders**
```
data/orders.ts  (via db.ts)
app/api/orders/create/route.ts
app/api/orders/list/route.ts
app/api/orders/[orderId]/route.ts
app/api/orders/verify/route.ts
app/api/admin/data/orders/route.ts
app/(pages)/orders/page.tsx
app/(pages)/orders/[orderId]/page.tsx
lib/razorpay.ts  (payment verification)
```

#### **Contact Form**
```
app/api/contact/route.ts
components/ContactSection.tsx
components/ContactView.tsx
data/submissions/contact.json
app/api/admin/submissions/contact/route.ts
```

#### **Distributor Form**
```
app/api/distributor/route.ts
components/DistributorSection.tsx
components/DistributorView.tsx
data/submissions/distributor.json
app/api/admin/submissions/distributor/route.ts
app/(pages)/distributor/page.tsx
```

#### **Newsletter**
```
app/api/newsletter/route.ts
components/NewsletterSection.tsx
data/submissions/newsletter.json
app/api/admin/submissions/newsletter/route.ts
```

#### **Categories**
```
data/categories.ts
data/categories.json
components/ProductCategories.tsx
app/api/admin/categories/page.tsx
app/(pages)/products/page.tsx
```

#### **Image Upload / Cloudinary**
```
lib/cloudinary.ts
app/api/upload/route.ts
next.config.ts  (remotePatterns)
.env  (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
```

#### **Navigation / Header**
```
data/navigation.ts
components/Header.tsx
components/AdminSidebar.tsx
app/api/admin/data/navigation/route.ts
components/PublicLayout.tsx
```

#### **SEO / Meta**
```
app/layout.tsx  (root metadata)
app/(pages)/page.tsx  (homepage metadata)
app/sitemap.ts
app/robots.ts
```

#### **Styling / Theme**
```
app/globals.css  (Tailwind v4 + CSS variables)
postcss.config.mjs
next.config.ts
```

---

## 11. Trigger Keywords

Use these to quickly resolve a natural-language request to relevant files:

| Keyword cluster | Load files from section |
|----------------|------------------------|
| phone, contact number, call, mobile, tel | Footer + company |
| hero, banner, headline, CTA, above fold | HeroSection + page |
| footer, copyright, links, social, address | Footer + company |
| payment, pay, razorpay, checkout, order, cart | Razorpay + Checkout + Orders |
| variant, size, SKU, stock, option, combo | Variants + product-types + normalize |
| product, item, SKU, catalogue, listing | Products section |
| category, browse, filter | Categories section |
| admin, dashboard, login, password, auth | Admin auth section |
| google, signin, session, profile, user auth | Auth section |
| contact form, enquiry, message | Contact section |
| distributor, partnership, dealer | Distributor section |
| newsletter, subscribe, email signup | Newsletter section |
| testimonial, review, feedback | Testimonials section |
| about, story, founder, quality process | About section |
| image, upload, photo, media, cloudinary | Cloudinary + upload |
| mongodb, database, DB, data store | db.ts + mongodb.ts + data-store.ts |
| navigation, menu, header, navbar | Navigation + Header |
| order status, tracking, order ID | Orders section |
| SEO, sitemap, robots, meta | SEO section |
| cart, add to cart, quantity | Cart section |
| shipping, address, pincode, state | Order schema + checkout |
| WhatsApp, floating, sticky button | FloatingContactActions |
| loading, animation, motion, transition | animations.tsx |

---

## 12. Environment Variables

| Variable | Used In | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `lib/mongodb.ts` | Database connection |
| `NEXTAUTH_SECRET` | `lib/auth.ts` | Session signing |
| `GOOGLE_CLIENT_ID` | `app/api/auth/google/route.ts` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | `app/api/auth/google/callback/route.ts` | Google OAuth |
| `ADMIN_USERNAME` | `lib/admin-auth.ts` | Admin login |
| `ADMIN_PASSWORD` | `lib/admin-auth.ts` | Admin login |
| `ADMIN_SESSION_SECRET` | `proxy.ts`, `lib/admin-auth.ts` | Admin session |
| `RAZORPAY_KEY_ID` | `lib/razorpay.ts` | Payment gateway |
| `RAZORPAY_KEY_SECRET` | `lib/razorpay.ts` | Payment verification |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `lib/razorpay.ts` | Client-side payment |
| `RAZORPAY_WEBHOOK_SECRET` | `lib/razorpay.ts` | Webhook verification |
| `CLOUDINARY_CLOUD_NAME` | `lib/cloudinary.ts` | Image hosting |
| `CLOUDINARY_API_KEY` | `lib/cloudinary.ts` | Image upload |
| `CLOUDINARY_API_SECRET` | `lib/cloudinary.ts` | Image upload |

---

## 13. Public Assets

| Path | Used For |
|------|----------|
| `images/Logo.png` | Site logo |
| `images/logoSW.PNG` | Alternate logo |
| `images/hero-products.jpg` | Hero section background |
| `images/product-*.svg/jpeg` | Product images (clearon, dish-sheen, fabrix, handpure, hygix, supreme) |
| `images/category-*.svg` | Category icons |
| `images/process-*.svg` | Quality process steps |
| `images/about-building.webp` | About page |
| `images/about-products.jpeg` | About page |
| `images/founder-swathi.jpg` | About page |
| `images/distributor-*` | Distributor page |
| `images/mega-pack-combo.jpg` | Mega pack section |
| `images/google-logo.png` | Google sign-in button |
