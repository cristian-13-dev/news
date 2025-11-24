import { defineType } from 'sanity'
import { ThumbsUpIcon } from '@sanity/icons'

export const prosConsType = defineType({
  name: 'prosCons',
  title: 'Pros & Cons',
  type: 'object',
  icon: ThumbsUpIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title (e.g., "Our Verdict", "Summary")',
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'Add items with their pros and cons',
      validation: (Rule) => Rule.min(1).max(3),
      of: [
        {
          type: 'object',
          name: 'item',
          fields: [
            {
              name: 'name',
              title: 'Item Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'rating',
              title: 'Rating (out of 5)',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(5).precision(1),
            },
            {
              name: 'pros',
              title: 'Pros',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'cons',
              title: 'Cons',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              name: 'name',
              rating: 'rating',
              image: 'image',
            },
            prepare({ name, rating, image }) {
              return {
                title: name,
                subtitle: rating ? `${rating}/5` : undefined,
                media: image,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({ title, items }) {
      const itemCount = items?.length || 0
      return {
        title: title || 'Pros & Cons',
        subtitle: `${itemCount} items`,
      }
    },
  },
})
