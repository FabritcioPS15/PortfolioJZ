import type { Metadata } from 'next'
import SectionPage from '@/components/SectionPage'

export const metadata: Metadata = {
  title: 'Consultorías | José Luis Zelada',
  description:
    'Consultorías de José Luis Zelada en gestión del talento humano, desarrollo organizacional y estrategia.',
}

export default function ConsultoriasPage() {
  return (
    <SectionPage
      sectionLink="/consultorias"
      eyebrow="CONSULTORÍAS"
      title="Mis consultorías"
      description="Acompaño a personas y organizaciones con consultoría especializada en talento humano, desarrollo organizacional y estrategia de alto impacto."
    />
  )
}
