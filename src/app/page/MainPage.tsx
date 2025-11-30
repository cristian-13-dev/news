import { client, urlFor } from "@/lib/sanity";
import { POSTS_QUERY } from "@/lib/queries";
import Link from "next/link";
import {
  formatDate,
  readingTime,
  plainTextFromPortableText,
  isWithinDays,
} from "@/lib/utils";
import LikeButton from "@/components/ui/LikeButton";
import { getLikesBySlugs } from "@/utils/Supabase/likes";

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

export default async function MainPage() {
  const posts = (await client.fetch(POSTS_QUERY)) as PostPreview[];
  const getSlug = (s: PostPreview["slug"]) =>
    typeof s === "string" ? s : (s?.current ?? "");

  // gather slugs and fetch likes from Supabase
  const slugs = posts.map((p) => getSlug(p.slug)).filter(Boolean);
  const likesMap = await getLikesBySlugs(slugs);

  return (
    <div className="w-full flex flex-col flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row gap-8 items-start mx-auto max-w-[1400px] flex-1 w-full min-h-0">
        <main className="w-full py-6 border-r border-gray-200 max-w-full flex justify-center px-4 flex-1 overflow-y-auto min-h-[calc(100vh-48px)]">
          <div className="max-w-3xl mx-auto">
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
                const postUrl = `/articles/${getSlug(post.slug)}`;
                const rawText =
                  post.excerpt ?? plainTextFromPortableText(post.body);
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
                            src={urlFor(post.author.image)
                              .width(64)
                              .height(64)
                              .url()}
                            alt={post.author?.name || "Author"}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden" />
                        )}

                        <div className="leading-tight">
                          <div className="text-sm text-black">
                            {post.author?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-black/60">
                            {formatDate(post.publishedAt)}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={postUrl}
                        className="text-xl md:text-2xl font-bold text-black hover:underline inline-flex items-center"
                      >
                        <span>
                          {isWithinDays(post.publishedAt, 3) && (
                            <span
                              className="inline-block text-xs font-medium text-white mt-auto mr-2 bg-black px-2 py-0.5 rounded"
                              style={{ position: "relative", top: "-4px" }}
                            >
                              New
                            </span>
                          )}
                          <span>{post.title}</span>
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

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {post.categories?.slice(0, 2).map((cat) => (
                              <span
                                key={cat._id}
                                className="text-xs bg-gray-100 text-black/70 px-2 py-0.5 rounded"
                              >
                                {cat.title}
                              </span>
                            ))}
                          </div>

                          <div className="text-xs text-black/60 flex items-center gap-2">
                            <p>{readingTime(post.body)}</p>
                          </div>
                        </div>

                        <div>
                          <LikeButton
                            slug={getSlug(post.slug)}
                            initialCount={likesMap[getSlug(post.slug)] ?? 0}
                          />
                        </div>
                      </div>
                    </div>

                    {post.imageUrl && (
                      <div className="hidden md:block md:col-span-1">
                        <Link
                          href={postUrl}
                          className="block rounded-lg overflow-hidden shadow-sm"
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-40 object-cover rounded"
                          />
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          </div>
        </main>

        <aside className="hidden xl:block bg-white p-6 self-start">
          <div className="sticky top-12 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-black mb-2">
              Staff Picks
            </h2>
            <p className="text-sm text-black/70">
              Place widgets, links, or additional information here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
