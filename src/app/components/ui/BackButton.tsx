import Link from 'next/link'

interface BackButtonProps {
  href: string
  label?: string
}

export function BackButton({ href, label = 'Back' }: BackButtonProps) {
  return (
    <Link 
      href={href} 
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  )
}
