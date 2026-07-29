import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/"
    },
    ...(appUrl
      ? {
          host: appUrl,
          sitemap: `${appUrl}/sitemap.xml`
        }
      : {})
  };
}
