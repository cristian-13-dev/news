import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="container">
      <h1>About</h1>
      <p>This is a placeholder About page. Replace with your project details.</p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </main>
  )
}
