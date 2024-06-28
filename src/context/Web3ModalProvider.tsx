"use client"

import { config, projectId } from "@/config/web3"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { ReactNode } from "react"
import { WagmiProvider } from "wagmi"

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
})

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
