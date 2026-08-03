import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ProofPort",
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
          "Compare the Celo and Stacks publishing paths before posting a public proof entry.",
        url: "/",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      {
        name: "Publish with Celo",
        short_name: "Celo",
        description:
          "Open the MiniPay-ready Celo publishing path and share its explorer receipt with no account required.",
        url: "/celo",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      {
        name: "Publish with Stacks",
        short_name: "Stacks",
        description:
          "Open the Bitcoin-linked Stacks publishing path and share its explorer receipt with no account required.",
        url: "/stacks",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      }
    ],
    icons: [
      {
        src: "/logo.svg",
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
