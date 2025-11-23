import { PortableText } from '@portabletext/react'
import { components } from '@/components/PortableTextComponents'
import { PortableTextBlock } from 'sanity'

export default function BlogPost({ content }: { content: PortableTextBlock[] }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <PortableText 
        value={content} 
        components={components}
      />
    </article>
  )
}
