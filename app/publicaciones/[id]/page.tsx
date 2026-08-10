import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PublicacionDetalle from '@/components/PublicacionDetalle'
import { getSections, type Section, type SectionItem } from '@/lib/sections'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const found = await findItem(id)
  if (!found) return { title: 'Publicación no encontrada | José Luis Zelada' }
  return {
    title: `${found.item.title} | José Luis Zelada`,
    description: found.item.description || found.item.content?.slice(0, 160) || undefined,
  }
}

async function findItem(id: string): Promise<{ item: SectionItem; section: Section } | null> {
  const sections = await getSections()
  for (const section of sections) {
    const item = section.items.find((it) => it.id === id)
    if (item) return { item, section }
  }
  return null
}

export default async function PublicacionDetailPage({ params }: Props) {
  const { id } = await params
  const found = await findItem(id)
  if (!found) notFound()

  const related = found.section.items.filter((it) => it.id !== id).slice(0, 3)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PublicacionDetalle item={found.item} section={found.section} related={related} />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
