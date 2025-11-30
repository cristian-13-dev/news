export type PostPreview = {
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