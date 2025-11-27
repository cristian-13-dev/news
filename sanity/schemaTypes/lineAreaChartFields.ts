// Fields specific to Line/Area chart
import {defineField, defineArrayMember} from 'sanity'

export const lineAreaChartFields = [
  defineField({
    name: 'chartType',
    title: 'Chart Type',
    type: 'string',
    options: {
      list: [
        { title: 'Line/Area', value: 'lineArea' },
      ],
      layout: 'radio',
    },
    initialValue: 'lineArea',
  }),
  defineField({
    name: 'presentation',
    title: 'Presentation',
    type: 'string',
    options: {
      list: [
        { title: 'Line', value: 'line' },
        { title: 'Area', value: 'area' },
      ],
      layout: 'radio',
    },
  }),
  defineField({
    name: 'title',
    title: 'Chart Title',
    type: 'string',
    description: 'The title of the chart displayed at the top.',
  }),
  defineField({
    name: 'series',
    title: 'Series',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
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
]