import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { business, contact, site } from "@/config/site";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.description,
  keywords: [...site.keywords] as string[],
  authors: [{ name: site.author }],
  icons: {
    icon: business.favicon,
    apple: business.favicon,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.domain,
    siteName: business.name,
    title: `${business.name} - Premium Cleaning Solutions`,
    description: business.tagline,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${business.name} - Premium Cleaning Solutions`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} - Premium Cleaning Solutions`,
    description: business.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Structured Data - LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: business.name,
              description: business.description,
              address: {
                "@type": "PostalAddress",
                streetAddress: contact.address,
                addressLocality: contact.city,
                addressRegion: contact.state,
                postalCode: contact.pincode,
                addressCountry: contact.country,
              },
              telephone: `+${contact.phoneRaw}`,
              email: contact.email,
              openingHours: contact.hours,
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body text-[var(--text)]">
        <GlobalErrorBoundary>
          <CartProvider>
            <PublicLayout>{children}</PublicLayout>
          </CartProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
