"use client"

import { usePathname } from "next/navigation"
import Navigation from "./Navigation"

export default function ConditionalNavigation() {
  const pathname = usePathname() || ""

  if (pathname.includes("/studio")) return null

  return <Navigation />
}
