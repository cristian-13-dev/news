import React from 'react'

export default function Section({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <section className={`${className} px-4 md:px-8 xl:px-16 py-7 md:py-14 xl:py-28 container mx-auto dark:bg-black bg-white w-screen`}>{children}</section>
  )
}