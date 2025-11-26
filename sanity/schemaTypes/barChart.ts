import {defineType, defineField, defineArrayMember} from 'sanity'

export const barChart = defineType({
  name: 'barChart',
  title: 'Bar Chart',
  type: 'object',
  fields: [
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
    }),
    defineField({
      name: 'palette',
      title: 'Color Palette',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Pastel', value: 'pastel'},
          {title: 'Vibrant', value: 'vibrant'},
          {title: 'Monochrome', value: 'mono'},
        ],
      },
      initialValue: 'default',
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
    defineField({
      name: 'groupGap',
      title: 'Group gap (px)',
      type: 'number',
      description: 'Gap between bars inside a group (px). Smaller values make grouped bars denser.',
      initialValue: 6,
    }),
    defineField({
      name: 'grid',
      title: 'Grid',
      type: 'object',
      fields: [
        { name: 'show', title: 'Show grid', type: 'boolean', initialValue: false },
        { name: 'color', title: 'Grid color', type: 'string', initialValue: '#E5E7EB' },
        { name: 'strokeWidth', title: 'Stroke width', type: 'number', initialValue: 1 },
        { name: 'opacity', title: 'Opacity', type: 'number', initialValue: 0.6 },
        { name: 'spacing', title: 'Grid spacing (px)', type: 'number', description: 'Distance between grid lines in pixels', initialValue: 48 },
      ],
    }),
    defineField({
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
    }),
    defineField({
      name: 'groups',
      title: 'Groups',
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
      palette: 'palette',
    },
    prepare(selection) {
      const {title, bars, groups, direction, palette} = selection
      let count = 0
      if (groups) {
        count = groups.reduce((acc: number, g: any) => acc + (g?.bars?.length || 0), 0)
      } else if (bars) {
        count = bars.length
      }
      return {
        title: title || 'Bar Chart',
        subtitle: `${count} bars · ${direction || 'vertical'} · ${palette || 'default'}`,
      }
    },
  },
})
