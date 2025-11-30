import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/Supabase/supabase-admin'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any))
  const { postId, slug, action } = body

  if (!postId && !slug) {
    return NextResponse.json({ ok: false, error: 'Missing postId or slug' }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server env not configured' }, { status: 500 })
  }

  try {
    // Determine lookup column
    if (postId) {
      const { data: existing } = await supabase.from('likes').select('likes').eq('post_id', postId).maybeSingle()
      if (existing) {
        const delta = action === 'decrement' ? -1 : 1
        const newLikes = Math.max(0, (existing.likes ?? 0) + delta)
        await supabase.from('likes').update({ likes: newLikes }).eq('post_id', postId)
        return NextResponse.json({ ok: true, likes: newLikes })
      } else {
        // create new row
        const insert = { post_id: postId, slug: slug ?? null, likes: action === 'decrement' ? 0 : 1 }
        await supabase.from('likes').insert(insert)
        return NextResponse.json({ ok: true, likes: insert.likes })
      }
    }

    // fallback: use slug
    const { data: existingSlug } = await supabase.from('likes').select('likes').eq('slug', slug).maybeSingle()
    if (existingSlug) {
      const delta = action === 'decrement' ? -1 : 1
      const newLikes = Math.max(0, (existingSlug.likes ?? 0) + delta)
      await supabase.from('likes').update({ likes: newLikes }).eq('slug', slug)
      return NextResponse.json({ ok: true, likes: newLikes })
    } else {
      const insert = { post_id: null, slug, likes: action === 'decrement' ? 0 : 1 }
      await supabase.from('likes').insert(insert)
      return NextResponse.json({ ok: true, likes: insert.likes })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
