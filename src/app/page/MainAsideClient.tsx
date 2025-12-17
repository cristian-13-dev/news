"use client";
import React from "react";
import type { PostPreview } from "@/types/post";
import MostLikedSection from "../components/ui/MostLikedSection";
import PostCategories from "../components/ui/PostCategories";

export type Props = {
  posts?: PostPreview[];
  likesMap?: Record<string, number>;
  tags?: string[];
};

export default function MainAsideClient({ posts, likesMap, tags }: Props) {

  return (
    <aside className="hidden xl:block border-l w-sm border-gray-200 bg-white p-6 self-stretch sticky top-0 h-[calc(100vh-50px)] overflow-auto">
      <MostLikedSection posts={posts} likesMap={likesMap} />
      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-semibold">Quick Read</h4>
        <p className="text-xs text-gray-500 mt-1">
          Top picks and short summaries for busy readers.
        </p>
        <PostCategories tags={tags} />
      </div>
    </aside>
  );
}
