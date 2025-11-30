import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from './supabase-admin'

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  if (!SANITY_WEBHOOK_SECRET || secret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({} as any))
  const slug =
    (body?.slug && typeof body.slug === 'string'
      ? body.slug
      : body?.slug?.current) || body?.document?.slug?.current

  const postId = body?.document?._id || body?._id || body?.document?.id || body?.id
  const docType = body?._type || body?.document?._type

  if (!postId && !slug) {
    return NextResponse.json({ ok: false, error: 'Not a post or missing id/slug' }, { status: 400 })
  }

  if (docType && docType !== 'post') {
    return NextResponse.json({ ok: false, error: 'Not a post' }, { status: 400 })
  }

  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server env not configured' }, { status: 500 })
  }

  // Upsert/create using the `post_slug` column (matches your DB schema)
  const slugString = slug ? (typeof slug === 'string' ? slug : slug.current) : null
  if (!slugString) {
    return NextResponse.json({ ok: false, error: 'Missing slug in payload' }, { status: 400 })
  }

  // Insert a row with post_slug and default likes = 0.
  // If you want upsert (no duplicates), add a UNIQUE constraint on post_slug in DB.
  const { data, error } = await supabaseAdmin.from('likes').insert({ post_slug: slugString, likes: 0 }).select().maybeSingle()

  if (error) {
    console.error('supabase insert error', error)
    return NextResponse.json({ ok: false, error: (error && (error as any).message) || String(error) }, { status: 500 })
  }

  return NextResponse.json({ ok: true, row: data ?? { post_slug: slugString, likes: 0 } })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}