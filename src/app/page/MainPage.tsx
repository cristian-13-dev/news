import { client } from "@/lib/sanity";
import { POSTS_QUERY } from "@/lib/queries";
import ArticleCard from "@/app/components/ui/ArticleCard";
import { getLikesBySlugs } from "@/utils/Supabase/likes";
import MainAside from "@/app/components/ui/MainAside";

import type { PostPreview } from "@/types/post";

export default async function MainPage() {
  const posts = (await client.fetch(POSTS_QUERY)) as PostPreview[];
  const getSlug = (s: PostPreview["slug"]) =>
    typeof s === "string" ? s : (s?.current ?? "");

  const slugs = posts.map((p) => getSlug(p.slug)).filter(Boolean);
  const likesMap = await getLikesBySlugs(slugs);

  return (
    <div className="w-full flex flex-col flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row gap-8 items-stretch mx-auto max-w-[1500px] w-full h-full overflow-auto hide-scrollbar">
        <div className="flex-1 min-h-0">
          <main className="w-full py-6 px-4 sm:px-6 max-w-full flex justify-center flex-1 min-h-0">
            <div className="max-w-3xl mx-auto">
              <div className="w-full" aria-hidden />
              <header className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Latest Papers
                </h1>
                <p className="mt-2 text-sm text-black/70">
                  Data-driven research and analysis that highlight what truly
                  matters.
                </p>
              </header>

              <section className="divide-y divide-gray-200">
                {posts.map((post) => {
                  const slug = getSlug(post.slug);
                  return (
                    <ArticleCard key={post._id} post={post} slug={slug} initialLikes={likesMap[slug] ?? 0} />
                  );
                })}
              </section>
            </div>
          </main>
        </div>

        <MainAside />
      </div>
    </div>
  );
}
