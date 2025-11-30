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

  // Prefer upserting by post id (Sanity _id). If not available, fall back to slug.
  const upsertPayload: Record<string, any> = { likes: 0 }
  if (postId) upsertPayload.post_id = postId
  if (slug) upsertPayload.slug = typeof slug === 'string' ? slug : slug.current

  const conflictCol = postId ? 'post_id' : 'slug'

  const { error } = await supabaseAdmin.from('likes').upsert(upsertPayload, { onConflict: conflictCol })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}