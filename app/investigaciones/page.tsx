import type { Metadata } from 'next'
import SectionPage from '@/components/SectionPage'

export const metadata: Metadata = {
  title: 'Investigaciones | José Luis Zelada',
  description:
    'Investigaciones de José Luis Zelada sobre gestión del talento humano, desempeño organizacional y liderazgo.',
}

export default function InvestigacionesPage() {
  return (
    <SectionPage
      sectionLink="/investigaciones"
      eyebrow="INVESTIGACIONES"
      title="Investigaciones"
      description="Estudios y análisis sobre gestión del talento humano, desempeño organizacional y las nuevas dinámicas del trabajo."
    />
  )
}
