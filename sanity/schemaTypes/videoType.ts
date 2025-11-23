import { defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    {
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    prepare({ url, caption }) {
      return {
        title: caption || 'Video',
        subtitle: url,
      }
    },
  },
})
