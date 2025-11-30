import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const allowedSecret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  // Verify secret
  const urlSecret = req.nextUrl.searchParams.get('secret');
  
  if (!urlSecret || !allowedSecret || urlSecret !== allowedSecret) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({} as any));
    
    // Extract document info from webhook payload
    const slug = body?.slug?.current || body?.slug;
    const docType = body?._type;
    
    // webhook received: { slug, docType }

    // Revalidate specific paths
    if (slug && docType === 'post') {
      revalidatePath(`/posts/${slug}`);
      // revalidate path /posts/${slug}
    }

    // Revalidate posts listing
    revalidatePath('/posts');
    // revalidate path: /posts

    // Revalidate home page
    revalidatePath('/');
    // revalidate path: /

    // Revalidate by tag (if using tagged cache)
    if (docType) {
      revalidateTag(docType);
      // revalidate tag: ${docType}
    }

    return NextResponse.json({ 
      ok: true, 
      revalidated: { slug, docType },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // revalidate error
    return NextResponse.json(
      { ok: false, error: String(error) }, 
      { status: 500 }
    );
  }
}
