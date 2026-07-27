import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ProofPort Public Proof Logs",
    short_name: "ProofPort",
    description:
      "Publish wallet-signed proof logs for shipped work, add optional public HTTPS proof links, and share explorer receipts with no account required.",
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
        name: "Open homepage",
        short_name: "Home",
        description:
          "Open the ProofPort homepage to choose Celo or Stacks and review the public publishing basics.",
        url: "/",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml"
          }
        ]
      },
      {
        name: "Publish with Celo",
        short_name: "Celo",
        description:
          "Open the Celo wallet flow to publish a wallet-signed proof entry with an optional public HTTPS proof link.",
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
        description:
          "Open the Stacks wallet flow to publish a wallet-signed proof entry with an optional public HTTPS proof link.",
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
