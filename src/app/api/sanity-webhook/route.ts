import { NextResponse } from 'next/server'
import { POST as insertLikesHandler } from '@/utils/Supabase/insertLikes'

export async function POST(req: Request) {
  return await insertLikesHandler(req)
}