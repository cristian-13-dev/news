import { timeAgo, truncate } from "@/lib/textUtils";
import type { Props } from "../../page/MainAsideClient";
import Link from "next/link";

export default function MostLikedSection({ posts, likesMap }: Props) {
  return (
    <aside>
      <div>
        <h2 className="font-semibold text-black">Most Liked Insights</h2>
        <p className="text-xs text-gray-500">
          Fresh perspectives from our editors
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {posts
          ?.map((post) => {
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
                    <span className="truncate">
                      {post.author?.name ?? "Editorial"}
                    </span>
                    <span>·</span>
                    <span>
                      {timeAgo(post.publishedAt) !== "just now" &&
                        `${timeAgo(post.publishedAt)} ago`}
                    </span>
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
                  <p className="mt-2 text-xs text-gray-600">
                    {truncate(post.excerpt ?? "", 100)}
                  </p>
                </div>
              </Link>
            );
          })
          .sort((a, b) =>
            likesMap ? likesMap[b.key as string] - likesMap[a.key as string] : 0
          )
          .slice(0, 3)}
      </div>
    </aside>
  );
}
