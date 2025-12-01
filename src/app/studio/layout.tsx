import React from "react";
import type { ReactNode } from "react";

export const metadata = {
  title: "Sanity Studio",
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  // This layout breaks out of the root centered container so Sanity Studio
  // can render full-bleed and not inherit the app's max-width wrapper.
  // Use a fixed, full-viewport container so Studio is not affected by the
  // parent app wrapper and doesn't show white gutters on either side.
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
