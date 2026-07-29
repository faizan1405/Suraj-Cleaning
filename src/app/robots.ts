import { site } from "@/config/site";

export default function robots() {
  const base = site.domain;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
