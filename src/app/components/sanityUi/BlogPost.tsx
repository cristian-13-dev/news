import { PortableText } from '@portabletext/react'
import { components } from '@/app/components/PortableTextComponents'
import type { Post } from '@/types/sanity'

interface BlogPostProps {
  post: Post
}

export default function BlogPost({ post }: BlogPostProps) {
  if (!post.body) return null
  
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <PortableText value={post.body} components={components} />
    </article>
  )
}
