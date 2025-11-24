import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface ComparisonItem {
  name: string
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  highlight?: string
  values?: Array<{
    value: string
  }>
}

interface ComparisonProps {
  value: {
    title?: string
    criteria: Array<{
      name: string
    }>
    items: ComparisonItem[]
  }
}

export function Comparison({ value }: ComparisonProps) {
  const { title, criteria, items } = value

  if (!items || items.length < 2 || !criteria || criteria.length === 0) {
    return null
  }

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}

      {/* Desktop/Tablet View: Polished card grid comparison */}
      <div className="hidden md:block">
        <div className="w-full">
          <div
            className="grid gap-6 items-stretch"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
          >
            {items.map((item, index) => (
              <article
                key={index}
                className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-150 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-100"
              >
                <div className="p-6 text-center">
                  {item.image ? (
                    <div className="relative w-20 h-20 mx-auto mb-3 rounded-full bg-slate-50 overflow-hidden flex items-center justify-center">
                      <Image
                        src={urlFor(item.image).width(256).height(256).url()}
                        alt={item.image.alt || item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-slate-50" />
                  )}

                  <div className="text-base font-semibold text-slate-900">{item.name}</div>
                  {item.highlight && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                        {item.highlight}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 bg-white">
                  <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {criteria.map((criterion, criterionIndex) => {
                      const value = item.values?.[criterionIndex]?.value || '—'
                      return (
                        <React.Fragment key={criterionIndex}>
                          <dt className="text-xs text-slate-500">{criterion.name}</dt>
                          <dd className="text-sm font-medium text-slate-800 text-right">{value}</dd>
                        </React.Fragment>
                      )
                    })}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View: Stacked cards */}
      <div className="md:hidden space-y-6">
        {items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            {/* Item Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              {item.image && (
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <Image
                    src={urlFor(item.image).width(256).height(256).url()}
                    alt={item.image.alt || item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h4 className="text-lg font-bold text-gray-900 text-center">
                {item.name}
              </h4>
              {item.highlight && (
                <div className="text-center mt-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                    {item.highlight}
                  </span>
                </div>
              )}
            </div>

            {/* Item Criteria */}
            <div className="divide-y divide-gray-200">
              {criteria.map((criterion, criterionIndex) => {
                const value = item.values?.[criterionIndex]?.value || '—'
                return (
                  <div key={criterionIndex} className="p-4">
                    <dt className="text-sm font-semibold text-gray-700 mb-1">
                      {criterion.name}
                    </dt>
                    <dd className="text-sm text-gray-800">{value}</dd>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile hint */}
      <p className="text-xs text-gray-500 text-center mt-4 md:hidden">
        Scroll down to see all items
      </p>
    </div>
  )
}
