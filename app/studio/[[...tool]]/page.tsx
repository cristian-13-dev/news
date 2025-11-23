'use client'
import dynamic from 'next/dynamic'
import config from '../../../sanity.config'

const NextStudioNoSSR = dynamic(
  () => import('next-sanity/studio').then(mod => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return <NextStudioNoSSR  config={config} />
}
