import { NextResponse } from 'next/server'
import { supabaseAdmin } from './supabase-admin'

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
  const docType = body?._type || body?.document?._type

  if (!slug || docType !== 'post') {
    return NextResponse.json({ ok: false, error: 'Not a post or missing slug' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('Likes')
    .upsert({ slug, likes: 0 }, { onConflict: 'slug' })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}