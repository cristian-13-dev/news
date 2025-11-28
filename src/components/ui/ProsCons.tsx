import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface ProsConsItem {
  name: string
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  rating?: number
  pros?: string[]
  cons?: string[]
}

interface ProsConsProps {
  value: {
    title?: string
    items: ProsConsItem[]
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  )
}

export function ProsCons({ value }: ProsConsProps) {
  const { title, items } = value

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}

      <div className={`grid gap-6 ${items.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : items.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Item Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              {item.image && (
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <Image
                    src={urlFor(item.image).width(200).height(200).url()}
                    alt={item.image.alt || item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h4 className="text-lg font-bold text-gray-900 text-center mb-2">
                {item.name}
              </h4>
              {item.rating !== undefined && (
                <div className="flex justify-center">
                  <StarRating rating={item.rating} />
                </div>
              )}
            </div>

            {/* Pros and Cons */}
            <div className="p-4 space-y-4">
              {/* Pros */}
              {item.pros && item.pros.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Pros</span>
                  </h5>
                  <ul className="space-y-2">
                    {item.pros.map((pro, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2 pl-2"
                      >
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {item.cons && item.cons.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cons</span>
                  </h5>
                  <ul className="space-y-2">
                    {item.cons.map((con, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2 pl-2"
                      >
                        <span className="text-red-600 font-bold mt-0.5">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
