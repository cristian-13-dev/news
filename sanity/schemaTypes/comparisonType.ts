import { defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export const comparisonType = defineType({
  name: 'comparison',
  title: 'Device Comparison',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    {
      name: 'title',
      title: 'Comparison Title',
      type: 'string',
      description: 'e.g., "Flagship Smartphone Comparison 2025"',
    },
    {
      name: 'devices',
      title: 'Devices',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(3),
      of: [
        {
          type: 'object',
          name: 'device',
          fields: [
            {
              name: 'name',
              title: 'Device Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Device Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g., "$999" or "€899"',
            },
            {
              name: 'specs',
              title: 'Specifications',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'spec',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      description: 'e.g., "Display", "Processor", "Camera"',
                    },
                    {
                      name: 'value',
                      title: 'Value',
                      type: 'text',
                      rows: 2,
                    },
                  ],
                  preview: {
                    select: {
                      label: 'label',
                      value: 'value',
                    },
                    prepare({ label, value }) {
                      return {
                        title: label,
                        subtitle: value,
                      }
                    },
                  },
                },
              ],
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
            {
              name: 'rating',
              title: 'Rating (out of 5)',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(5).precision(1),
            },
          ],
          preview: {
            select: {
              name: 'name',
              price: 'price',
              image: 'image',
            },
            prepare({ name, price, image }) {
              return {
                title: name,
                subtitle: price,
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
      devices: 'devices',
    },
    prepare({ title, devices }) {
      const deviceCount = devices?.length || 0
      return {
        title: title || 'Device Comparison',
        subtitle: `${deviceCount} devices`,
      }
    },
  },
})
