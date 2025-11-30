"use client";

import { usePathname } from "next/navigation";

export default function ConditionalMainAside() {
  // This component is intentionally a no-op now — aside is rendered in MainPage.
  const pathname = usePathname();
  return null;
}
