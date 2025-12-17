import { useFilter } from "@/context/filter";
import { Props } from "../../page/MainAsideClient";

export default function PostCategories({ tags }: Props) {
  const { setSelectedTags, selectedTags } = useFilter();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags?.length ? (
        tags
          .slice()
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((t) => (
            <button
              key={t}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(t)
                    ? prev.filter((tag) => tag !== t)
                    : [...prev, t]
                )
              }
              className={`text-xs px-2 py-1 rounded ${selectedTags.includes(t) ? "bg-neutral-300 text-neutral-700" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
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
