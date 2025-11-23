import { defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'

export const tableType = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              return {
                title: cells?.join(' | ') || 'Empty row',
              }
            },
          },
        },
      ],
    },
    {
      name: 'caption',
      title: 'Table Caption',
      type: 'string',
    },
  ],
  preview: {
    select: {
      rows: 'rows',
      caption: 'caption',
    },
    prepare({ rows, caption }) {
      const rowCount = rows?.length || 0
      return {
        title: caption || 'Table',
        subtitle: `${rowCount} rows`,
      }
    },
  },
})
