import React from 'react'

export function BlockquoteRenderer({children}: {children: React.ReactNode}) {
  return (
    <blockquote style={{
      borderLeft: '4px solid #3b82f6',
      paddingLeft: '1rem',
      fontStyle: 'italic',
      color: '#4b5563',
      margin: '1rem 0'
    }}>
      {children}
    </blockquote>
  )
}
