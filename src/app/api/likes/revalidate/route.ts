import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/Supabase/supabase-admin'
import { revalidate as revalidateCache } from '@/lib/likesCache'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any))
  const { slug } = body

  if (!slug) {
    return NextResponse.json({ ok: false, error: 'Missing slug' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server env not configured' }, { status: 500 })
  }

  try {
    const fetcher = async (): Promise<number> => {
      const { data, error } = await supabase
        .from('likes')
        .select('likes')
        .eq('post_slug', slug)
        .maybeSingle()

      if (error) throw error
      return data?.likes ?? 0
    }

    const likes = await revalidateCache(slug, fetcher)
    return NextResponse.json({ ok: true, likes })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
