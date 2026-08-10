import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  BookOpen,
  Star,
  Clock,
  ChevronRight,
  Quote,
  ArrowRight,
} from 'lucide-react'
import BookCover from './BookCover'
import { readingTime } from '@/lib/readingTime'
import { itemHref, type Section, type SectionItem } from '@/lib/sections'

const CONTACT_MAIL = 'mailto:contacto@joseluiszelada.pe'

function formatDate(iso?: string): string | null {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

function yearOf(iso?: string, meta?: string): string | null {
  if (iso) {
    try {
      const y = new Date(iso).getFullYear()
      if (!Number.isNaN(y)) return String(y)
    } catch {
      /* ignore */
    }
  }
  return meta || null
}

function Paragraphs({ content, dropCap = false }: { content: string; dropCap?: boolean }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) {
    return <p className="text-sm text-gray-400">Esta publicación aún no tiene contenido.</p>
  }

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className={`text-[15px] md:text-base text-gray-600 leading-relaxed whitespace-pre-line ${
            dropCap && i === 0 && paragraph.length > 60
              ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-brand-gold first-letter:leading-[0.85] first-letter:mt-1'
              : ''
          }`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function Tags({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className="flex items-center gap-2 flex-wrap mt-10 pt-6 border-t border-gray-100">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
        Etiquetas:
      </span>
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full bg-cream/60 border border-brand-gold/20 text-[11px] text-brand-navy font-semibold hover:bg-cream hover:border-brand-gold/50 transition-colors"
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}

function MetaBadges({ item }: { item: SectionItem }) {
  const formattedDate = formatDate(item.date)
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {item.category && (
        <span className="inline-flex px-3 py-1 rounded-full bg-cream text-brand-gold text-[10px] font-bold uppercase tracking-wider">
          {item.category}
        </span>
      )}
      {item.featured && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
          <Star size={11} /> Destacado
        </span>
      )}
      {item.meta && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] text-gray-500 font-semibold">
          <Calendar size={11} /> {item.meta}
        </span>
      )}
      {formattedDate && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] text-gray-500 font-semibold">
          <Calendar size={11} /> {formattedDate}
        </span>
      )}
      {item.content && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] text-gray-500 font-semibold">
          <Clock size={11} /> {readingTime(item.content)}
        </span>
      )}
    </div>
  )
}

function Breadcrumbs({ title, section }: { title: string; section: Section }) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-5 flex-wrap">
      <Link href="/" className="hover:text-brand-gold transition-colors">
        Inicio
      </Link>
      <ChevronRight size={11} />
      <Link href={section.link || '/publicaciones'} className="hover:text-brand-gold transition-colors">
        {section.title}
      </Link>
      <ChevronRight size={11} />
      <span className="text-brand-navy font-semibold truncate max-w-[260px]">{title}</span>
    </nav>
  )
}

function Related({ related, section }: { related: SectionItem[]; section: Section }) {
  if (!related || related.length === 0) return null
  return (
    <div className="mt-14">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-sm md:text-base font-serif font-bold text-brand-navy uppercase tracking-wider">
          Sigue leyendo
        </h3>
        <span className="h-px flex-1 bg-brand-gold/30"></span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((rel) => (
          <Link
            key={rel.id}
            href={itemHref(rel, section)}
            className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-gray-100 hover:border-brand-gold/40"
          >
            <span className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></span>
            <div className="relative w-full h-28 overflow-hidden bg-gray-100">
              {rel.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rel.image}
                  alt={rel.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-navy/10 to-brand-gold/10"></div>
              )}
              {rel.category && (
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur text-brand-navy text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  {rel.category}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2 flex-grow">
              <h4 className="font-serif font-bold text-sm text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors">
                {rel.title}
              </h4>
              <span className="mt-auto pt-2 text-[11px] font-bold text-brand-navy inline-flex items-center gap-1">
                Leer más
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ------------------------- Diseño de artículo ------------------------- */
function ArticleLayout({
  item,
  section,
  related,
}: {
  item: SectionItem
  section: Section
  related: SectionItem[]
}) {
  return (
    <>
      <section className="relative pt-28 md:pt-40 pb-10 md:pb-14 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[420px] h-[420px] bg-brand-navy/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs title={item.title} section={section} />
          <div className="mb-4">
            <MetaBadges item={item} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight text-balance mb-4">
            {item.title}
          </h1>
          {item.author && (
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream border border-brand-gold/30">
                <User size={15} className="text-brand-gold" />
              </span>
              Por <span className="font-semibold text-brand-navy">{item.author}</span>
            </p>
          )}
        </div>
      </section>

      {item.image && (
        <section className="pb-10 md:pb-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-brand-navy/10 rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 md:pb-24 bg-gray-50 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <article className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 md:px-10 md:py-12">
            {item.description && (
              <blockquote className="relative mb-8 pl-5 border-l-4 border-brand-gold">
                <Quote
                  size={18}
                  className="absolute -top-3 left-0 text-brand-gold/40 -scale-x-100"
                />
                <p className="text-lg md:text-xl text-gray-600 font-serif italic leading-relaxed pl-8">
                  {item.description}
                </p>
              </blockquote>
            )}
            {item.content ? (
              <Paragraphs content={item.content} dropCap />
            ) : (
              <p className="text-sm text-gray-400">Esta publicación aún no tiene contenido.</p>
            )}
            <Tags tags={item.tags} />
            {item.link && (
              <div className="mt-8">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <ExternalLink size={14} className="text-brand-gold" /> Ver publicación completa
                </a>
              </div>
            )}
          </article>

          <Related related={related} section={section} />

          <div className="mt-10 text-center">
            <Link
              href={section.link || '/publicaciones'}
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors"
            >
              <ArrowLeft size={14} /> Ver más {section.title.toLowerCase()}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------- Diseño de libro ------------------------- */
function BookLayout({
  item,
  section,
  related,
}: {
  item: SectionItem
  section: Section
  related: SectionItem[]
}) {
  const facts = [
    { label: 'Año', value: yearOf(item.date, item.meta) },
    { label: 'Categoría', value: item.category },
    { label: 'Autor', value: item.author },
  ].filter((f) => f.value)

  return (
    <>
      <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumbs title={item.title} section={section} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mt-4">
            {/* Portada */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-5 bg-brand-gold/10 rounded-2xl transform rotate-3"></div>
                <div className="absolute -inset-5 bg-brand-navy/5 rounded-2xl transform -rotate-2"></div>
                <div className="relative transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
                  <BookCover title={item.title} author={item.meta} size="lg" />
                </div>
                {item.featured && (
                  <div className="absolute -top-4 -right-4 z-20 px-3.5 py-1.5 rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold uppercase tracking-wider shadow-lg rotate-3">
                    <Star size={10} className="inline mr-1 -mt-0.5" /> Destacado
                  </div>
                )}
              </div>
            </div>

            {/* Detalles */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <MetaBadges item={item} />
              </div>

              <div className="space-y-2">
                <p className="text-brand-gold text-[11px] font-bold uppercase tracking-[0.25em]">
                  {section.title}
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy leading-tight text-balance">
                  {item.title}
                </h1>
              </div>

              {facts.length > 0 && (
                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  {facts.map((fact) => (
                    <span
                      key={fact.label}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] text-gray-500 font-medium"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        {fact.label}
                      </span>
                      <span className="font-semibold text-brand-navy">{fact.value}</span>
                    </span>
                  ))}
                </div>
              )}

              {item.description && (
                <p className="text-base md:text-lg text-gray-600 font-serif italic leading-relaxed max-w-xl mx-auto lg:mx-0">
                  “{item.description}”
                </p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-cream/60 border border-brand-gold/20 text-[11px] text-brand-navy font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <a
                  href={item.link || CONTACT_MAIL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <BookOpen size={15} className="text-brand-gold" /> Solicitar ejemplar
                </a>
                <Link
                  href={section.link || '/publicaciones'}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-gray-200 text-brand-navy text-xs font-bold tracking-wider uppercase hover:border-brand-navy hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={14} /> Ver {section.title.toLowerCase()}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre el libro */}
      <section className="pb-16 md:pb-24 bg-gray-50 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center">
              <BookOpen size={16} className="text-brand-gold" />
            </div>
            <h2 className="text-lg md:text-2xl font-serif font-bold text-brand-navy tracking-wider uppercase">
              Sobre el libro
            </h2>
            <span className="h-px flex-1 bg-brand-gold/30"></span>
          </div>

          <article className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 md:px-10 md:py-12">
            {item.content ? (
              <Paragraphs content={item.content} dropCap />
            ) : (
              <p className="text-sm text-gray-400">
                Próximamente más información sobre este libro.
              </p>
            )}
            <Tags tags={item.tags} />
          </article>

          <Related related={related} section={section} />

          <div className="mt-10 text-center">
            <Link
              href={section.link || '/publicaciones'}
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors"
            >
              <ArrowLeft size={14} /> Ver más {section.title.toLowerCase()}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* Componente reutilizable: decide el diseño según el tipo de sección */
export default function PublicacionDetalle({
  item,
  section,
  related = [],
}: {
  item: SectionItem
  section: Section
  related?: SectionItem[]
}) {
  return section.type === 'book' ? (
    <BookLayout item={item} section={section} related={related} />
  ) : (
    <ArticleLayout item={item} section={section} related={related} />
  )
}
