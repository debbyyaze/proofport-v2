import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (!appUrl) {
    return [];
  }

  return [
    {
      url: appUrl,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${appUrl}/celo`,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${appUrl}/stacks`,
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];
}
