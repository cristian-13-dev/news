"use client";

import React, { useState } from "react";

type Props = {
  tags: string[];
};

export default function MainAsideTags({ tags }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.length ? (
        tags
          .slice()
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((t) => (
            <button
              key={t}
              onClick={() =>
              setFilterTags((prev) =>
                prev.includes(t)
                ? prev.filter((tag) => tag !== t)
                : [...prev, t]
              )
              }
              className={`text-xs px-2 py-1 rounded ${filterTags.includes(t) ? "bg-neutral-300 text-neutral-700" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >
              {t}
            </button>
          ))
      ) : (
        <span className="text-xs text-gray-400">No tags</span>
      )}
    </div>
  );
}
