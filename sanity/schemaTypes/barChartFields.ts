// Fields specific to Bar chart
import {defineField, defineArrayMember} from 'sanity'

export const barChartFields = [
  defineField({
    name: 'chartType',
    title: 'Chart Type',
    type: 'string',
    options: {
      list: [
        { title: 'Bar', value: 'bar' },
      ],
      layout: 'radio',
    },
    initialValue: 'bar',
  }),
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
  }),
  defineField({
    name: 'title',
    title: 'Chart Title',
    type: 'string',
    description: 'The title of the chart displayed at the top.',
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
]