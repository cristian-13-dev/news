import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/Supabase/supabase-admin'

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
      console.error('supabase select error', selectError)
      return NextResponse.json({ ok: false, error: selectError.message }, { status: 500 })
    }

    if (existing) {
      const delta = action === 'decrement' ? -1 : 1
      const newLikes = Math.max(0, (existing.likes ?? 0) + delta)
      const { error: updateError } = await supabase
        .from('likes')
        .update({ likes: newLikes })
        .eq('post_slug', slug)

      if (updateError) {
        console.error('supabase update error', updateError)
        return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 })
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
      console.error('supabase insert error', insertError)
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, likes: inserted?.likes ?? insert.likes, row: inserted ?? insert })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
