import {defineType, defineField, defineArrayMember} from 'sanity'
import {barChartFields} from './barChartFields'
import {pieDonutChartFields} from './pieDonutChartFields'
import {lineAreaChartFields} from './lineAreaChartFields'

export const barChartSchema = {
  name: 'barChart',
  title: 'Bar Chart',
  type: 'document',
  fields: [
    ...barChartFields,
    ...pieDonutChartFields,
    ...lineAreaChartFields,
  ],
}

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
          { title: 'Pie/Donut', value: 'pieDonut' },
          { title: 'Line/Area', value: 'lineArea' },
        ],
        layout: 'radio',
      },
      initialValue: 'bar',
    }),

    // Line/Area selector appears immediately after chartType (hidden unless lineArea)
    defineField({
      name: 'lineAreaType',
      title: 'Line/Area Type',
      type: 'string',
      options: {
        list: [
          { title: 'Line', value: 'line' },
          { title: 'Area', value: 'area' },
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.chartType !== 'lineArea',
    }),

    // Presentation (Pie/Donut) appears immediately after chartType (hidden unless pieDonut)
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
      hidden: ({parent}) => parent?.chartType !== 'pieDonut',
    }),

    // Direction is only shown for bar charts
    defineField({
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: [
          { title: 'Vertical', value: 'vertical' },
          { title: 'Horizontal', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.chartType !== 'bar',
    }),

    // Title follows the type-specific selectors
    defineField({
      name: 'title',
      title: 'Chart Title',
      type: 'string',
      description: 'The title of the chart displayed at the top.',
    }),

    // Bars and groups for bar charts
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
            {
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Coral Red', value: '#F15B5B'},
                  {title: 'Violet', value: '#9B5DE5'},
                  {title: 'Hot Pink', value: '#F15BB5'},
                  {title: 'Sunshine Yellow', value: '#FEE440'},
                  {title: 'Sky Blue', value: '#00BBF9'},
                  {title: 'Mint Teal', value: '#00F5D4'},
                ],
              },
            },
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
                    {
                      name: 'color',
                      title: 'Color',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Coral Red', value: '#F15B5B'},
                          {title: 'Violet', value: '#9B5DE5'},
                          {title: 'Hot Pink', value: '#F15BB5'},
                          {title: 'Sunshine Yellow', value: '#FEE440'},
                          {title: 'Sky Blue', value: '#00BBF9'},
                          {title: 'Mint Teal', value: '#00F5D4'},
                        ],
                      },
                    },
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // Series for Line/Area charts
    defineField({
      name: 'series',
      title: 'Series',
      type: 'array',
      hidden: ({parent}) => parent?.chartType !== 'lineArea',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Coral Red', value: '#F15B5B'},
                  {title: 'Violet', value: '#9B5DE5'},
                  {title: 'Hot Pink', value: '#F15BB5'},
                  {title: 'Sunshine Yellow', value: '#FEE440'},
                  {title: 'Sky Blue', value: '#00BBF9'},
                  {title: 'Mint Teal', value: '#00F5D4'},
                ],
              },
            },
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
      hidden: ({parent}) => parent?.chartType !== 'pieDonut',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'number' },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Coral Red', value: '#F15B5B'},
                  {title: 'Violet', value: '#9B5DE5'},
                  {title: 'Hot Pink', value: '#F15BB5'},
                  {title: 'Sunshine Yellow', value: '#FEE440'},
                  {title: 'Sky Blue', value: '#00BBF9'},
                  {title: 'Mint Teal', value: '#00F5D4'},
                ],
              },
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
    },
    prepare(selection) {
      const {title, bars, groups, direction, chartType, presentation} = selection as any
      const ct = chartType || 'pie'
      const donut = ct === 'donut' || presentation === 'donut'
      let count = 0
      if (groups) {
        count = groups.reduce((acc: number, g: any) => acc + (g?.bars?.length || 0), 0)
      } else if (bars) {
        count = bars.length
      }
      return {
        title: title || 'Chart',
        subtitle: `${count} items \\u00b7 ${direction || 'vertical'} \\u00b7 ${ct}${donut ? ' \\u00b7 donut' : ''}`,
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
