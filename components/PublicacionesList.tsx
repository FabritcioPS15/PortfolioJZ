'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Clock, ArrowRight, User } from 'lucide-react'
import type { Section, SectionItem } from '@/lib/sections'
import { itemHref } from '@/lib/sections'
import { SectionIcon } from './SectionCarouselCard'
import BookCover from './BookCover'
import { readingTime } from '@/lib/readingTime'

const CONTACT_MAIL = 'mailto:contacto@joseluiszelada.pe'

const CATEGORIES = ['Todo', 'Consultoría', 'Investigación', 'Artículo', 'Libro']

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function matches(item: SectionItem, query: string, category: string) {
  const catOk = category === 'Todo' || (item.category || '') === category
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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todo')

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

  const total = useMemo(
    () => sections.reduce((acc, s) => acc + s.items.length, 0),
    [sections]
  )

  if (sections.length === 0) {
    return (
      <div className="text-center py-20 text-sm text-gray-400">
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
        style={{
          animationName: isVisible ? 'fadeInUp' : 'none',
          animationDuration: '0.6s',
          animationTimingFunction: 'ease-out',
          animationFillMode: 'forwards',
          opacity: 0,
        }}
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
      <p className="text-xs text-gray-400 font-medium -mt-8">
        Mostrando {visibleCount} de {total} publicaciones
      </p>

      {visibleSections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-400">Sin resultados para tu búsqueda.</p>
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
          const animationDelay = `${0.1 + sectionIndex * 0.1}s`

          return (
            <div
              key={section.id}
              className="border-t border-gray-100 pt-10"
              style={{
                animationName: isVisible ? 'fadeInUp' : 'none',
                animationDuration: '0.6s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay,
                opacity: 0,
              }}
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
                <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap">
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
                    <Link
                      key={item.id}
                      href={itemHref(item, section)}
                      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-brand-gold/40"
                      style={{
                        animationName: isVisible ? 'fadeInUp' : 'none',
                        animationDuration: '0.6s',
                        animationTimingFunction: 'ease-out',
                        animationFillMode: 'forwards',
                        animationDelay: `${0.1 + sectionIndex * 0.1 + itemIndex * 0.05}s`,
                        opacity: 0,
                      }}
                    >
                      {/* Accent superior dorado */}
                      <span className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></span>

                      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={500}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 flex items-center justify-center">
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                              {section.title}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {item.category && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-brand-navy text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {item.category}
                          </span>
                        )}
                        {item.meta && (
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-navy/85 text-white text-[10px] font-semibold tracking-wide">
                            {item.meta}
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-2 flex-grow">
                        <h3 className="font-serif font-bold text-base text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors duration-300">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2 mt-auto pt-3">
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 min-w-0">
                            {item.author && (
                              <span className="inline-flex items-center gap-1 truncate">
                                <User size={12} className="text-brand-gold flex-shrink-0" />
                                <span className="truncate">{item.author}</span>
                              </span>
                            )}
                            {item.content && (
                              <span className="inline-flex items-center gap-1 flex-shrink-0">
                                <Clock size={12} className="text-brand-gold" /> {readingTime(item.content)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-brand-navy inline-flex items-center gap-1 flex-shrink-0 group-hover:text-brand-gold transition-colors">
                            Leer más <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {item.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] text-gray-400"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
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
