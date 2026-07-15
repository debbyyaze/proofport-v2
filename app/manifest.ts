import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ProofPort",
    short_name: "ProofPort",
    description:
      "Public proof logs for shipped work, wallet-signed entries, and explorer-backed records.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f2e8",
    theme_color: "#f6f2e8",
    lang: "en",
    dir: "ltr",
    categories: ["developer", "productivity", "utilities"],
    shortcuts: [
      {
        name: "Publish with Celo",
        short_name: "Celo",
        description: "Open the Celo wallet flow to publish a proof entry.",
        url: "/celo",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml"
          }
        ]
      },
      {
        name: "Publish with Stacks",
        short_name: "Stacks",
        description: "Open the Stacks wallet flow to publish a proof entry.",
        url: "/stacks",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml"
          }
        ]
      }
    ],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
