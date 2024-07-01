import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"

import { cookieStorage, createStorage } from "wagmi"
import { polygon, sepolia, mainnet } from "wagmi/chains"

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

if (!projectId) throw new Error("Project ID is not defined")

const metadata = {
  name: "Hive Network",
  description: "Decentralized AI Agent Network",
  url: "https://hivenetwork.ai",
  icons: ["https://avatars.mywebsite.com/"],
}

// Create wagmiConfig
const chains = [sepolia, polygon, mainnet] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})
