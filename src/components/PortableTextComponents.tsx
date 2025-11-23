import { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '../sanity/lib/image'

export const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => (
      <blockquote className="relative border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400 pl-6 pr-4 py-4 my-6 italic text-gray-700 dark:text-gray-300">
        <div className="relative">
          <svg
            className="absolute -left-2 -top-2 h-8 w-8 text-blue-500/20 dark:text-blue-400/20"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8zm12 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8z" />
          </svg>
          <div className="relative">{children}</div>
        </div>
      </blockquote>
    ),
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }) => {
      const href = value?.href || ''
      return (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            className="rounded-lg"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}
