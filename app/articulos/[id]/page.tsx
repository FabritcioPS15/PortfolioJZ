import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import SectionItemDetail from '@/components/SectionItemDetail'
import { getSectionItem } from '@/lib/sections'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const found = await getSectionItem('/articulos', id)
  if (!found) return { title: 'Artículo no encontrado | José Luis Zelada' }
  return {
    title: `${found.item.title} | José Luis Zelada`,
    description: found.item.description || found.item.content?.slice(0, 160) || undefined,
  }
}

export default async function ArticuloDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <SectionItemDetail sectionLink="/articulos" itemId={id} />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
