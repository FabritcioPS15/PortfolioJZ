import { getSections } from '@/lib/sections'
import FeaturedGrid from './FeaturedGrid'

export default async function Featured() {
  const sections = await getSections()
  return <FeaturedGrid sections={sections} />
}
