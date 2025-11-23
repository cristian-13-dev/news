interface PageHeaderProps {
  children: React.ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {children}
      </div>
    </header>
  )
}
