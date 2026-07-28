import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
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
  metadataBase: new URL("https://www.swarajenterprises.co"),
  title: {
    default: "Swaraj Enterprises - Premium Cleaning Solutions | Clean Homes, Happy Lives",
    template: "%s | Swaraj Enterprises",
  },
  description:
    "Swaraj Enterprises - Your trusted partner for premium cleaning solutions in Karnataka, India. Floor Care, Bathroom Care, Kitchen Care, Laundry Care, Personal Care products.",
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
  authors: [{ name: "Swaraj Enterprises" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.swarajenterprises.co",
    siteName: "Swaraj Enterprises",
    title: "Swaraj Enterprises - Premium Cleaning Solutions",
    description:
      "Clean Homes, Happy Lives. Premium cleaning products for every need.",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Swaraj Enterprises - Premium Cleaning Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swaraj Enterprises - Premium Cleaning Solutions",
    description: "Clean Homes, Happy Lives",
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
              name: "Swaraj Enterprises",
              description:
                "Premium cleaning solutions - Floor Care, Bathroom Care, Kitchen Care, Laundry Care, Personal Care",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bantwala",
                addressRegion: "Karnataka",
                addressCountry: "IN",
              },
              telephone: "+919844734939",
              email: "swarajenterprisesco@gmail.com",
              openingHours: "Mo-Sa 09:00-19:00",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body text-[var(--text)]">
        <GlobalErrorBoundary>
          <PublicLayout>{children}</PublicLayout>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
