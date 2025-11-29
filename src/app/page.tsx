export const metadata = { title: "Welcome" };

import { client, urlFor } from "@/lib/sanity";
import { POSTS_QUERY } from "@/lib/queries";
import Link from "next/link";
import {
  formatDate,
  readingTime,
  truncate,
  plainTextFromPortableText,
  isWithinDays,
} from "@/lib/utils";
import RelativeTime from "@/app/components/ui/RelativeTime";

type PostPreview = {
  _id: string;
  title: string;
  slug: { current: string } | string;
  author?: { name?: string; image?: any };
  publishedAt?: string;
  excerpt?: string;
  categories?: { _id?: string; title?: string }[];
  body?: any;
  imageUrl?: string;
};

export default async function Home() {
  const posts = (await client.fetch(POSTS_QUERY)) as PostPreview[];

  posts.forEach((post) => {
    const raw = post.excerpt ?? plainTextFromPortableText(post.body);
    const t = truncate(raw, 150);
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Latest Papers
        </h1>
        <p className="mt-2 text-sm text-black/70">
          Data-driven research and analysis that highlight what truly matters.
        </p>
      </header>

      <section className="divide-y divide-gray-200">
        {posts.map((post) => {
          const slug =
            typeof post.slug === "string" ? post.slug : post.slug?.current;
          const rawText = post.excerpt ?? plainTextFromPortableText(post.body);
          const description = rawText;

          return (
            <article
              key={post._id}
              className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            >
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  {post.author?.image ? (
                    <img
                      src={urlFor(post.author.image).width(48).height(48).url()}
                      alt={post.author?.name || "Author"}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden" />
                  )}

                  <div className="leading-tight">
                    <div className="text-sm text-black">
                      {post.author?.name || "Unknown"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/posts/${slug}`}
                  className="text-xl md:text-2xl font-bold text-black hover:text-neutral-700 inline-flex items-center"
                >
                  <span className="">
                    {isWithinDays(post.publishedAt, 3) && (
                      <span
                      className="inline-block text-xs font-medium text-white mt-auto mr-2 bg-black px-2 py-0.5 rounded"
                      style={{ position: "relative", top: "-4px" }}
                      >
                      New
                      </span>
                    )}
                    {post.title}
                  </span>
                </Link>

                <div
                  className="mt-3 text-sm text-black/70 whitespace-normal leading-relaxed"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {description}
                </div>

                <div className="mt-4 text-xs text-black/60 flex items-center gap-2">
                  <div>
                    <RelativeTime date={post.publishedAt} />
                  </div>
                  <span>•</span>
                  <div>{readingTime(rawText)}</div>
                </div>
              </div>

              {post.imageUrl ? (
                <div className="hidden md:block md:col-span-1">
                  <Link
                    href={`/posts/${slug}`}
                    className="block rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  </Link>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
