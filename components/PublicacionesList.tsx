'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import type { Section, SectionItem } from '@/lib/sections'
import { itemHref } from '@/lib/sections'
import { SectionIcon } from './SectionCarouselCard'
import BookCover from './BookCover'
import PublicacionCard from './PublicacionCard'

const CONTACT_MAIL = 'mailto:contacto@joseluiszelada.pe'

const CATEGORIES = ['Todo', 'Investigaciones', 'Artículos', 'Libros']

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function matches(item: SectionItem, query: string, category: string) {
  let catOk = category === 'Todo'
  if (!catOk) {
    const itemCat = item.category || ''
    if (category === 'Investigaciones') {
      catOk = itemCat === 'Investigación' || itemCat === 'Investigaciones'
    } else if (category === 'Artículos') {
      catOk = itemCat === 'Artículo' || itemCat === 'Artículos'
    } else if (category === 'Libros') {
      catOk = itemCat === 'Libro' || itemCat === 'Libros'
    } else {
      catOk = itemCat === category
    }
  }
  if (!catOk) return false
  const q = normalize(query.trim())
  if (!q) return true
  const haystack = normalize(
    [item.title, item.description, item.author, item.category, item.meta, (item.tags || []).join(' ')]
      .filter(Boolean)
      .join(' ')
  )
  return haystack.includes(q)
}

export default function PublicacionesList({ sections }: { sections: Section[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todo')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.05 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  const entrance = (delay?: string) => {
    if (!mounted) return undefined
    if (!isVisible) return { opacity: 0 }
    return {
      opacity: 0,
      animationName: 'fadeInUp',
      animationDuration: '0.6s',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
      animationDelay: delay,
    }
  }

  const total = useMemo(
    () => sections.reduce((acc, s) => acc + s.items.length, 0),
    [sections]
  )

  if (sections.length === 0) {
    return (
      <div className="text-center py-20 text-sm text-gray-600">
        Aún no hay publicaciones. Vuelve pronto.
      </div>
    )
  }

  const visibleSections = sections
    .map((section) => ({
      section,
      items: section.items.filter((item) => matches(item, query, category)),
    }))
    .filter((entry) => entry.items.length > 0)

  const visibleCount = visibleSections.reduce((acc, e) => acc + e.items.length, 0)

  return (
    <div ref={containerRef} className="space-y-16">
      {/* Toolbar: búsqueda + filtros */}
      <div
        className="sticky top-20 z-30 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
        style={entrance()}
      >
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor o etiqueta…"
            className="w-full pl-11 pr-9 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-brand-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 transition"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                category === c
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-brand-gold/60 hover:text-brand-navy'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Contador de resultados */}
      <p className="text-xs text-gray-500 font-medium -mt-8">
        Mostrando {visibleCount} de {total} publicaciones
      </p>

      {visibleSections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-600">Sin resultados para tu búsqueda.</p>
          <button
            onClick={() => {
              setQuery('')
              setCategory('Todo')
            }}
            className="mt-3 text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        visibleSections.map(({ section, items }, sectionIndex) => {
          return (
            <div
              key={section.id}
              className="border-t border-gray-100 pt-10"
              style={entrance(`${0.1 + sectionIndex * 0.1}s`)}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center">
                  <SectionIcon icon={section.icon} size={18} />
                </div>
                <h2 className="text-lg md:text-2xl font-serif font-bold text-brand-navy tracking-wider uppercase">
                  {section.title}
                </h2>
                <span className="h-px flex-1 bg-brand-gold/30"></span>
                <span className="text-[11px] text-gray-600 font-semibold whitespace-nowrap">
                  {items.length} {items.length === 1 ? 'publicación' : 'publicaciones'}
                </span>
              </div>

              {section.type === 'book' ? (
                <div className="max-w-3xl bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-gold/40">
                  {items.map((item) => (
                    <div key={item.id} className="relative grid grid-cols-12 gap-5 p-6 md:p-8 items-center">
                      <span className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold to-transparent"></span>
                      <div className="col-span-4 sm:col-span-3 flex justify-center">
                        <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                          <BookCover title={item.title} author={item.meta} size="sm" />
                        </div>
                      </div>
                      <div className="col-span-8 sm:col-span-9 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.category && (
                            <span className="px-3 py-1 rounded-full bg-cream text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                              {item.category}
                            </span>
                          )}
                          {item.featured && (
                            <span className="px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                              ★ Destacado
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-lg md:text-xl text-brand-navy leading-snug">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 pt-1">
                          <Link
                            href={itemHref(item, section)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-navy text-white text-[11px] font-bold tracking-wider uppercase hover:bg-brand-navy/90 hover:shadow-lg transition-all duration-300"
                          >
                            Conocer más <ArrowRight size={13} className="text-brand-gold" />
                          </Link>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-gold/50 text-brand-navy text-[11px] font-bold tracking-wider uppercase hover:bg-cream hover:border-brand-gold transition-colors duration-300"
                            >
                              Solicitar ejemplar
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, itemIndex) => (
                    <PublicacionCard
                      key={item.id}
                      item={item}
                      section={section}
                      href={itemHref(item, section)}
                      compact
                      entranceStyle={entrance(`${0.1 + sectionIndex * 0.1 + itemIndex * 0.05}s`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
