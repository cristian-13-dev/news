const DEFAULT_TTL_MS = Number(process.env.LIKES_CACHE_TTL_MS) || 5000

type CacheEntry = {
  value: number
  expires: number
  inFlight?: Promise<number>
}

const cache = new Map<string, CacheEntry>()

export async function getWithCache(slug: string, fetcher: () => Promise<number>, ttlMs = DEFAULT_TTL_MS): Promise<number> {
  const now = Date.now()
  const existing = cache.get(slug)

  if (existing && existing.expires > now) {
    return existing.value
  }

  if (existing && existing.inFlight) {
    return existing.inFlight
  }

  const p = (async () => {
    try {
      const val = await fetcher()
      cache.set(slug, { value: val, expires: Date.now() + ttlMs })
      return val
    } catch (err) {
      const stale = cache.get(slug)
      if (stale && stale.value != null) return stale.value
      throw err
    } finally {
      const e = cache.get(slug)
      if (e && e.inFlight) delete e.inFlight
    }
  })()

  cache.set(slug, { value: existing?.value ?? 0, expires: existing?.expires ?? 0, inFlight: p })
  return p
}

export async function revalidate(slug: string, fetcher: () => Promise<number>, ttlMs = DEFAULT_TTL_MS): Promise<number> {
  const val = await fetcher()
  cache.set(slug, { value: val, expires: Date.now() + ttlMs })
  return val
}

export function getIfFresh(slug: string): number | undefined {
  const e = cache.get(slug)
  if (!e) return undefined
  if (e.expires > Date.now()) return e.value
  return undefined
}

export function clearCache() {
  cache.clear()
}

export { DEFAULT_TTL_MS }
