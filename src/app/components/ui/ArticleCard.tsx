"use client";

import React from 'react';
import Link from 'next/link';
import LikeButton from '../../../components/ui/LikeButton';
import { urlFor } from '@/lib/sanity';
import { formatDate, readingTime, plainTextFromPortableText, isWithinDays } from '@/lib/textUtils';

export default function ArticleCard({ post, slug, initialLikes }: { post: any; slug: string; initialLikes?: number; }) {
  const rawText = post.excerpt ?? plainTextFromPortableText(post.body);
  const description = rawText;

  return (
    <article className="py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
      <div className="sm:col-span-2">
        <div className="flex items-center gap-3 mb-3">
          {post.author?.image ? (
            <img
              src={urlFor(post.author.image).width(64).height(64).url()}
              alt={post.author?.name || 'Author'}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden" />
          )}

          <div className="leading-tight">
            <div className="text-sm text-black">{post.author?.name || 'Unknown'}</div>
            <div className="text-xs text-black/60">{formatDate(post.publishedAt)}</div>
          </div>
        </div>

        <Link href={`/articles/${slug}`} className="text-xl md:text-2xl font-bold text-black hover:underline inline-flex items-center">
          <span>
            {isWithinDays(post.publishedAt, 3) && (
              <span className="inline-block text-xs font-medium text-white mt-auto mr-2 bg-black px-2 py-0.5 rounded" style={{ position: 'relative', top: '-4px' }}>
                New
              </span>
            )}
            <span>{post.title}</span>
          </span>
        </Link>

        <div className="mt-3 text-sm text-black/70 whitespace-normal leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {post.categories?.slice(0, 2).map((cat: any) => (
                <span key={cat._id} className="text-xs bg-gray-100 text-black/70 px-2 py-0.5 rounded">{cat.title}</span>
              ))}
            </div>

            <div className="text-xs text-black/60 flex items-center gap-2">
              <p>{readingTime(post.body)}</p>
            </div>
          </div>

          <div>
            <LikeButton slug={slug} initialCount={initialLikes ?? 0} />
          </div>
        </div>
      </div>

      {post.imageUrl && (
        <div className="hidden sm:block md:col-span-1">
          <Link href={`/articles/${slug}`} className="block rounded-lg overflow-hidden shadow-sm">
            <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover rounded" />
          </Link>
        </div>
      )}
    </article>
  );
}
