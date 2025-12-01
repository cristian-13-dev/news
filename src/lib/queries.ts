// GROQ query fragments
export const POST_FIELDS = `
  _id,
  title,
  slug,
  author->{
    name,
    image
  },
  mainImage,
  categories[]->{
    _id,
    title
  },
  publishedAt,
  body,
  "excerpt": coalesce(excerpt, pt::text(body)[0..200]),
  "imageUrl": mainImage.asset->url
`;

// Query to fetch all posts
export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  ${POST_FIELDS}
}`;

// Query to fetch a single post by slug
export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  ${POST_FIELDS}
}`;

// Query to fetch all post slugs (for static generation)
export const POST_SLUGS_QUERY = `*[_type == "post"]{ "slug": slug.current }`;

export const POSTS_WITH_META_QUERY = `*[_type == "post" && slug.current == $slug][0]{
      title,
      "description": coalesce(excerpt, pt::text(body)[0..150]),
      "imageUrl": mainImage.asset->url,
      publishedAt,
      "authorName": author->name
    }`;
