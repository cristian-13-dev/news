// Fields specific to Pie/Donut chart
import {defineField} from 'sanity'

export const pieDonutChartFields = [
  defineField({
    name: 'chartType',
    title: 'Chart Type',
    type: 'string',
    options: {
      list: [
        { title: 'Pie/Donut', value: 'pieDonut' },
      ],
      layout: 'radio',
    },
    initialValue: 'pieDonut',
  }),
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
  }),
  defineField({
    name: 'title',
    title: 'Chart Title',
    type: 'string',
    description: 'The title of the chart displayed at the top.',
  }),
]