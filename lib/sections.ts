import { supabase } from './supabase'

export type SectionIcon = 'search' | 'book-open' | 'pen-tool' | 'briefcase'
export type SectionType = 'carousel' | 'book'

export interface SectionItem {
  id: string
  title: string
  meta: string
  description?: string
  image?: string
  link?: string
  category?: string
  author?: string
  date?: string
  tags?: string[]
  content?: string
  featured?: boolean
}

export interface Section {
  id: string
  title: string
  icon: SectionIcon
  type: SectionType
  link?: string
  order: number
  isVisible: boolean
  items: SectionItem[]
}

export function newId(): string {
  const c = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()

  const bytes = c?.getRandomValues ? c.getRandomValues(new Uint8Array(16)) : null
  if (bytes) {
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  const rnd = (n: number) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return `${rnd(8)}-${rnd(4)}-4${rnd(3)}-${['8', '9', 'a', 'b'][Math.floor(Math.random() * 4)]}${rnd(3)}-${rnd(12)}`
}

export function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

// Prioridad de destino de un ítem:
// 1) Página propia si tiene contenido (con la URL de su sección),
// 2) enlace externo del ítem, 3) enlace de la sección.
export function itemHref(item: SectionItem, section: Section): string {
  if (item.content && item.content.trim()) {
    const base =
      section.link && section.link.startsWith('/')
        ? section.link.replace(/\/+$/, '')
        : '/publicaciones'
    return `${base}/${item.id}`
  }
  if (item.link) return item.link
  return section.link || '/publicaciones'
}

export function defaultSection(order: number): Section {
  return {
    id: newId(),
    title: 'NUEVA SECCIÓN',
    icon: 'search',
    type: 'carousel',
    link: '/publicaciones',
    order,
    isVisible: true,
    items: [
      {
        id: newId(),
        title: 'Título del artículo',
        meta: '2025',
        category: 'Investigación',
        author: 'José Luis Zelada',
        description: 'Resumen breve del artículo.',
        image:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop',
      },
    ],
  }
}

export function normalizeSection(row: Record<string, unknown> | null | undefined): Section | null {
  if (!row) return null

  const items = Array.isArray(row.items)
    ? (row.items as unknown[]).map((it) => {
      const item = (it ?? {}) as Record<string, unknown>
      return {
        id: typeof item.id === 'string' && item.id ? item.id : newId(),
        title: typeof item.title === 'string' ? item.title : '',
        meta: typeof item.meta === 'string' ? item.meta : '',
        description:
          typeof item.description === 'string' ? item.description : undefined,
        image: typeof item.image === 'string' && item.image ? item.image : undefined,
        link: typeof item.link === 'string' && item.link ? item.link : undefined,
        category:
          typeof item.category === 'string' && item.category ? item.category : undefined,
        author:
          typeof item.author === 'string' && item.author ? item.author : undefined,
        date: typeof item.date === 'string' && item.date ? item.date : undefined,
        tags:
          Array.isArray(item.tags) &&
            item.tags.every((t) => typeof t === 'string')
            ? item.tags
            : undefined,
        content:
          typeof item.content === 'string' && item.content ? item.content : undefined,
        featured:
          typeof item.featured === 'boolean' ? item.featured : undefined,
      } satisfies SectionItem
    })
    : []

  const type = row.type === 'book' ? 'book' : 'carousel'
  const icon: SectionIcon =
    row.icon === 'book-open' || row.icon === 'pen-tool' || row.icon === 'briefcase'
      ? row.icon
      : 'search'

  // La columna puede llamarse is_visible (PostgREST) o isVisible (JSON).
  const rowIsVisible =
    typeof row.isVisible === 'boolean'
      ? row.isVisible
      : typeof row.is_visible === 'boolean'
        ? row.is_visible
        : true

  return {
    id: typeof row.id === 'string' ? row.id : newId(),
    title: typeof row.title === 'string' ? row.title : '',
    icon,
    type,
    link: typeof row.link === 'string' && row.link ? row.link : '/publicaciones',
    order: typeof row.order === 'number' ? row.order : 0,
    isVisible: typeof row.isVisible === 'boolean' ? row.isVisible : true,
    items,
  }
}

export async function getSections(): Promise<Section[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('order', { ascending: true })

  if (error) return []
  if (!data || data.length === 0) return []

  return data
    .map(normalizeSection)
    .filter((s): s is Section => s !== null)
    .filter((s) => s.isVisible !== false)
}

export async function getSectionByLink(link: string): Promise<Section | null> {
  const sections = await getSections()
  return sections.find((s) => s.link === link) ?? null
}

export async function getSectionItem(
  link: string,
  id: string
): Promise<{ item: SectionItem; section: Section } | null> {
  const section = await getSectionByLink(link)
  if (!section) return null
  const item = section.items.find((it) => it.id === id)
  if (!item) return null

  // Payload mínimo al cliente: la página de detalle solo usa título/enlace/tipo de la
  // sección; los "relacionados" se limitan a 3 y sin el contenido pesado.
  const stripContent = (it: SectionItem): SectionItem => {
    const { content, ...rest } = it
    return rest
  }

  return {
    item,
    section: {
      id: section.id,
      title: section.title,
      icon: section.icon,
      type: section.type,
      link: section.link,
      order: section.order,
      isVisible: true,
      items: section.items.filter((it) => it.id !== id).slice(0, 3).map(stripContent),
    },
  }
}
