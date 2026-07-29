/**
 * Central site configuration — single source of truth for all global settings.
 *
 * Update any value here and it propagates everywhere.
 * Admin-editable company info also reads from company.json at runtime,
 * but defaults are defined here.
 */

// ──────────────────────────────────────────────
// Business Information
// ──────────────────────────────────────────────
export const business = {
  /** Legal / full company name */
  name: "Swaraj Enterprises",
  /** Brand name used in logos and nav */
  brandName: "Swaraj Enterprises",
  /** Short tagline */
  tagline: "Clean Homes, Happy Lives",
  /** Full description for meta / about */
  description:
    "Your trusted partner for premium cleaning solutions. Clean Homes, Happy Lives.",
  /** Logo path (relative to /public) */
  logo: "/images/Logo.png",
  /** Favicon / apple-touch-icon path */
  favicon: "/images/Logo.png",
  /** Industry sector */
  industry: "Cleaning Products & FMCG",
  /** Year established */
  foundedYear: 2015,
} as const;

// ──────────────────────────────────────────────
// Contact Information
// ──────────────────────────────────────────────
export const contact = {
  /** Primary phone number (display format, e.g. "+91 98447 34939") */
  phone: "+91 98447 34939",
  /** Raw digits for tel: links (no spaces, no dashes) */
  phoneRaw: "919844734939",
  /** Secondary phone number */
  phone2: "+91 08246 81678",
  /** Raw digits for secondary phone */
  phone2Raw: "9188246816784",
  /** Primary email address */
  email: "swarajenterprises.co@gmail.com",
  /** Support email (falls back to primary) */
  supportEmail: "swarajenterprises.co@gmail.com",
  /** Full street address */
  address: "Aberottu House, Narikombu, Karnataka 574231",
  /** City */
  city: "Narikombu",
  /** State */
  state: "Karnataka",
  /** PIN / postal code */
  pincode: "574231",
  /** Country code */
  country: "IN",
  /** Business hours */
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
  /** OpenStreetMap / Google Maps embed URL */
  mapSrc:
    "https://maps.google.com/maps?q=Swaraj+Enterprises+Narikombu&output=embed",
  /** Maps query URL for "open in maps" links */
  mapsUrl: "https://maps.google.com/?q=Swaraj+Enterprises+Narikombu",
} as const;

// ──────────────────────────────────────────────
// Social Media Links
// ──────────────────────────────────────────────
export const social = {
  instagram: "https://www.instagram.com/swaraj_enterprises.co?igsh=MTBkaTFzM24xbjMwMw==",
  facebook: "",
  linkedin: "",
  youtube: "",
  twitter: "", // X/Twitter
  /** Default WhatsApp message for contact/order support */
  supportWhatsAppMessage: "Hi, I need support with my order.",
} as const;

// ──────────────────────────────────────────────
// Website Settings
// ──────────────────────────────────────────────
export const site = {
  /** Production domain (used for metadataBase, sitemap, robots, OG URLs) */
  domain: "https://www.swarajenterprises.co",
  /** Browser tab title template — %s is replaced by page name */
  titleTemplate: "%s | Swaraj Enterprises",
  /** Default (homepage) title */
  defaultTitle: "Swaraj Enterprises - Premium Cleaning Solutions | Clean Homes, Happy Lives",
  /** Meta description */
  description:
    "Swaraj Enterprises - Your trusted partner for premium cleaning solutions in Karnataka, India. Floor Care, Bathroom Care, Kitchen Care, Laundry Care, Personal Care products.",
  /** SEO keywords */
  keywords: [
    "Swaraj Enterprises",
    "cleaning products",
    "floor cleaner",
    "toilet cleaner",
    "handwash",
    "dishwash",
    "glass cleaner",
    "detergent",
    "FMCG",
    "Karnataka",
    "India",
  ],
  /** Copyright line — {year} is replaced with current year */
  copyright: "© {year} Swaraj Enterprises. All Rights Reserved.",
  /** Footer tagline */
  footerTagline: "Designed with <3 for a Cleaner Tomorrow",
  /** Author meta */
  author: "Swaraj Enterprises",
  /** OG image path */
  ogImage: "/images/og-image.webp",
} as const;

// ──────────────────────────────────────────────
// Shipping & Delivery
// ──────────────────────────────────────────────
export const shipping = {
  /** Delivery charge in INR */
  deliveryFee: 49,
  /** Minimum order for free delivery (INR) */
  freeDeliveryThreshold: 499,
  /** Cash on Delivery enabled */
  codEnabled: true,
  /** Estimated delivery text shown to users */
  deliveryEstimate: "3-5 business days",
  /** COD terms text */
  codTerms:
    "Please keep exact change ready. Our delivery partner will collect cash at the time of delivery. Orders can be cancelled before dispatch only.",
} as const;

// ──────────────────────────────────────────────
// Payment Settings
// ──────────────────────────────────────────────
export const payments = {
  /** Default currency code */
  currency: "INR",
  /** Currency symbol for display */
  currencySymbol: "₹",
  /** Tax percentage (0 = no tax) */
  taxPercent: 0,
  /** Tax label (e.g. "GST", "VAT") */
  taxLabel: "GST",
  /** Razorpay is configured / available */
  razorpayEnabled: true,
} as const;

// ──────────────────────────────────────────────
// Product Settings
// ──────────────────────────────────────────────
export const products = {
  /** Default product image when none is provided */
  defaultImage: "/images/default-product.png",
  /** Maximum quantity a user can add per cart item */
  maxCartQuantity: 99,
  /** Default stock status when not specified */
  defaultInStock: true,
  /** Product categories (used as fallback / defaults) */
  categories: [
    { id: "1", slug: "floor-care", name: "Floor Care" },
    { id: "2", slug: "bathroom-care", name: "Bathroom Care" },
    { id: "3", slug: "kitchen-care", name: "Kitchen Care" },
    { id: "4", slug: "laundry-care", name: "Laundry Care" },
    { id: "5", slug: "personal-care", name: "Personal Care" },
  ],
} as const;

// ──────────────────────────────────────────────
// Order Settings
// ──────────────────────────────────────────────
export const orders = {
  /** Order ID prefix */
  orderPrefix: "ORD",
  /** Auto-confirm orders on creation (for COD) */
  autoConfirmCod: true,
  /** Default order status */
  defaultStatus: "payment_pending" as const,
  /** Default COD order status */
  defaultCodStatus: "confirmed" as const,
  /** Admin notification email for new orders */
  notificationEmail: "swarajenterprises.co@gmail.com",
} as const;

// ──────────────────────────────────────────────
// Authentication Settings
// ──────────────────────────────────────────────
export const auth = {
  /** Google OAuth enabled */
  googleLoginEnabled: true,
  /** Email / password login enabled */
  emailLoginEnabled: true,
  /** Session expiry in seconds (default: 7 days) */
  sessionTimeoutSeconds: 7 * 24 * 60 * 60,
} as const;

// ──────────────────────────────────────────────
// Feature Toggles
// ──────────────────────────────────────────────
export const features = {
  /** Show announcement banner */
  announcementBanner: false,
  /** Announcement banner text (when enabled) */
  announcementText: "",
  /** Maintenance mode — blocks all non-admin access */
  maintenanceMode: false,
  /** Enable distributor enquiry form */
  distributorForm: true,
  /** Enable newsletter signup */
  newsletter: true,
  /** Enable testimonials section */
  testimonials: true,
  /** Enable quality process section */
  qualityProcess: true,
} as const;

// ──────────────────────────────────────────────
// Navigation Fallbacks
// ──────────────────────────────────────────────
export const navConfig = {
  /** Fallback nav items when admin hasn't customised them */
  fallbackItems: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Distributor", href: "/distributor" },
    { label: "Contact Us", href: "/contact" },
  ],
} as const;

// ──────────────────────────────────────────────
// Storage Keys
// ──────────────────────────────────────────────
export const storage = {
  /** LocalStorage key for the shopping cart */
  cartKey: "suraj-cleaning-cart",
} as const;

// ──────────────────────────────────────────────
// Convenience helpers
// ──────────────────────────────────────────────
/** Current year for copyright — updated at import time */
export const currentYear = new Date().getFullYear();

/** Copyright string with the current year substituted in */
export const copyrightLine =
  site.copyright.replace("{year}", String(currentYear));

/** Computed free delivery message */
export const freeDeliveryMessage = `Free delivery on orders above ${payments.currencySymbol}${shipping.freeDeliveryThreshold}!`;
