'use client'

import config from '../../../../sanity.config'
import dynamic from 'next/dynamic'

// Disable SSR for Sanity Studio to prevent hydration errors
const StudioComponent = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Loading Sanity Studio...</p>
        </div>
      </div>
    )
  }
)

export function Studio() {
  return <StudioComponent config={config} />
}
