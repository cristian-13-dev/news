import { getSupabaseAdmin } from './supabase-admin'

export async function getLikesBySlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) return {}
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('likes')
    .select('post_slug, likes')
    .in('post_slug', slugs)

  if (error) throw error

  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    if (row.post_slug) map[row.post_slug] = Number(row.likes ?? 0)
  }
  return map
}

export async function hasIpLiked(post_slug: string, ip: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('post_likes_ips')
    .select('id')
    .eq('post_slug', post_slug)
    .eq('ip', ip)
    .maybeSingle()

  if (error) throw error
  return !!data
}

export async function addIpLike(post_slug: string, ip: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('post_likes_ips').insert({ post_slug, ip }).select()
  if (error) throw error
}

export async function removeIpLike(post_slug: string, ip: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('post_likes_ips').delete().eq('post_slug', post_slug).eq('ip', ip)
  if (error) throw error
}
