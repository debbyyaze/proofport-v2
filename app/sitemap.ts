import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  const lastModified = new Date("2026-07-27T00:00:00.000Z");

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
