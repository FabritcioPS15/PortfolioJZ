import type { Metadata } from 'next'
import SectionPage from '@/components/SectionPage'

export const metadata: Metadata = {
  title: 'Artículos | José Luis Zelada',
  description:
    'Artículos de José Luis Zelada sobre liderazgo consciente, cultura organizacional y desarrollo de equipos.',
}

export default function ArticulosPage() {
  return (
    <SectionPage
      sectionLink="/articulos"
      eyebrow="ARTÍCULOS"
      title="Artículos"
      description="Reflexiones y experiencias sobre liderazgo, cultura organizacional y desarrollo profesional de los equipos."
    />
  )
}
