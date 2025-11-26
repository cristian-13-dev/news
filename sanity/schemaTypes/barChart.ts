import {defineType, defineField, defineArrayMember} from 'sanity'

export const chart = defineType({
  name: 'chart',
  title: 'Chart',
  type: 'object',
  fields: [
    defineField({
      name: 'chartType',
      title: 'Chart Type',
      type: 'string',
      options: {
        list: [
          { title: 'Bar', value: 'bar' },
          { title: 'Line', value: 'line' },
          { title: 'Area', value: 'area' },
          { title: 'Pie / Donut', value: 'pie' },
        ],
        layout: 'radio',
      },
      initialValue: 'bar',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: [
          {title: 'Vertical', value: 'vertical'},
          {title: 'Horizontal', value: 'horizontal'},
        ],
        layout: 'radio',
      },
      initialValue: 'vertical',
      hidden: ({parent}) => parent?.chartType === 'pie',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: '16:10', value: '16:10'},
          {title: '16:9', value: '16:9'},
          {title: '4:3', value: '4:3'},
          {title: '1:1', value: '1:1'},
        ],
      },
      initialValue: '16:10',
    }),
    // Series for multi-line / multi-area charts
    defineField({
      name: 'series',
      title: 'Series (for Line / Area)',
      hidden: ({parent}) => !(parent?.chartType === 'line' || parent?.chartType === 'area'),
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'label', title: 'Series label', type: 'string' },
            { name: 'color', title: 'Color', type: 'string' },
            {
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Label', type: 'string' },
                    { name: 'value', title: 'Value', type: 'number' },
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // Slices for Pie/Donut charts
    defineField({
      name: 'slices',
      title: 'Slices (for Pie / Donut)',
      hidden: ({parent}) => parent?.chartType !== 'pie',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'number' },
            { name: 'color', title: 'Color', type: 'string' },
          ],
        }),
      ],
    }),

    // Simple toggles to switch between Pie and Donut presentation (merged)
    // Presentation selector: use a single radio for Pie vs Donut (keep legacy fields for compatibility)
    defineField({
      name: 'presentation',
      title: 'Presentation',
      type: 'string',
      options: {
        list: [
          { title: 'Pie', value: 'pie' },
          { title: 'Donut', value: 'donut' },
        ],
        layout: 'radio',
      },
      initialValue: 'pie',
      hidden: ({parent}) => parent?.chartType !== 'pie',
    }),
    // Legacy boolean toggles (kept for old documents) - can be removed after migration
    defineField({ name: 'isPie', title: 'Show as Pie', type: 'boolean', initialValue: false, hidden: ({parent}) => parent?.chartType !== 'pie' }),
    defineField({ name: 'isDonut', title: 'Show as Donut', type: 'boolean', initialValue: true, hidden: ({parent}) => parent?.chartType !== 'pie' }),
    
    defineField({
      name: 'bars',
      title: 'Bars',
      hidden: ({parent}) => parent?.chartType !== 'bar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'number'},
            {name: 'color', title: 'Color', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'groups',
      title: 'Groups',
      hidden: ({parent}) => parent?.chartType !== 'bar',
      type: 'array',
      description: 'Optional grouping of bars. If provided, groups will be rendered instead of the top-level `bars` list.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {name: 'label', title: 'Group Label', type: 'string'},
            {
              name: 'bars',
              title: 'Bars',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    {name: 'label', title: 'Label', type: 'string'},
                    {name: 'value', title: 'Value', type: 'number'},
                    {name: 'color', title: 'Color', type: 'string'},
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      bars: 'bars',
      groups: 'groups',
      direction: 'direction',
      chartType: 'chartType',
      presentation: 'presentation',
      isDonut: 'isDonut',
    },
    prepare(selection) {
      const {title, bars, groups, direction, chartType, presentation, isDonut} = selection as any
      const ct = chartType || 'pie'
      // prefer explicit chartType === 'donut' or presentation === 'donut', fall back to legacy isDonut
      const donut = ct === 'donut' || presentation === 'donut' || Boolean(isDonut)
      let count = 0
      if (groups) {
        count = groups.reduce((acc: number, g: any) => acc + (g?.bars?.length || 0), 0)
      } else if (bars) {
        count = bars.length
      }
      return {
        title: title || 'Chart',
        subtitle: `${count} items · ${direction || 'vertical'} · ${ct}${donut ? ' · donut' : ''}`,
      }
    },
  },
})

// Backwards-compatible alias named `barChart` for legacy blocks/documents
export const barChart = {
  ...chart,
  name: 'barChart',
  title: 'Chart',
} as any
