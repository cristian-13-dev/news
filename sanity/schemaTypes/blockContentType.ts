import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon, BlockquoteIcon} from '@sanity/icons'
import {BlockquoteRenderer, BarChartRenderer} from '../components'
import React from 'react'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',

      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {
          title: 'Quote',
          value: 'blockquote',
          icon: BlockquoteIcon,
          component: BlockquoteRenderer,
        },
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {

        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'Marker',
            name: 'marker',
            type: 'object',
            fields: [
              {
                title: 'Color',
                name: 'color',
                type: 'string',
                options: {
                  list: [
                    { title: 'Red', value: '#f07165' },
                    { title: 'Green', value: '#7ad46e' },
                    { title: 'Yellow', value: '#ffde82' },
                  ],
                },
              },
            ],
          },
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineArrayMember({
      type: 'table',
    }),
    defineArrayMember({
      type: 'video',
    }),
    defineArrayMember({
      type: 'comparison',
    }),
    defineArrayMember({
      type: 'prosCons',
    }),
    defineArrayMember({
      type: 'chart',
      components: {
        preview: (props) => {
          return React.createElement(BarChartRenderer, props)
        }
      }
    }),

    defineArrayMember({
      type: 'barChart',
      components: {
        preview: (props) => {
          return React.createElement(BarChartRenderer, props)
        }
      }
    }),
  ],
})
