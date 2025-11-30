import { sanityFetch } from "@/../../sanity/lib/live";
import { client } from "@/lib/sanity";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { components } from "@/app/components/PortableTextComponents";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { BackButton } from "@/app/components/ui/BackButton";
import { CategoryBadges } from "@/app/components/ui/CategoryBadges";
import { AuthorInfo } from "@/app/components/ui/AuthorInfo";
import { PostImage } from "@/app/components/ui/PostImage";
import type { Post } from "@/types/sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { SITE_URL } from "@/lib/website";

export const revalidate = 60;

async function fetchPost(slug: string): Promise<Post | null> {
  const res = (await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: ["post", `post:${slug}`],
  })) as { data: Post | null };
  return res?.data ?? null;
}

async function fetchPostMeta(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "description": coalesce(excerpt, pt::text(body)[0..150]),
      "imageUrl": mainImage.asset->url,
      publishedAt,
      "authorName": author->name
    }`,
    { slug }
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; description?: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = (await params) as { slug: string; description?: string };
  const { slug, description } = resolvedParams;

  const meta = description ? { title: undefined, description } : await fetchPostMeta(slug);

  if (!meta) return { title: "Post" };

  const url = `${SITE_URL}/posts/${slug}`;

  return {
    title: (meta as any).title || undefined,
    description: (meta as any).description || undefined,
    openGraph: {
      title: (meta as any).title || undefined,
      description: (meta as any).description || undefined,
      type: "article",
      publishedTime: (meta as any).publishedAt,
      authors: (meta as any).authorName ? [(meta as any).authorName] : undefined,
      url,
      images: (meta as any).imageUrl
        ? [{ url: (meta as any).imageUrl, alt: (meta as any).title }]
        : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await client.fetch<Array<{ slug: string; description?: string }>>(
    `*[_type == "post"]{ "slug": slug.current, "description": coalesce(excerpt, pt::text(body)[0..150]) }`
  );

  return posts.map((post) => ({ slug: post.slug, description: post.description }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string; description?: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams as { slug: string; description?: string };

  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {post?.categories && <CategoryBadges categories={post.categories} />}

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 mt-6 leading-tight text-gray-900">
          {post?.title}
        </h1>

        <div className="mb-10 pb-8 border-b border-gray-200">
          {post?.author && (
            <AuthorInfo author={post.author} publishedAt={post.publishedAt} />
          )}
        </div>

        {post?.mainImage && (
          <div className="mb-10">
            <PostImage image={post.mainImage} title={post.title} priority />
          </div>
        )}

        {post?.body && (
          <div className="prose prose-lg prose-gray max-w-none">
            <PortableText value={post.body} components={components} />
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200">
          <BackButton href="/articles" label="Back to all posts" />
        </div>
      </main>
    </article>
  );
}
