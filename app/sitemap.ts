import { MetadataRoute } from 'next'
import { getSections } from '@/lib/sections'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joseluiszelada.pe'

  const sections = await getSections()
  
  const routes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/publicaciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  const dynamicRoutes = sections.flatMap((section) => {
    return section.items
      .filter((item) => item.content && item.content.trim() !== '')
      .map((item) => {
        const sectionBase = section.link && section.link.startsWith('/')
          ? section.link.replace(/\/+$/, '')
          : '/publicaciones'
          
        return {
          url: `${baseUrl}${sectionBase}/${item.id}`,
          lastModified: item.date ? new Date(item.date) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }
      })
  })

  return [...routes, ...dynamicRoutes]
}
