// Re-export all Sanity configuration from a single place
// Re-export core Sanity helpers that are safe for client and server usage.
export { client } from '../../sanity/lib/client'
export { urlFor } from '../../sanity/lib/image'
export { projectId, dataset, apiVersion } from '../../sanity/env'

// Note: `sanityFetch` and `SanityLive` (which call `defineLive`) are server-only
// utilities and must not be imported into client bundles. Import them directly
// from the Sanity package in server components when needed, for example:
// `import { sanityFetch } from '@/../../sanity/lib/live'`
