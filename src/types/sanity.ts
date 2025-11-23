import { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  _type: 'image'
}

export interface Author {
  _id: string
  name: string
  slug: {
    current: string
  }
  image?: SanityImage
  bio?: PortableTextBlock[]
}

export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Post {
  _id: string
  _type: 'post'
  title: string
  slug: {
    current: string
  }
  author?: Author
  mainImage?: SanityImage
  categories?: Category[]
  publishedAt?: string
  body?: PortableTextBlock[]
}

export interface PostListItem {
  _id: string
  title: string
  slug: {
    current: string
  }
  author?: {
    name: string
    image?: SanityImage
  }
  mainImage?: SanityImage
  categories?: Category[]
  publishedAt?: string
}
