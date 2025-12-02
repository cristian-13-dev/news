"use client";

import React from "react";
import { FilterProvider } from "@/context/filter";
import PostsListClient from "./PostsListClient";
import MainAsideClient from "./MainAsideClient";
import type { PostPreview } from "@/types/post";

type Props = {
  posts: PostPreview[];
  likesMap: Record<string, number>;
  tags: string[];
};

export default function FilterShell({ posts, likesMap, tags }: Props) {
  return (
    <FilterProvider>
      <div className="flex flex-col xl:flex-row gap-8 items-stretch mx-auto max-w-[1500px] w-full h-full overflow-auto hide-scrollbar">
        <div className="flex-1 min-h-0">
          <main className="w-full py-6 px-4 sm:px-6 max-w-full flex justify-center flex-1 min-h-0">
            <div className="max-w-3xl mx-auto">
              <div className="w-full" aria-hidden />
              <header className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Latest Papers</h1>
                <p className="mt-2 text-sm text-black/70">Data-driven research and analysis that highlight what truly matters.</p>
              </header>

              <PostsListClient posts={posts} likesMap={likesMap} />
            </div>
          </main>
        </div>

        <MainAsideClient posts={posts} likesMap={likesMap} tags={tags} />
      </div>
    </FilterProvider>
  );
}
