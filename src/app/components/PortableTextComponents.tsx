import { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Table } from '@/components/ui/Table'
import { Video } from '@/components/ui/Video'
import { Comparison } from '@/components/ui/Comparison'
import { ProsCons } from '@/components/ui/ProsCons'
import dynamic from 'next/dynamic'
const DynamicChartWrapper = dynamic(() => import('./ui/ChartWrapper'), { ssr: false })

export const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => (
      <blockquote className="relative border-l-4 border-blue-600 bg-blue-50 pl-6 pr-4 py-4 my-6 italic text-gray-800">
        <div className="relative">
          <svg
            className="absolute -left-2 -top-2 h-8 w-8 text-blue-500/20"
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
      <h1 className="text-4xl font-bold mt-12 mb-4 text-gray-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-8 mb-3 text-gray-900">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-5 text-gray-800 leading-relaxed text-lg">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-800 text-lg">
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
      <strong className="font-bold text-gray-900">
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
          className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2"
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
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-gray-600 mt-3">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
    table: ({ value }) => {
      return <Table value={value} />
    },
    video: ({ value }) => {
      return <Video value={value} />
    },
    comparison: ({ value }) => {
      return <Comparison value={value} />
    },
    prosCons: ({ value }) => {
      return <ProsCons value={value} />
    },
    chart: ({ value }) => {
      if (!value) return null;
      return <DynamicChartWrapper value={value} />;
    },
    timeline: ({ value }) => {
      if (!value) return null;
      const items = Array.isArray(value.items) ? value.items : value.entries || value;
      return (
        <div className="my-8">
          {Array.isArray(items) && items.map((it: any, idx: number) => (
            <div key={idx} className="mb-4">
              {it.date && <div className="text-sm text-gray-500">{it.date}</div>}
              {it.title && <div className="font-semibold text-gray-900">{it.title}</div>}
              {it.description && <div className="text-gray-800">{it.description}</div>}
            </div>
          ))}
        </div>
      )
    },
    // Backwards-compatible legacy block type `barChart`
    barChart: ({ value }) => {
      if (!value) return null;
      return <ChartWrapper value={value} />;
    },
  },
}
