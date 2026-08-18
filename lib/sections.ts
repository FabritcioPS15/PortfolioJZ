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
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
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

export const defaultSections: Section[] = [
  {
    id: 'default-investigaciones',
    title: 'INVESTIGACIONES',
    icon: 'search',
    type: 'carousel',
    link: '/investigaciones',
    order: 1,
    isVisible: true,
    items: [
      {
        id: 'default-inv-1',
        title:
          'Gestión del talento humano y desempeño organizacional: un análisis en el contexto peruano',
        meta: '2024',
        category: 'Investigación',
        author: 'José Luis Zelada',
        date: '2024-03-12T00:00:00.000Z',
        tags: ['Talento Humano', 'Desempeño', 'Perú'],
        image:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop',
        description:
          'Un análisis sobre cómo las prácticas de gestión del talento humano influyen directamente en el desempeño de las organizaciones peruanas.',
        content:
          'La gestión del talento humano se ha convertido en un factor estratégico clave para el éxito de las organizaciones en el contexto peruano. Este estudio analiza la relación entre las prácticas de gestión del talento y el desempeño organizacional.\n\nLa investigación se realizó con una muestra de empresas peruanas de distintos sectores, evaluando dimensiones como la atracción del talento, el desarrollo, la retención y el clima laboral.\n\nLos resultados evidencian una correlación positiva significativa entre las prácticas de gestión del talento y el desempeño organizacional, particularmente en las dimensiones de compromiso y productividad.\n\nSe concluye que las organizaciones que invierten en el desarrollo de su talento humano logran ventajas competitivas sostenibles en el tiempo.',
      },
      {
        id: 'default-inv-2',
        title: 'Impacto de la inteligencia artificial en la selección de personal',
        meta: '2023',
        category: 'Investigación',
        author: 'José Luis Zelada',
        date: '2023-09-20T00:00:00.000Z',
        tags: ['Inteligencia Artificial', 'Selección', 'RRHH'],
        image:
          'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&h=300&fit=crop',
        description:
          'Exploramos cómo la inteligencia artificial está transformando los procesos de reclutamiento y selección de personal.',
        content:
          'La inteligencia artificial está revolucionando la manera en que las organizaciones atraen y seleccionan talento. Este estudio examina el impacto de las herramientas basadas en IA en los procesos de selección de personal.\n\nSe analizaron casos de empresas que implementaron soluciones de IA para la preselección de candidatos, la evaluación de competencias y la reducción de sesgos.\n\nLos hallazgos muestran que la IA puede agilizar significativamente los procesos, pero requiere de supervisión humana para garantizar la equidad y evitar sesgos algorítmicos.\n\nLa recomendación principal es combinar la eficiencia de la tecnología con el criterio humano en las decisiones finales de contratación.',
      },
      {
        id: 'default-inv-3',
        title: 'Estrategias de retención de talento en la nueva normalidad',
        meta: '2023',
        category: 'Investigación',
        author: 'José Luis Zelada',
        date: '2023-04-05T00:00:00.000Z',
        tags: ['Retención', 'Talento', 'Nueva normalidad'],
        image:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        description:
          'Las mejores prácticas para retener al talento clave en un entorno laboral transformado por el trabajo híbrido y remoto.',
        content:
          'La nueva normalidad ha transformado profundamente el mundo laboral y con ello las estrategias de retención de talento. Este estudio identifica las prácticas más efectivas en el contexto actual.\n\nSe encuestó a profesionales y líderes de RRHH para comprender qué factores influyen en la decisión de permanecer o dejar una organización.\n\nEl desarrollo profesional, la flexibilidad laboral y el liderazgo cercano aparecen como los principales impulsores de la retención.\n\nLas organizaciones que adaptan sus estrategias a estas nuevas expectativas logran reducir significativamente la rotación de su talento clave.',
      },
    ],
  },
  {
    id: 'default-articulos',
    title: 'ARTÍCULOS',
    icon: 'book-open',
    type: 'carousel',
    link: '/articulos',
    order: 2,
    isVisible: true,
    items: [
      {
        id: 'default-art-1',
        title:
          'Liderazgo consciente: la clave para equipos comprometidos y organizaciones sostenibles',
        meta: 'Mayo 2024',
        category: 'Artículo',
        author: 'José Luis Zelada',
        date: '2024-05-15T00:00:00.000Z',
        tags: ['Liderazgo', 'Equipos', 'Sostenibilidad'],
        image:
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop',
        description:
          'El liderazgo consciente como motor del compromiso de los equipos y la sostenibilidad organizacional.',
        content:
          'El liderazgo consciente es una de las tendencias más poderosas en el desarrollo de equipos. Los líderes que se conocen a sí mismos y actúan con propósito logran equipos más comprometidos.\n\nUn líder consciente practica la escucha activa, la empatía y la transparencia, creando un entorno de confianza donde las personas se sienten valoradas.\n\nEl compromiso del equipo no se exige, se inspira. Cuando las personas entienden el propósito y ven coherencia en sus líderes, su compromiso se vuelve genuino.\n\nLas organizaciones que forman líderes conscientes construyen culturas sostenibles capaces de enfrentar los desafíos del futuro.',
      },
      {
        id: 'default-art-2',
        title: 'Cómo construir una cultura organizacional resiliente en tiempos de cambio',
        meta: 'Abril 2024',
        category: 'Artículo',
        author: 'José Luis Zelada',
        date: '2024-04-10T00:00:00.000Z',
        tags: ['Cultura', 'Resiliencia', 'Cambio'],
        image:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop',
        description:
          'Cinco pilares para que tu cultura organizacional resista y se fortalezca ante el cambio constante.',
        content:
          'La resiliencia organizacional no se improvisa: se construye intencionalmente a través de la cultura. En tiempos de cambio constante, las organizaciones resilientes destacan.\n\nEl primer pilar es el propósito compartido: las personas necesitan saber hacia dónde va la organización y por qué.\n\nEl segundo pilar es la comunicación transparente, que reduce la incertidumbre y fortalece la confianza.\n\nCompletan los pilares la flexibilidad, el aprendizaje continuo y el cuidado del bienestar de los equipos.\n\nConstruir estos pilares requiere liderazgo consciente y un compromiso genuino con los valores organizacionales.',
      },
      {
        id: 'default-art-3',
        title: 'El rol del feedback continuo en el desarrollo profesional de tu equipo',
        meta: 'Marzo 2024',
        category: 'Artículo',
        author: 'José Luis Zelada',
        date: '2024-03-18T00:00:00.000Z',
        tags: ['Feedback', 'Desarrollo', 'Equipos'],
        image:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=300&fit=crop',
        description:
          'Por qué el feedback continuo supera a la evaluación anual y cómo implementarlo en tu equipo.',
        content:
          'La evaluación de desempeño anual es cada vez menos suficiente. El feedback continuo se ha convertido en la herramienta más efectiva para el desarrollo profesional.\n\nDar feedback oportuno permite corregir el rumbo a tiempo y reconocer los logros en el momento en que ocurren.\n\nUn buen feedback es específico, orientado al comportamiento y enfocado en el futuro, no en juzgar a la persona.\n\nCrear una cultura de feedback requiere práctica y confianza. Los líderes deben modelar la recepción del feedback antes de pedirlo.',
      },
    ],
  },
  {
    id: 'default-publicaciones',
    title: 'PUBLICACIONES',
    icon: 'book-open',
    type: 'book',
    link: '/publicaciones',
    order: 3,
    isVisible: true,
    items: [
      {
        id: 'default-pub-1',
        title: 'Comunica, Lidera, Impacta',
        meta: 'José Luis Zelada',
        category: 'Libro',
        author: 'José Luis Zelada',
        date: '2025-01-15T00:00:00.000Z',
        tags: ['Comunicación', 'Liderazgo', 'Impacto'],
        image:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=600&fit=crop',
        description:
          'Una guía práctica para comunicar con claridad, liderar con propósito y dejar una huella real en tu equipo y organización.',
        content:
          'En "Comunica, Lidera, Impacta" comparto el método con el que acompaño a líderes y equipos a transformar su comunicación y su liderazgo.\n\nComunicar con claridad es la puerta de entrada: aprender a transmitir ideas que conecten con las personas y generen acción.\n\nLiderar con propósito implica conocerse a uno mismo, inspirar confianza y construir equipos comprometidos con una causa compartida.\n\nImpactar es el resultado natural cuando la comunicación y el liderazgo se alinean con valores auténticos.\n\nEste libro es para quienes quieren dejar de ser un jefe más y convertirse en líderes que transforman organizaciones y personas.',
      },
    ],
  },
]

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

  return {
    id: typeof row.id === 'string' ? row.id : newId(),
    title: typeof row.title === 'string' ? row.title : '',
    icon,
    type,
    link: typeof row.link === 'string' && row.link ? row.link : '/publicaciones',
    order: typeof row.order === 'number' ? row.order : 0,
    isVisible:
      typeof row.is_visible === 'boolean'
        ? row.is_visible
        : typeof row.isVisible === 'boolean'
          ? row.isVisible
          : true,
    items,
  }
}

export async function getSections(): Promise<Section[]> {
  if (!supabase) return defaultSections

  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('order', { ascending: true })

  if (error) return defaultSections
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
  return { item, section }
}
