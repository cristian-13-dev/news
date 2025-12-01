import type { PostPreview } from "@/types/post";
import { client } from "@/lib/sanity";
import { POSTS_QUERY } from "@/lib/queries";
import { Suspense } from "react";
import { Spinner } from "../sanityUi/spinner";
import { getLikesBySlugs } from "@/utils/Supabase/likes";
import Link from "next/link";
import { timeAgo, truncate, readingTime } from "@/lib/textUtils";
import MainAsideTags from "./MainAsideTags";

export default async function MainAside() {
  const posts = (await client.fetch(POSTS_QUERY)) as PostPreview[];
  const slugs = posts
    .map((post) =>
      typeof post.slug === "string" ? post.slug : (post.slug?.current ?? "")
    )
    .filter(Boolean);

  // Fetch likes map for all slugs
  const likesMap = await getLikesBySlugs(slugs);

  const tagSet = new Set<string>();
  for (const p of posts) {
    if (!p.categories) continue;
    for (const c of p.categories) if (c?.title) tagSet.add(c.title);
  }
  const tags = Array.from(tagSet)

  return (
    <aside className="hidden xl:block border-l w-sm border-gray-200 bg-white p-6 self-stretch sticky top-0 h-[calc(100vh-50px)] overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-black">Most Read Insights</h2>
          <p className="text-xs text-gray-500">Fresh perspectives from our editors</p>
        </div>
        <Link href="/about" className="text-xs text-blue-600 hover:underline">About</Link>
      </div>

      <Suspense fallback={<Spinner />}>
        <div className="mt-4 flex flex-col gap-3">
          {posts.map((post) => {
            const slug =
              typeof post.slug === "string"
                ? post.slug
                : (post.slug?.current ?? "");

            const likes = (likesMap && likesMap[slug]) || 0;

            return (
                <Link
                  key={slug}
                  href={`/articles/${slug}`}
                  className="group flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition"
                  aria-label={post.title}
                >
                  <div className="min-w-0 flex-1">
                  <h3
                    className="text-sm font-semibold text-black group-hover:underline line-clamp-2"
                    style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="truncate">{post.author?.name ?? "Editorial"}</span>
                    <span>·</span>
                    <span>{timeAgo(post.publishedAt)} ago</span>
                    <span className="ml-auto flex items-center gap-1 text-gray-600">
                    {/* Lucide Heart Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="#464646"
                      stroke="#464646"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart w-4 h-4"
                      
                    >
                      <path d="M19.5 13.572 12 21l-7.5-7.428A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 7.5 8.072"/>
                    </svg>
                    <span>{likes}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{truncate(post.excerpt ?? "", 100)}</p>
                  </div>
                </Link>
            );
          })}
        </div>

        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-semibold">Quick Read</h4>
          <p className="text-xs text-gray-500 mt-1">Top picks and short summaries for busy readers.</p>

          <MainAsideTags tags={tags} />

          <div className="mt-4">
            <Link href="/subscribe" className="inline-block w-full text-center bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700">Subscribe</Link>
          </div>
        </div>
      </Suspense>
    </aside>
  );
}
