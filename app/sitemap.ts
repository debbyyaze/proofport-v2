import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (!appUrl) {
    return [];
  }

  const lastModified = new Date();

  return [
    {
      url: appUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${appUrl}/celo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${appUrl}/stacks`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];
}
