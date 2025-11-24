import { defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export const comparisonType = defineType({
  name: 'comparison',
  title: 'Comparison Table',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    {
      name: 'title',
      title: 'Comparison Title',
      type: 'string',
      description: 'e.g., "Best Smartphones 2025", "Electric Cars Comparison"',
    },
    {
      name: 'criteria',
      title: 'Comparison Criteria',
      type: 'array',
      description: 'Define the criteria once (e.g., Display, Processor, Price, etc.)',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'criterion',
          fields: [
            {
              name: 'name',
              title: 'Criterion Name',
              type: 'string',
              description: 'e.g., Display, Engine, Model, etc.',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              name: 'name',
            },
            prepare({ name }) {
              return {
                title: name,
              }
            },
          },
        },
      ],
    },
    {
      name: 'items',
      title: 'Items to Compare',
      type: 'array',
      description: 'Add 2-4 items to compare',
      validation: (Rule) => Rule.min(2).max(4),
      of: [
        {
          type: 'object',
          name: 'item',
          fields: [
            {
              name: 'name',
              title: 'Item Name',
              type: 'string',
              description: 'Name of the product/item',
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
              name: 'highlight',
              title: 'Highlight Label',
              type: 'string',
              description: 'Optional badge (e.g., "Best Value", "Editor\'s Choice")',
            },
            {
              name: 'values',
              title: 'Criterion Values',
              type: 'array',
              description: 'Fill in values for each criterion in the same order',
              of: [
                {
                  type: 'object',
                  name: 'value',
                  fields: [
                    {
                      name: 'value',
                      title: 'Value',
                      type: 'text',
                      rows: 2,
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              name: 'name',
              highlight: 'highlight',
              image: 'image',
            },
            prepare({ name, highlight, image }) {
              return {
                title: name,
                subtitle: highlight,
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
        title: title || 'Comparison Table',
        subtitle: `${itemCount} items`,
      }
    },
  },
})
