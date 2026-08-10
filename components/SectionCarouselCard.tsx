'use client'

import { useEffect, useState } from 'react'
import { Search, BookOpen, PenTool, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { itemHref, type Section } from '@/lib/sections'

export const SECTION_ICONS = {
  search: Search,
  'book-open': BookOpen,
  'pen-tool': PenTool,
} as const

export function SectionIcon({ icon, size = 16 }: { icon: keyof typeof SECTION_ICONS; size?: number }) {
  const Icon = SECTION_ICONS[icon] ?? Search
  return <Icon size={size} className="text-brand-navy" />
}

export default function SectionCarouselCard({
  section,
  isVisible,
  delay = '0.2s',
}: {
  section: Section
  isVisible: boolean
  delay?: string
}) {
  const items = section.items
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [items.length])

  const viewAll = section.link || '/publicaciones'

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-dashed border-gray-200"
        style={{
          animationName: isVisible ? 'fadeInUp' : 'none',
          animationDuration: '0.6s',
          animationTimingFunction: 'ease-out',
          animationFillMode: 'forwards',
          animationDelay: delay,
          opacity: 0,
        }}
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SectionIcon icon={section.icon} />
            <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
              {section.title}
            </p>
          </div>
          <Link href={viewAll} className="text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300">
            Ver todas
          </Link>
        </div>
        <div className="flex-grow flex items-center justify-center p-10 text-xs text-gray-400">
          Sin ítems todavía
        </div>
      </div>
    )
  }

  return (
    <div
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      style={{
        animationName: isVisible ? 'fadeInUp' : 'none',
        animationDuration: '0.6s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: delay,
        opacity: 0,
      }}
    >
      {/* Header bar */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <Link
          href={viewAll}
          className="flex items-center gap-2 group/title min-w-0"
        >
          <SectionIcon icon={section.icon} />
          <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase truncate group-hover/title:text-brand-gold transition-colors duration-300">
            {section.title}
          </p>
        </Link>
        <Link href={viewAll} className="text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300 flex-shrink-0 ml-3">
          Ver todas
        </Link>
      </div>

      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                priority={index === 0}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                  {section.title}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between relative overflow-hidden">
        <div className="relative h-24">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 space-y-2 ${index === current ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
            >
              <h3 className="font-serif font-bold text-base text-brand-navy leading-snug line-clamp-3">
                {item.title}
              </h3>
              <div className="flex items-center gap-2">
                {item.category && (
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-cream text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                )}
                {item.meta && <p className="text-xs text-gray-400 font-medium">{item.meta}</p>}
              </div>
              {item.author && (
                <p className="text-[11px] text-gray-500 font-medium">Por {item.author}</p>
              )}
            </div>
          ))}
        </div>
        <div className="pt-4 flex flex-col gap-4 mt-auto z-10 bg-white">
          <a
            href={itemHref(items[current], section)}
            className="text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors duration-300 inline-flex items-center gap-1"
          >
            Leer más <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 pt-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current ? 'w-4 bg-brand-gold' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
            {items.length > 1 && (
              <span className="flex items-center gap-1 ml-2 text-gray-300">
                <ChevronLeft size={12} onClick={() => setCurrent((prev) => (prev - 1 + items.length) % items.length)} className="cursor-pointer hover:text-brand-gold" />
                <ChevronRight size={12} onClick={() => setCurrent((prev) => (prev + 1) % items.length)} className="cursor-pointer hover:text-brand-gold" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
