"use client";

import React from "react";
import Link from "next/link";
import type { PostPreview } from "@/types/post";
import { timeAgo, truncate } from "@/lib/textUtils";
import { useFilter } from "@/context/filter";

type Props = {
  posts: PostPreview[];
  likesMap: Record<string, number>;
  tags: string[];
};

export default function MainAsideClient({ posts, likesMap, tags }: Props) {
  const { setSelectedTags, selectedTags } = useFilter();

  return (
    <aside className="hidden xl:block border-l w-sm border-gray-200 bg-white p-6 self-stretch sticky top-0 h-[calc(100vh-50px)] overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-black">Most Read Insights</h2>
          <p className="text-xs text-gray-500">Fresh perspectives from our editors</p>
        </div>
        <Link href="/about" className="text-xs text-blue-600 hover:underline">
          About
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {posts.map((post) => {
          const slug = typeof post.slug === "string" ? post.slug : post.slug?.current ?? "";
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
                      <path d="M19.5 13.572 12 21l-7.5-7.428A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 7.5 8.072" />
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

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.length ? (
            tags
              .slice()
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(t) ? prev.filter((tag) => tag !== t) : [...prev, t]
                    )
                  }
                  className={`text-xs px-2 py-1 rounded ${selectedTags.includes(t) ? "bg-neutral-300 text-neutral-700" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
                >
                  {t}
                </button>
              ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
        </div>

        <div className="mt-4">
          <Link href="/subscribe" className="inline-block w-full text-center bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700">
            Subscribe
          </Link>
        </div>
      </div>
    </aside>
  );
}
