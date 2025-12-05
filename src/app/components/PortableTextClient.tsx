"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import ChartWrapper from "./ui/ChartWrapper";
import { urlFor } from "@/lib/sanity";
import { Table } from "@/components/ui/Table";
import { Video } from "@/components/ui/Video";
import { Comparison } from "@/components/ui/Comparison";
import { ProsCons } from "@/components/ui/ProsCons";

export default function PortableTextClient({ value }: { value: any }) {
  function getContrastColor(hex: string) {
    try {
      const c = hex.replace('#', '')
      const r = parseInt(c.substring(0, 2), 16)
      const g = parseInt(c.substring(2, 4), 16)
      const b = parseInt(c.substring(4, 6), 16)
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      return luminance > 0.6 ? '#000000' : '#ffffff'
    } catch (e) {
      return '#000000'
    }
  }

  function hexToRgba(hex: string, alpha = 0.35) {
    try {
      const c = hex.replace('#', '')
      const r = parseInt(c.substring(0, 2), 16)
      const g = parseInt(c.substring(2, 4), 16)
      const b = parseInt(c.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    } catch (e) {
      return hex
    }
  }

  const components: any = {
    block: {
      blockquote: ({ children }: any) => (
        <blockquote className="relative border-l-4 border-blue-600 bg-blue-50 pl-6 pr-4 py-4 my-6 italic text-gray-800">
          <div className="relative">
            <svg
              className="absolute -left-2 -top-2 h-8 w-8 text-blue-500/20"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8zm12 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8z" />
            </svg>
            <div className="relative">{children}</div>
          </div>
        </blockquote>
      ),
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold mt-12 mb-4 text-gray-900">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-semibold mt-8 mb-3 text-gray-900">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{children}</h4>
      ),
      normal: ({ children }: any) => (
        <p className="mb-5 text-gray-800 leading-relaxed text-lg">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-800 text-lg">{children}</ul>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-bold text-gray-900">{children}</strong>
      ),
      em: ({ children }: any) => <em className="italic">{children}</em>,
      marker: ({ children, value }: any) => {
        const hex = value?.color || '#000000'
        const bg = hexToRgba(hex, 0.35)
        const color = getContrastColor(hex)
        return (
          <span
            style={{
              backgroundColor: bg,
              color,
              padding: '0.08em 0.18em',
              borderRadius: '0.25em',
              display: 'inline',
              lineHeight: 1.2,
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
              boxShadow: 'inset 0 -0.12em rgba(0,0,0,0.06)'
            }}
            className="inline-block"
          >
            {children}
          </span>
        )
      },
      link: ({ children, value }: any) => {
        const href = value?.href || "";
        return (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <figure className="my-8">
            <Image
              src={urlFor(value).width(800).url()}
              alt={value.alt || "Blog image"}
              width={800}
              height={450}
              className="rounded-lg w-full"
            />
            {value.alt && (
              <figcaption className="text-center text-sm text-gray-600 mt-3">{value.alt}</figcaption>
            )}
          </figure>
        );
      },
      table: ({ value }: any) => <Table value={value} />,
      video: ({ value }: any) => <Video value={value} />,
      comparison: ({ value }: any) => <Comparison value={value} />,
      prosCons: ({ value }: any) => <ProsCons value={value} />,
      chart: ({ value }: any) => {
        if (!value) return null;
        return <ChartWrapper value={value} />;
      },
      timeline: ({ value }: any) => {
        if (!value) return null;
        const items = Array.isArray(value.items) ? value.items : value.entries || value;
        return (
          <div className="my-8">
            {Array.isArray(items) &&
              items.map((it: any, idx: number) => (
                <div key={idx} className="mb-4">
                  {it.date && <div className="text-sm text-gray-500">{it.date}</div>}
                  {it.title && <div className="font-semibold text-gray-900">{it.title}</div>}
                  {it.description && <div className="text-gray-800">{it.description}</div>}
                </div>
              ))}
          </div>
        );
      },
      barChart: ({ value }: any) => {
        if (!value) return null;
        return <ChartWrapper value={value} />;
      },
    },
  };

  return <PortableText value={value} components={components} />;
}
