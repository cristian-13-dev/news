import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface ComparisonDevice {
  name: string
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  price?: string
  specs?: Array<{
    label: string
    value: string
  }>
  pros?: string[]
  cons?: string[]
  rating?: number
}

interface ComparisonProps {
  value: {
    title?: string
    devices: ComparisonDevice[]
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

export function Comparison({ value }: ComparisonProps) {
  const { title, devices } = value

  if (!devices || devices.length < 2) {
    return null
  }

  // Get all unique spec labels
  const allSpecLabels = Array.from(
    new Set(
      devices.flatMap((device) => device.specs?.map((spec) => spec.label) || [])
    )
  )

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}

      <div className="overflow-x-auto">
        <div className={`grid ${devices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 min-w-[640px]`}>
          {devices.map((device, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Device Image */}
              {device.image && (
                <div className="relative w-full aspect-square bg-gray-50 p-4">
                  <Image
                    src={urlFor(device.image).width(400).height(400).url()}
                    alt={device.image.alt || device.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              )}

              {/* Device Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {device.name}
                </h4>
                {device.price && (
                  <p className="text-2xl font-bold text-blue-600">
                    {device.price}
                  </p>
                )}
                {device.rating !== undefined && (
                  <div className="mt-2">
                    <StarRating rating={device.rating} />
                  </div>
                )}
              </div>

              {/* Specifications */}
              {device.specs && device.specs.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Specifications
                  </h5>
                  <dl className="space-y-3">
                    {allSpecLabels.map((label) => {
                      const spec = device.specs?.find((s) => s.label === label)
                      return (
                        <div key={label}>
                          <dt className="text-xs font-medium text-gray-500 mb-1">
                            {label}
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {spec?.value || '—'}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </div>
              )}

              {/* Pros and Cons */}
              <div className="p-4 space-y-4">
                {device.pros && device.pros.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Pros
                    </h5>
                    <ul className="space-y-1">
                      {device.pros.map((pro, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {device.cons && device.cons.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Cons
                    </h5>
                    <ul className="space-y-1">
                      {device.cons.map((con, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">−</span>
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

      {/* Mobile scroll hint */}
      <p className="text-xs text-gray-500 text-center mt-4 md:hidden">
        ← Swipe to see all devices →
      </p>
    </div>
  )
}
