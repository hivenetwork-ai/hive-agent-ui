"use client"

import StoreProvider from "@/context/StoreProvider"
import { PropsWithChildren } from "react"

export default function RootTemplate({ children }: PropsWithChildren) {
  return <StoreProvider>{children}</StoreProvider>
}
