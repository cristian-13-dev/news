import type { Category } from '@/types/sanity'

interface CategoryBadgesProps {
  categories: Category[] | { title: string }[]
}

export function CategoryBadges({ categories }: CategoryBadgesProps) {
  if (!categories || categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <span
          key={'_id' in category ? category._id : index}
          className="text-xs font-medium tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded"
        >
          {category.title}
        </span>
      ))}
    </div>
  )
}
