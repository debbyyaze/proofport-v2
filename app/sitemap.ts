import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

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
