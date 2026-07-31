# Vercel Deployment Guide — Suraj Cleaning

## Environment Variables

All variables must be set in the Vercel project settings (Dashboard -> Settings -> Environment Variables).

### Server-Only Variables (never exposed to browser)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `ADMIN_USERNAME` | Yes | Admin login username |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `ADMIN_SESSION_SECRET` | Yes | Session signing secret (random 32+ chars) |
| `NEXTAUTH_SECRET` | Yes | Google OAuth session secret (random 64 chars) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Recommended | Razorpay webhook verification secret |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `NEXTAUTH_URL` | Yes | Full URL of the deployed site |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL |
| `NEXT_PUBLIC_ADMIN_URL` | Yes | Admin URL |

### Public Variables (exposed to browser)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Razorpay key ID for client-side checkout |

## Required Values

The following values must be provided from the local `.env` file:
- `MONGODB_URI` — copy from `.env` (MONGODB_URI section)
- `ADMIN_USERNAME` — copy from `.env`
- `ADMIN_PASSWORD` — copy from `.env`
- `ADMIN_SESSION_SECRET` — copy from `.env`
- `GOOGLE_CLIENT_ID` — copy from `.env`
- `GOOGLE_CLIENT_SECRET` — copy from `.env`
- `NEXTAUTH_SECRET` — copy from `.env`
- `RAZORPAY_KEY_ID` — copy from `.env`
- `RAZORPAY_KEY_SECRET` — copy from `.env`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — copy from `.env`
- `CLOUDINARY_CLOUD_NAME` — copy from `.env`
- `CLOUDINARY_API_KEY` — copy from `.env`
- `CLOUDINARY_API_SECRET` — copy from `.env`

Also update to production URLs:
- `NEXTAUTH_URL` — set to the production deployment URL
- `NEXT_PUBLIC_SITE_URL` — set to the production deployment URL
- `NEXT_PUBLIC_ADMIN_URL` — set to the production admin URL

Optional but recommended:
- `RAZORPAY_WEBHOOK_SECRET` — generate a random string for webhook signature verification

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
vercel login
vercel link
```

### 2. First Deploy

```bash
npm install
vercel --prod
```

### 3. Set Environment Variables in Vercel

```bash
vercel env add MONGODB_URI production
vercel env add ADMIN_USERNAME production
vercel env add ADMIN_PASSWORD production
vercel env add ADMIN_SESSION_SECRET production
vercel env add NEXTAUTH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_ADMIN_URL production
vercel env add RAZORPAY_KEY_ID production
vercel env add RAZORPAY_KEY_SECRET production
vercel env add RAZORPAY_WEBHOOK_SECRET production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
```

Or set them via the Vercel Dashboard (Settings -> Environment Variables).

### 4. Verify Environment Variables Are Set

```bash
vercel env ls
```

### 5. Trigger a Fresh Production Deploy

```bash
vercel --prod
```

### 6. Run MongoDB Migration

After the first successful deploy, populate the database:

```bash
npx tsx scripts/migrate-to-mongodb.ts
```

This script reads the JSON files in `src/data/` and writes them to MongoDB collections.

## Razorpay Test vs Live

**Current state:** `.env` uses live Razorpay keys.

To switch to test mode:
1. Get test keys from Razorpay Dashboard (Test mode section)
2. Replace `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` with test values
3. Redeploy

## Verify the Deployment

1. **Health check:** `curl https://your-app.vercel.app/api/health`
   - Expected: `{"status":"ok","mongodb":"connected"}`

2. **Homepage:** Visit the production URL — products should load without errors

3. **Admin login:** Visit `/admin/login` and log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`

4. **Products page:** Visit `/products` — should display all products

5. **Order flow:** Complete a checkout with COD — verify order appears in `/orders`

## Notes

- Do NOT push to Vercel if credentials are missing
- The `.env` file contains live credentials and should never be committed to version control
- `.env.example` contains only placeholder values for reference
- Admin credentials should be changed from defaults before going live
