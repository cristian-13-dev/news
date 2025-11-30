import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/Supabase/supabase-admin'
import { hasIpLiked, addIpLike, removeIpLike } from '@/utils/Supabase/likes'
import { getWithCache } from '@/lib/likesCache'

function getIpFromRequest(req: Request) {
  // prefer forwarded header (Vercel/Proxies)
  const xf = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
  if (xf) return xf.split(',')[0].trim()
  // fallback to connection remote address not available in Next.js Request; return empty
  return ''
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any))
  const { slug, action } = body

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
    // Lookup by post_slug column in your DB
    const { data: existing, error: selectError } = await supabase
      .from('likes')
      .select('likes')
      .eq('post_slug', slug)
      .maybeSingle()

    if (selectError) {
      return NextResponse.json({ ok: false, error: selectError.message }, { status: 500 })
    }

    const ip = getIpFromRequest(req)

    // If action is increment we must enforce one-like-per-ip
    if (action !== 'decrement') {
      try {
        const already = ip ? await hasIpLiked(slug, ip) : false
        if (already) {
          return NextResponse.json({ ok: false, error: 'You already liked this post' }, { status: 409 })
        }
      } catch (e: any) {
      }
    }

    if (existing) {
      const delta = action === 'decrement' ? -1 : 1
      const newLikes = Math.max(0, (existing.likes ?? 0) + delta)
      const { error: updateError } = await supabase
        .from('likes')
        .update({ likes: newLikes })
        .eq('post_slug', slug)

      if (updateError) {
        return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 })
      }

      // maintain ips table
      try {
        if (action === 'decrement' && ip) await removeIpLike(slug, ip)
        if (action !== 'decrement' && ip) await addIpLike(slug, ip)
      } catch (e) {
      }

      return NextResponse.json({ ok: true, likes: newLikes })
    }

    // create new row
    const insert = { post_slug: slug, likes: action === 'decrement' ? 0 : 1 }
    const { data: inserted, error: insertError } = await supabase
      .from('likes')
      .insert(insert)
      .select()
      .maybeSingle()

    if (insertError) {
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
    }

    try {
      if (action !== 'decrement' && ip) await addIpLike(slug, ip)
    } catch (e) {
    }

    return NextResponse.json({ ok: true, likes: inserted?.likes ?? insert.likes, row: inserted ?? insert })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')

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
    const likes = await getWithCache(slug, fetcher)

    return NextResponse.json({ ok: true, likes })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
