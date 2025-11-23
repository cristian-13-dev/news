# Project Structure

This document outlines the refactored folder structure and organization of the blog project.

## 📁 Folder Structure

```
src/
├── app/                      # Next.js app directory
│   ├── posts/               # Posts pages
│   │   ├── page.tsx        # Posts listing page
│   │   └── [slug]/         # Dynamic post detail page
│   │       └── page.tsx
│   ├── studio/             # Sanity Studio
│   ├── layout.tsx
│   └── page.tsx
│
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   │   ├── AuthorInfo.tsx
│   │   ├── BackButton.tsx
│   │   ├── CategoryBadges.tsx
│   │   ├── PageHeader.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostImage.tsx
│   │   └── index.ts        # Barrel export
│   └── PortableTextComponents.tsx
│
├── lib/                    # Utility functions and configurations
│   ├── sanity.ts          # Centralized Sanity exports
│   ├── queries.ts         # GROQ queries
│   └── utils.ts           # Helper functions
│
└── types/                 # TypeScript type definitions
    └── sanity.ts          # Sanity-related types

sanity/                    # Sanity CMS configuration
├── lib/
│   ├── client.ts
│   ├── image.ts
│   └── live.ts
├── schemaTypes/
└── components/
```

## 🎯 Key Improvements

### 1. **Centralized Types** (`src/types/sanity.ts`)
- Shared TypeScript interfaces for Post, Author, Category, etc.
- Eliminates type duplication across files
- Provides type safety throughout the application

### 2. **Unified Sanity Configuration** (`src/lib/sanity.ts`)
- Single import point for all Sanity-related functions
- Re-exports: `client`, `sanityFetch`, `SanityLive`, `urlFor`
- Simplifies imports across the app

### 3. **GROQ Queries** (`src/lib/queries.ts`)
- Centralized query definitions
- Reusable query fragments
- Easy to maintain and update

### 4. **Utility Functions** (`src/lib/utils.ts`)
- `formatDate()` - Consistent date formatting
- `getReadingTime()` - Calculate reading time
- `truncate()` - Text truncation helper

### 5. **Reusable UI Components** (`src/components/ui/`)
- **BackButton** - Navigation back button with icon
- **AuthorInfo** - Author avatar and metadata
- **CategoryBadges** - Category pills
- **PostCard** - Post preview card for listings
- **PageHeader** - Consistent page header
- **PostImage** - Optimized post image display

### 6. **Clean Component Structure**
- Separated concerns (UI vs. logic)
- Proper TypeScript typing
- Easy to test and maintain

## 📝 Usage Examples

### Importing Components
```tsx
// Old way
import { BackButton } from '@/components/ui/BackButton'
import { PostCard } from '@/components/ui/PostCard'

// New way (using barrel exports)
import { BackButton, PostCard } from '@/components/ui'
```

### Using Sanity Functions
```tsx
// Old way
import { client } from '@/../../sanity/lib/client'
import { urlFor } from '@/../../sanity/lib/image'

// New way
import { client, urlFor } from '@/lib/sanity'
```

### Using Types
```tsx
import type { Post, Author, Category } from '@/types/sanity'

async function getPost(): Promise<Post> {
  // ...
}
```

### Using Queries
```tsx
import { POSTS_QUERY, POST_BY_SLUG_QUERY } from '@/lib/queries'
import { sanityFetch } from '@/lib/sanity'

const { data } = await sanityFetch({ query: POSTS_QUERY })
```

## 🔧 Benefits

1. **Better Organization** - Clear separation of concerns
2. **Type Safety** - Consistent types across the application
3. **DRY Principle** - No code duplication
4. **Easier Maintenance** - Changes in one place affect everywhere
5. **Better Developer Experience** - Cleaner imports and autocomplete
6. **Scalability** - Easy to add new features and components

## 🚀 Next Steps

Future improvements could include:
- Add unit tests for utility functions
- Create more reusable components (e.g., Share buttons, Related posts)
- Add loading and error states
- Implement pagination for posts listing
- Add search functionality
