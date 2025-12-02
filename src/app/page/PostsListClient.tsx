"use client";

import React from "react";
import type { PostPreview } from "@/types/post";
import ArticleCard from "@/app/components/ui/ArticleCard";
import { useFilter } from "@/context/filter";

type Props = {
  posts: PostPreview[];
  likesMap: Record<string, number>;
};

export default function PostsListClient({ posts, likesMap }: Props) {
  const { selectedTags } = useFilter();

  const getSlug = (s: PostPreview["slug"]) =>
    typeof s === "string" ? s : s?.current ?? "";

  const postsToRender = selectedTags.length
    ? posts.filter((p) =>
        Boolean(
          p.categories?.some((c) => selectedTags.includes(c.title ?? ""))
        )
      )
    : posts;

  return (
    <section className="divide-y divide-gray-200">
      {postsToRender.map((post) => {
        const slug = getSlug(post.slug);
        return (
          <ArticleCard
            key={post._id}
            post={post}
            slug={slug}
            initialLikes={likesMap[slug] ?? 0}
          />
        );
      })}
    </section>
  );
}
