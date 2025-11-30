import type { PostPreview } from "@/types/post";
import { client } from "@/lib/sanity";
import { POSTS_QUERY } from "@/lib/queries";
import { Suspense } from "react";
import { Spinner } from "../sanityUi/spinner";
import { getLikesBySlugs } from "@/utils/Supabase/likes";
import Link from "next/link";

export default async function MainAside() {
  const posts = (await client.fetch(POSTS_QUERY)) as PostPreview[];
  const slugs = posts
    .map((post) =>
      typeof post.slug === "string" ? post.slug : (post.slug?.current ?? "")
    )
    .filter(Boolean);

  // Fetch likes map for all slugs
  const likesMap = await getLikesBySlugs(slugs);

  return (
    <aside className="hidden xl:block border-l w-sm border-gray-200 bg-white p-6 self-stretch sticky top-0 h-[calc(100vh-50px)] overflow-auto">
      <div className="flex flex-col">
        <h2 className="font-semibold text-black">Most Read Insights</h2>
      </div>

      <Suspense fallback={<Spinner />}>
        <div className="mt-4 flex flex-col gap-3">
          {posts.map((post) => {
            const slug =
              typeof post.slug === "string"
                ? post.slug
                : (post.slug?.current ?? "");

            return (
              <Link
                key={slug}
                href={`/articles/${slug}`}
                className="text-sm hover:underline"
              >
                <div>{post.title}</div>
              </Link>
            );
          })}
        </div>
      </Suspense>
    </aside>
  );
}
