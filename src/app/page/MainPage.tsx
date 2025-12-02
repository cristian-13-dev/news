import { client } from "@/lib/sanity";
import { POSTS_QUERY } from "@/lib/queries";
import ArticleCard from "@/app/components/ui/ArticleCard";
import { getLikesBySlugs } from "@/utils/Supabase/likes";
import FilterShell from "./FilterShell";

import type { PostPreview } from "@/types/post";

export default async function MainPage() {
  const posts = (await client.fetch(POSTS_QUERY)) as PostPreview[];
  const getSlug = (s: PostPreview["slug"]) =>
    typeof s === "string" ? s : (s?.current ?? "");

  const selectedTags: string[] = [];

  const postsToRender = selectedTags.length
    ? posts.filter((p) =>
        Boolean(
          p.categories?.some((c) => selectedTags.includes(c.title ?? ""))
        )
      )
    : posts;

  const slugs = posts.map((p) => getSlug(p.slug)).filter(Boolean);
  const likesMap = await getLikesBySlugs(slugs);

  const tagSet = new Set<string>();
  for (const p of posts) {
    if (!p.categories) continue;
    for (const c of p.categories) if (c?.title) tagSet.add(c.title);
  }
  const tags = Array.from(tagSet);

  return (
    <div className="w-full flex flex-col flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row gap-8 items-stretch mx-auto max-w-[1500px] w-full h-full overflow-auto hide-scrollbar">
        <FilterShell posts={posts} likesMap={likesMap} tags={tags} />
      </div>
    </div>
  );
}
