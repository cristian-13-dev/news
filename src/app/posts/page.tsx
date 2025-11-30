import { sanityFetch } from '@/../../sanity/lib/live'
import { POSTS_QUERY } from '@/lib/queries'
import { PostCard } from '@/app/components/ui/PostCard'
import type { PostListItem } from '@/types/sanity'
import { title } from 'process'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export const metadata = {title: 'Posts'}

export default async function PostsPage() {
  const { data: posts } = await sanityFetch({
    query: POSTS_QUERY,
    tags: ['post'], 
  }) as { data: PostListItem[] }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          No posts found. Create your first post in Sanity Studio!
        </p>
      )}
    </div>
  )
}
