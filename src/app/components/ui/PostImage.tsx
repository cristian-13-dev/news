import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { SanityImage } from '@/types/sanity'

interface PostImageProps {
  image: SanityImage
  title: string
  priority?: boolean
}

export function PostImage({ image, title, priority = false }: PostImageProps) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
      <Image
        src={urlFor(image).width(1200).height(675).url()}
        alt={image.alt || title}
        fill
        className="object-cover"
        priority={priority}
      />
    </div>
  )
}
