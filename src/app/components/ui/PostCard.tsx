import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/textUtils'
import { CategoryBadges } from './CategoryBadges'
import type { PostListItem } from '@/types/sanity'

interface PostCardProps {
  post: PostListItem
}

export function PostCard({ post }: PostCardProps) {
  const redirectUrl = `/articles/${post.slug.current}`
  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
      {post.mainImage && (
        <Link href={redirectUrl}>
          <div className="relative w-full h-48">
            <Image
              src={urlFor(post.mainImage).width(600).height(400).url()}
              alt={post.mainImage.alt || post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </Link>
      )}
      
      <div className="p-4">
        <Link href={redirectUrl}>
          <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        
        {post.author && (
          <p className="text-sm text-gray-600 mb-2">
            By {post.author.name}
          </p>
        )}
        
        {post.publishedAt && (
          <p className="text-sm text-gray-500 mb-3">
            {formatDate(post.publishedAt)}
          </p>
        )}
        
        {post.categories && (
          <CategoryBadges categories={post.categories} />
        )}
      </div>
    </article>
  )
}
