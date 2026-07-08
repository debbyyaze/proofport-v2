import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProofPort",
    short_name: "ProofPort",
    description:
      "Public proof logs for shipped work and wallet-signed records.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f2e8",
    theme_color: "#f6f2e8",
    lang: "en",
    dir: "ltr",
    categories: ["developer", "productivity", "finance"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
