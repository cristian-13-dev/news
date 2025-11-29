import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'
import type { Author as AuthorType } from '@/types/sanity'

interface AuthorInfoProps {
  author: AuthorType | { name: string; image?: AuthorType['image'] }
  publishedAt?: string
}

export function AuthorInfo({ author, publishedAt }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-4">
      {author.image && (
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={urlFor(author.image).width(80).height(80).url()}
            alt={author.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">
          {author.name}
        </p>
        {publishedAt && (
          <time className="text-xs text-gray-500">
            {formatDate(publishedAt)}
          </time>
        )}
      </div>
    </div>
  )
}
