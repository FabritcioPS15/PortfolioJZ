import { notFound } from 'next/navigation'
import PublicacionDetalle from './PublicacionDetalle'
import { getSectionItem } from '@/lib/sections'

export default async function SectionItemDetail({
  sectionLink,
  itemId,
}: {
  sectionLink: string
  itemId: string
}) {
  const found = await getSectionItem(sectionLink, itemId)
  if (!found) notFound()

  const related = found.section.items.filter((it) => it.id !== itemId).slice(0, 3)

  return <PublicacionDetalle item={found.item} section={found.section} related={related} />
}
