import { defineType, defineArrayMember } from "sanity";
import { ImageIcon, BlockquoteIcon } from "@sanity/icons";
import { chart } from "./schemaTypes/barChart";

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",

      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        {
          title: "Quote",
          value: "blockquote",
          icon: BlockquoteIcon,
        },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {

        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],

        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineArrayMember({
      type: "table",
    }),
    defineArrayMember({
      type: "video",
    }),
    defineArrayMember({
      type: "comparison",
    }),
    defineArrayMember({
      type: "prosCons",
    }),
    defineArrayMember({
      type: "chart",
    }),
  ],
});

export const schemaTypes = [blockContentType, chart];
