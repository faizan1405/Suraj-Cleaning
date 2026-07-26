import { MetadataRoute } from "next";

const base = "https://swarajenterprises.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "#about",
    "#products",
    "#benefits",
    "#distributor",
    "#contact",
  ];

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
